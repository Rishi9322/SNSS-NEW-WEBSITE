import path from "path";
import fs from "fs/promises";
import {
  OUTPUT_DIR,
  CATEGORIES,
  slugify,
  writeJsonl,
  ensureOutputDir,
  createCase,
  nowIso,
  mulberry32,
  pick,
} from "./lib.mjs";

const COUNT_PER_CATEGORY = 39;

const STATES = ["Maharashtra", "Karnataka", "Gujarat", "Delhi", "Tamil Nadu", "Telangana"];
const SECTORS = ["IT", "Logistics", "Manufacturing", "Retail", "Healthcare", "Education"];
const ENTITIES = ["vendor", "employer", "contractor", "HR manager", "procurement officer", "project lead"];
const ROLES = ["employee", "employer", "worker", "contract staff", "vendor", "administrator"];
const PEOPLE = ["Asha", "Rohan", "Meera", "Imran", "Neha", "Arjun", "Priya", "Vikram"];
const CITIES = ["Mumbai", "Pune", "Bengaluru", "Ahmedabad", "Delhi", "Hyderabad", "Chennai"];

function choice(list, seed) {
  return list[seed % list.length];
}

function mkComplianceQuestion({ domain, subject, state, entity, amount, extra }) {
  return `In ${state}, a ${entity} asks about ${subject} for ${domain}. ${extra}`;
}

function mkScenarioQuestion({ actor, action, state, detail, ask }) {
  return `${actor} in ${state} ${action}. ${detail} ${ask}`;
}

function mkCalcQuestion({ subject, valueA, valueB, unit, ask }) {
  return `${subject}: ${valueA}${unit ? ` ${unit}` : ""} and ${valueB}${unit ? ` ${unit}` : ""}. ${ask}`;
}

function mkReadingPassage(theme, facts) {
  return `${theme}\n\n${facts.map((line) => `- ${line}`).join("\n")}`;
}

function makeLongContextSpec(seed, targetTokens, contradictionType) {
  return {
    type: "policy-doc",
    seed,
    targetTokens,
    contradictionType,
    prompt: "Identify the latest policy position and the contradiction in the document.",
  };
}

function baseCase(category, index, overrides) {
  const difficultyCycle = ["easy", "medium", "hard", "expert"];
  return createCase({
    category,
    index,
    difficulty: difficultyCycle[index % difficultyCycle.length],
    maxScore: 10,
    ...overrides,
  });
}

function genericLegalCases(category, spec, index) {
  const item = spec.items[index % spec.items.length];
  const actor = PEOPLE[index % PEOPLE.length];
  const state = STATES[index % STATES.length];
  const entity = ENTITIES[index % ENTITIES.length];
  const role = ROLES[index % ROLES.length];
  const city = CITIES[index % CITIES.length];

  const question = spec.question(item, { actor, state, entity, role, city, index });
  const answer = spec.answer(item, { actor, state, entity, role, city, index });

  return baseCase(category, index, {
    question,
    expectedReasoningSteps: spec.steps(item, { actor, state, entity, role, city, index }),
    expectedAnswer: answer,
    acceptableAlternativeAnswers: spec.alternatives?.(item, { actor, state, entity, role, city, index }) || [],
    requiredCitations: spec.citations(item, { actor, state, entity, role, city, index }),
    commonHallucinations: spec.hallucinations,
    commonMistakes: spec.mistakes,
    partialCreditRubric: spec.rubric,
    tags: spec.tags,
    requiresWebSearch: !!spec.requiresWebSearch,
    reference: spec.reference,
  });
}

function calcCases(category, spec, index) {
  const item = spec.items[index % spec.items.length];
  const question = spec.question(item, index);
  const expected = spec.answer(item, index);
  return baseCase(category, index, {
    question,
    expectedReasoningSteps: spec.steps(item, index),
    expectedAnswer: expected.answer,
    acceptableAlternativeAnswers: expected.alternatives,
    requiredCitations: spec.citations(item, index),
    commonHallucinations: spec.hallucinations,
    commonMistakes: spec.mistakes,
    partialCreditRubric: spec.rubric,
    tags: spec.tags,
    requiresWebSearch: !!spec.requiresWebSearch,
    reference: spec.reference,
  });
}

function reasoningCases(category, spec, index) {
  const item = spec.items[index % spec.items.length];
  const question = spec.question(item, index);
  const answer = spec.answer(item, index);
  return baseCase(category, index, {
    question,
    expectedReasoningSteps: spec.steps(item, index),
    expectedAnswer: answer,
    acceptableAlternativeAnswers: spec.alternatives?.(item, index) || [],
    requiredCitations: spec.citations(item, index),
    commonHallucinations: spec.hallucinations,
    commonMistakes: spec.mistakes,
    partialCreditRubric: spec.rubric,
    tags: spec.tags,
    requiresToolUse: !!spec.requiresToolUse,
    requiresWebSearch: !!spec.requiresWebSearch,
    reference: spec.reference,
    contextSpec: spec.contextSpec?.(item, index) || null,
    expectedContextTokens: spec.expectedContextTokens?.(item, index) || null,
  });
}

function codingCases(category, spec, index) {
  const item = spec.items[index % spec.items.length];
  const question = spec.question(item, index);
  const answer = spec.answer(item, index);
  return baseCase(category, index, {
    question,
    expectedReasoningSteps: spec.steps(item, index),
    expectedAnswer: answer,
    acceptableAlternativeAnswers: spec.alternatives?.(item, index) || [],
    requiredCitations: spec.citations(item, index),
    commonHallucinations: spec.hallucinations,
    commonMistakes: spec.mistakes,
    partialCreditRubric: spec.rubric,
    tags: spec.tags,
    reference: spec.reference,
  });
}

function longContextCases(category, spec, index) {
  const item = spec.items[index % spec.items.length];
  return baseCase(category, index, {
    question: item.question,
    expectedReasoningSteps: item.steps,
    expectedAnswer: item.answer,
    acceptableAlternativeAnswers: item.alternatives,
    requiredCitations: item.citations,
    commonHallucinations: item.hallucinations,
    commonMistakes: item.mistakes,
    partialCreditRubric: item.rubric,
    tags: ["long-context", "contradiction-detection"],
    requiresToolUse: false,
    requiresWebSearch: false,
    contextSpec: makeLongContextSpec(index, item.targetTokens, item.contradictionType),
    expectedContextTokens: item.targetTokens,
    reference: item.reference,
  });
}

function readingCases(category, spec, index) {
  const item = spec.items[index % spec.items.length];
  return baseCase(category, index, {
    question: item.question,
    expectedReasoningSteps: item.steps,
    expectedAnswer: item.answer,
    acceptableAlternativeAnswers: item.alternatives,
    requiredCitations: item.citations,
    commonHallucinations: item.hallucinations,
    commonMistakes: item.mistakes,
    partialCreditRubric: item.rubric,
    tags: ["reading-comprehension"],
    reference: item.reference,
  });
}

function researchCases(category, spec, index) {
  const item = spec.items[index % spec.items.length];
  return baseCase(category, index, {
    question: item.question,
    expectedReasoningSteps: item.steps,
    expectedAnswer: item.answer,
    acceptableAlternativeAnswers: item.alternatives,
    requiredCitations: item.citations,
    commonHallucinations: item.hallucinations,
    commonMistakes: item.mistakes,
    partialCreditRubric: item.rubric,
    tags: ["research", "source-ranking"],
    requiresWebSearch: true,
    requiresToolUse: true,
    reference: item.reference,
  });
}

function planningCases(category, spec, index) {
  const item = spec.items[index % spec.items.length];
  return baseCase(category, index, {
    question: item.question,
    expectedReasoningSteps: item.steps,
    expectedAnswer: item.answer,
    acceptableAlternativeAnswers: item.alternatives,
    requiredCitations: item.citations,
    commonHallucinations: item.hallucinations,
    commonMistakes: item.mistakes,
    partialCreditRubric: item.rubric,
    tags: ["planning", "sequencing"],
    requiresToolUse: !!item.requiresToolUse,
    reference: item.reference,
  });
}

function decisionCases(category, spec, index) {
  const item = spec.items[index % spec.items.length];
  return baseCase(category, index, {
    question: item.question,
    expectedReasoningSteps: item.steps,
    expectedAnswer: item.answer,
    acceptableAlternativeAnswers: item.alternatives,
    requiredCitations: item.citations,
    commonHallucinations: item.hallucinations,
    commonMistakes: item.mistakes,
    partialCreditRubric: item.rubric,
    tags: ["decision-making"],
    reference: item.reference,
  });
}

const CATEGORY_SPECS = {
  "Labour Law": {
    kind: "legal",
    items: [
      { topic: "termination without notice", answer: "Explain whether notice pay or retrenchment compensation may be due, depending on workman status and contract terms." },
      { topic: "unpaid wages", answer: "State that unpaid wages should be documented and pursued through payroll, HR, and the labour authority if needed." },
      { topic: "leave denial", answer: "State that leave entitlements depend on the applicable state Shops and Establishments rules and policy." },
    ],
    question: (item, ctx) => mkScenarioQuestion({
      actor: `${ctx.actor} (${ctx.role})`,
      action: `faces ${item.topic} in a ${ctx.entity} in ${ctx.state}`,
      state: ctx.state,
      detail: `The workplace is in the ${ctx.city} region and the person has 3 years of service.`,
      ask: "What should the model conclude?",
    }),
    answer: (item) => item.answer,
    steps: () => ["Identify the employment relationship", "Apply the relevant statutory rule", "State the practical next step"],
    citations: () => ["Industrial Disputes Act, 1947", "State Shops and Establishments Act"],
    alternatives: () => ["The answer should be conditional on employee classification and state rules."],
    hallucinations: ["guaranteed win", "automatic reinstatement"],
    mistakes: ["ignoring state law", "overstating certainty"],
    rubric: ["1 point for classification", "1 point for rule application", "1 point for practical guidance"],
    tags: ["labour", "employment", "rights"],
  },
  "Employment Law": {
    kind: "legal",
    items: [
      { topic: "probation confirmation", answer: "Explain that probationary status depends on the contract and any standing orders; confirmation is not automatic." },
      { topic: "notice period dispute", answer: "State that the longer of contract, policy, or statutory minimum may govern, subject to facts." },
      { topic: "background verification", answer: "State that verification should be truthful, proportionate, and privacy-aware." },
    ],
    question: (item, ctx) => mkScenarioQuestion({
      actor: `${ctx.actor} in ${ctx.city}`,
      action: `has a dispute over ${item.topic}`,
      state: ctx.state,
      detail: `The employee is on ${ctx.role} terms at a ${ctx.entity}.`,
      ask: "What is the most defensible legal conclusion?",
    }),
    answer: (item) => item.answer,
    steps: () => ["Read the contract first", "Check policy or standing orders", "Apply the relevant employment rule"],
    citations: () => ["Employment contract", "Standing Orders / applicable state law"],
    alternatives: () => ["The answer should not assume confirmation or termination outcome without facts."],
    hallucinations: ["always entitled", "no notice ever needed"],
    mistakes: ["treating policy as statute", "ignoring the contract"],
    rubric: ["1 point for contract analysis", "1 point for legal caveat", "1 point for action plan"],
    tags: ["employment", "contracts"],
  },
  "HR Compliance": {
    kind: "legal",
    items: [
      { topic: "onboarding records", answer: "Say the employer should retain appointment letters, KYC, wage registers, and statutory filings." },
      { topic: "policy communication", answer: "Say workplace policies should be documented, shared, and acknowledged." },
      { topic: "disciplinary record", answer: "Say disciplinary steps need a written trail and fair process." },
    ],
    question: (item, ctx) => mkScenarioQuestion({
      actor: `An ${ctx.role}`,
      action: `asks how to handle ${item.topic}`,
      state: ctx.state,
      detail: `The company operates in ${ctx.city} and uses contract as well as permanent staff.`,
      ask: "What compliance answer should be given?",
    }),
    answer: (item) => item.answer,
    steps: () => ["Identify the compliance artifact", "State why records matter", "Recommend documentation controls"],
    citations: () => ["HR policy records", "Statutory registers"],
    alternatives: () => ["The answer should emphasise traceability and audit readiness."],
    hallucinations: ["no records needed", "verbal approval is enough"],
    mistakes: ["confusing compliance with HR preference"],
    rubric: ["1 point for naming required records", "1 point for audit rationale", "1 point for control recommendation"],
    tags: ["hr", "compliance"],
  },
  EPF: {
    kind: "legal",
    items: [
      { topic: "contribution split", answer: "State that the standard EPF contribution is 12% employee and 12% employer, with the employer share split between EPF and EPS." },
      { topic: "coverage", answer: "State that EPF coverage depends on establishment coverage and eligible employees, not just employee count alone." },
      { topic: "transfer", answer: "State that member balances should be transferred through the EPFO process when changing jobs." },
    ],
    question: (item, ctx) => mkComplianceQuestion({
      domain: "EPF",
      subject: item.topic,
      state: ctx.state,
      entity: ctx.entity,
      extra: "The prompt asks for the legally correct high-level answer.",
    }),
    answer: (item) => item.answer,
    steps: () => ["Identify the EPF rule", "State the contribution or coverage logic", "Give the compliance next step"],
    citations: () => ["EPF Act, 1952 Section 6", "EPFO"],
    alternatives: () => ["The answer should mention the employer split only when explaining the 12% employer contribution."],
    hallucinations: ["10 percent employer", "flat contribution for all wages"],
    mistakes: ["mixing EPF with ESI", "giving a single universal threshold without caveat"],
    rubric: ["1 point for correct rate", "1 point for split explanation", "1 point for caveat"],
    tags: ["epf", "social-security"],
  },
  ESIC: {
    kind: "legal",
    items: [
      { topic: "coverage threshold", answer: "State that ESIC coverage depends on the establishment and notified area rules, not simply on employee preference." },
      { topic: "contribution split", answer: "State the standard ESI split as 0.75% employee and 3.25% employer, where applicable." },
      { topic: "benefits", answer: "State that ESIC can provide medical and cash benefits to eligible insured persons and dependants." },
    ],
    question: (item, ctx) => mkComplianceQuestion({
      domain: "ESIC",
      subject: item.topic,
      state: ctx.state,
      entity: ctx.entity,
      extra: "The person needs a precise compliance answer.",
    }),
    answer: (item) => item.answer,
    steps: () => ["Identify coverage rules", "State contribution or benefit logic", "Warn about applicability limits"],
    citations: () => ["ESI Act, 1948", "ESIC"],
    alternatives: () => ["The answer should mention applicability depends on the notified area and covered employees."],
    hallucinations: ["same as EPF", "employee pays 12 percent"],
    mistakes: ["treating ESIC as universal", "confusing benefit and contribution rules"],
    rubric: ["1 point for coverage", "1 point for contribution or benefit", "1 point for caution"],
    tags: ["esic", "social-security"],
  },
  "Minimum Wages": {
    kind: "legal",
    items: [
      { topic: "below-floor pay", answer: "State that paying below the notified minimum wage is non-compliant and must be corrected to the applicable basic plus VDA floor." },
      { topic: "zone classification", answer: "State that the correct zone and scheduled employment classification determine the applicable minimum wage." },
      { topic: "revision", answer: "State that minimum wages should be checked against the latest notification because revisions are periodic." },
    ],
    question: (item, ctx) => mkComplianceQuestion({
      domain: "minimum wages",
      subject: item.topic,
      state: ctx.state,
      entity: ctx.entity,
      extra: "The model must decide the compliance rule, not just paraphrase the law.",
    }),
    answer: (item) => item.answer,
    steps: () => ["Identify the scheduled employment", "Apply the notified floor wage", "State compliance status"],
    citations: () => ["Minimum Wages Act, 1948", "State minimum wage notification"],
    alternatives: () => ["The answer should mention basic plus dearness allowance where relevant."],
    hallucinations: ["fixed national minimum", "one rate for all zones"],
    mistakes: ["ignoring zone classification", "giving a stale number as current"],
    rubric: ["1 point for classification", "1 point for compliance conclusion", "1 point for caveat on revisions"],
    tags: ["wages", "minimum-wage"],
  },
  Bonus: {
    kind: "legal",
    items: [
      { topic: "eligibility threshold", answer: "State that bonus eligibility turns on the statutory wage ceiling and the employee's eligibility period." },
      { topic: "minimum bonus", answer: "State that the statutory minimum bonus is 8.33% where the Act applies." },
      { topic: "maximum bonus", answer: "State that the ceiling under the Act is generally 20% before other adjustments." },
    ],
    question: (item, ctx) => mkComplianceQuestion({
      domain: "bonus",
      subject: item.topic,
      state: ctx.state,
      entity: ctx.entity,
      extra: "The answer should be precise and not confuse eligibility with payout rate.",
    }),
    answer: (item) => item.answer,
    steps: () => ["Check applicability", "Apply statutory rate or ceiling", "Mention adjustment conditions"],
    citations: () => ["Payment of Bonus Act, 1965"],
    alternatives: () => ["The answer should distinguish eligibility from calculation rate."],
    hallucinations: ["bonus is discretionary only", "20 percent is always payable"],
    mistakes: ["mixing bonus with ex gratia", "forgetting wage ceiling"],
    rubric: ["1 point for eligibility", "1 point for rate", "1 point for caveat"],
    tags: ["bonus", "compensation"],
  },
  Gratuity: {
    kind: "legal",
    items: [
      { topic: "five-year rule", answer: "State that gratuity is generally payable after 5 years of continuous service, subject to statutory exceptions." },
      { topic: "formula", answer: "State the common formula as 15/26 × last drawn wages × completed years of service." },
      { topic: "exception", answer: "State that death or disablement can waive the 5-year requirement." },
    ],
    question: (item, ctx) => mkComplianceQuestion({
      domain: "gratuity",
      subject: item.topic,
      state: ctx.state,
      entity: ctx.entity,
      extra: "The model should give the correct rule and any exception.",
    }),
    answer: (item) => item.answer,
    steps: () => ["Check completed service", "Apply the gratuity rule or exception", "State calculation or eligibility"],
    citations: () => ["Payment of Gratuity Act, 1972"],
    alternatives: () => ["The answer should mention continuous service and statutory exceptions."],
    hallucinations: ["3 years is enough", "gratuity is salary bonus"],
    mistakes: ["using gross salary without explanation", "ignoring exceptions"],
    rubric: ["1 point for eligibility", "1 point for formula or exception", "1 point for caution"],
    tags: ["gratuity", "benefits"],
  },
  POSH: {
    kind: "legal",
    items: [
      { topic: "ICC composition", answer: "State that workplaces with 10 or more employees need an Internal Complaints Committee with the statutory composition." },
      { topic: "time limit", answer: "State that inquiry recommendations should generally be completed within 90 days." },
      { topic: "confidentiality", answer: "State that POSH proceedings require confidentiality and careful handling of records." },
    ],
    question: (item, ctx) => mkComplianceQuestion({
      domain: "POSH",
      subject: item.topic,
      state: ctx.state,
      entity: ctx.entity,
      extra: "The answer should focus on statutory duties, not moral commentary.",
    }),
    answer: (item) => item.answer,
    steps: () => ["Identify the POSH obligation", "Apply the committee or process rule", "State the employer duty"],
    citations: () => ["POSH Act, 2013 Section 4", "POSH Rules"],
    alternatives: () => ["The answer should mention that contract staff are counted for workplace size in many compliance reviews."],
    hallucinations: ["optional ICC", "complaints are anonymous by default"],
    mistakes: ["omitting the external member", "ignoring confidentiality"],
    rubric: ["1 point for ICC rule", "1 point for time/process", "1 point for confidentiality"],
    tags: ["posh", "harassment"],
  },
  "Contract Labour": {
    kind: "legal",
    items: [
      { topic: "license threshold", answer: "State that contract labour compliance can require registration/licensing once the statutory threshold is met." },
      { topic: "principal employer duty", answer: "State that the principal employer cannot outsource all responsibility for statutory compliance." },
      { topic: "amenities", answer: "State that canteen, welfare, and safety obligations may apply depending on workforce size and rules." },
    ],
    question: (item, ctx) => mkComplianceQuestion({
      domain: "contract labour",
      subject: item.topic,
      state: ctx.state,
      entity: ctx.entity,
      extra: "The model should answer as a compliance analyst, not a guesser.",
    }),
    answer: (item) => item.answer,
    steps: () => ["Check threshold", "Identify principal employer duties", "State the compliance impact"],
    citations: () => ["Contract Labour (Regulation and Abolition) Act, 1970"],
    alternatives: () => ["The answer should not treat the contractor as the only liable party."],
    hallucinations: ["no liability for principal employer", "contract labour is unregulated"],
    mistakes: ["ignoring thresholds", "confusing contractor and principal employer roles"],
    rubric: ["1 point for threshold", "1 point for shared liability", "1 point for welfare duties"],
    tags: ["contract-labour", "compliance"],
  },
  "Industrial Relations": {
    kind: "legal",
    items: [
      { topic: "retrenchment", answer: "State that retrenchment requires notice, compensation, and proper procedure where applicable." },
      { topic: "strike", answer: "State that legality depends on notice, timing, and the governing industrial relations rules." },
      { topic: "standing orders", answer: "State that certified standing orders or policy may govern disciplinary and termination process." },
    ],
    question: (item, ctx) => mkScenarioQuestion({
      actor: `${ctx.role} staff`,
      action: `raise a ${item.topic} issue`,
      state: ctx.state,
      detail: `The workplace is in ${ctx.city} and the dispute affects a team of contract and permanent workers.`,
      ask: "What should the model conclude?",
    }),
    answer: (item) => item.answer,
    steps: () => ["Identify the industrial relations event", "Apply the procedural rule", "State the legal consequence"],
    citations: () => ["Industrial Disputes Act, 1947", "Standing Orders"],
    alternatives: () => ["The answer should be conditional on worker classification and process compliance."],
    hallucinations: ["instant legality", "strike is always illegal"],
    mistakes: ["overstating one rule across all facts"],
    rubric: ["1 point for event identification", "1 point for procedure", "1 point for consequence"],
    tags: ["industrial-relations", "disputes"],
  },
  "GeM Procurement": {
    kind: "legal",
    items: [
      { topic: "L1 ranking", answer: "State that GeM award often depends on compliant eligibility plus the L1 / best-value rule in the bid." },
      { topic: "bid compliance", answer: "State that non-compliant bids can be rejected even if the price is low." },
      { topic: "catalogue listing", answer: "State that product or service listing must match the procurement requirement and eligibility." },
    ],
    question: (item, ctx) => mkComplianceQuestion({
      domain: "GeM procurement",
      subject: item.topic,
      state: ctx.state,
      entity: ctx.entity,
      extra: "The answer should reflect procurement logic, not generic sales advice.",
    }),
    answer: (item) => item.answer,
    steps: () => ["Check bid eligibility", "Apply evaluation rule", "State award consequence"],
    citations: () => ["Government e-Marketplace policy"],
    alternatives: () => ["The answer should distinguish lowest price from compliant award."],
    hallucinations: ["lowest price always wins", "non-compliant bids must be accepted"],
    mistakes: ["ignoring eligibility filters", "confusing product listing with tender award"],
    rubric: ["1 point for eligibility", "1 point for award logic", "1 point for compliance caveat"],
    tags: ["gem", "procurement"],
  },
  "Government Contracts": {
    kind: "legal",
    items: [
      { topic: "solvency", answer: "State that solvency and financial standing are typically checked through the tender eligibility criteria." },
      { topic: "performance security", answer: "State that performance security is usually recoverable if the contractor defaults, subject to contract terms." },
      { topic: "blacklisting", answer: "State that blacklisting or debarment requires due process and specific authority." },
    ],
    question: (item, ctx) => mkScenarioQuestion({
      actor: `${ctx.entity}`,
      action: `enters a government contract dispute about ${item.topic}`,
      state: ctx.state,
      detail: `The bidder operates from ${ctx.city} and has a multi-year contract.`,
      ask: "What is the safest legal conclusion?",
    }),
    answer: (item) => item.answer,
    steps: () => ["Read the tender conditions", "Check the contractual remedy", "State due-process caveat"],
    citations: () => ["Tender document", "Government contract terms"],
    alternatives: () => ["The answer should avoid assuming a remedy without contract language."],
    hallucinations: ["automatic blacklisting", "solvency never matters"],
    mistakes: ["confusing contract remedy with criminal penalty"],
    rubric: ["1 point for tender clause", "1 point for remedy", "1 point for due process"],
    tags: ["government-contracts", "tender"],
  },
  "Tender Evaluation": {
    kind: "legal",
    items: [
      { topic: "responsive bid", answer: "State that a non-responsive bid can be rejected even if it is cheap." },
      { topic: "scoring", answer: "State that technical and financial scoring must follow the published evaluation matrix." },
      { topic: "deviation", answer: "State that material deviations usually disqualify a bid." },
    ],
    question: (item, ctx) => mkScenarioQuestion({
      actor: `${ctx.entity}`,
      action: `evaluates a tender issue on ${item.topic}`,
      state: ctx.state,
      detail: `The procurement is based in ${ctx.city}.`,
      ask: "What should the evaluator do?",
    }),
    answer: (item) => item.answer,
    steps: () => ["Check responsiveness", "Apply the published matrix", "State the rejection or scoring rule"],
    citations: () => ["Tender document", "Evaluation criteria"],
    alternatives: () => ["The answer should not invent an unpublished scoring rule."],
    hallucinations: ["score after opening", "material deviation is irrelevant"],
    mistakes: ["ignoring published criteria", "treating all deviations as immaterial"],
    rubric: ["1 point for responsiveness", "1 point for published criteria", "1 point for material deviation"],
    tags: ["tender-evaluation", "procurement"],
  },
  "Criminal Law": {
    kind: "legal",
    items: [
      { topic: "bail vs custody", answer: "State that bail depends on offense classification, evidence, and procedural law; do not promise release." },
      { topic: "mens rea", answer: "State that intent matters for many offenses and must be inferred from facts." },
      { topic: "evidence", answer: "State that admissibility and reliability depend on the Evidence Act and criminal procedure rules." },
    ],
    question: (item, ctx) => mkScenarioQuestion({
      actor: `${ctx.actor}`,
      action: `faces a criminal law issue about ${item.topic}`,
      state: ctx.state,
      detail: `The alleged event happened in ${ctx.city}.`,
      ask: "What is the most defensible analysis?",
    }),
    answer: (item) => item.answer,
    steps: () => ["Classify the criminal issue", "Explain the legal standard", "Avoid promising a case outcome"],
    citations: () => ["Bharatiya Nyaya Sanhita / IPC principles", "BNSS / CrPC principles"],
    alternatives: () => ["The answer should explicitly avoid a guaranteed outcome."],
    hallucinations: ["guaranteed acquittal", "no need for evidence"],
    mistakes: ["inventing a section number", "predicting conviction certainty"],
    rubric: ["1 point for classification", "1 point for standard", "1 point for honesty"],
    tags: ["criminal-law"],
  },
  "Civil Law": {
    kind: "legal",
    items: [
      { topic: "breach of contract", answer: "State that the available remedy depends on the contract, loss, and available performance or damages remedy." },
      { topic: "injunction", answer: "State that injunctions are discretionary and require a legal basis and urgency." },
      { topic: "limitation", answer: "State that limitation periods can bar stale claims even if the underlying grievance is real." },
    ],
    question: (item, ctx) => mkScenarioQuestion({
      actor: `${ctx.actor}`,
      action: `has a civil dispute about ${item.topic}`,
      state: ctx.state,
      detail: `The contract was executed in ${ctx.city}.`,
      ask: "What legal framing is most accurate?",
    }),
    answer: (item) => item.answer,
    steps: () => ["Identify the civil cause of action", "State the remedy framework", "Mention any limitation or discretion issue"],
    citations: () => ["Contract Act", "Specific Relief Act", "Limitation Act"],
    alternatives: () => ["The answer should be remedy-focused rather than emotional."],
    hallucinations: ["specific performance is automatic", "limitation never applies"],
    mistakes: ["mixing civil and criminal remedies"],
    rubric: ["1 point for cause of action", "1 point for remedy", "1 point for limitation caveat"],
    tags: ["civil-law"],
  },
  "Constitutional Law": {
    kind: "legal",
    items: [
      { topic: "Article 14", answer: "State that equality under Article 14 tests arbitrariness and reasonable classification." },
      { topic: "Article 19", answer: "State that Article 19 rights are subject to reasonable restrictions." },
      { topic: "Article 21", answer: "State that Article 21 protects life and personal liberty, subject to due process." },
    ],
    question: (item, ctx) => mkScenarioQuestion({
      actor: `A citizen in ${ctx.city}`,
      action: `raises a constitutional issue under ${item.topic}`,
      state: ctx.state,
      detail: `The action involves a public authority and a written policy.`,
      ask: "What is the correct constitutional frame?",
    }),
    answer: (item) => item.answer,
    steps: () => ["Identify the right engaged", "State the constitutional test", "Mention the restriction or remedy"],
    citations: () => ["Constitution of India Article 14", "Constitution of India Article 19", "Constitution of India Article 21"],
    alternatives: () => ["The answer should not reduce the issue to slogans."],
    hallucinations: ["absolute right", "no restrictions allowed"],
    mistakes: ["inventing articles", "ignoring reasonable restrictions"],
    rubric: ["1 point for article recognition", "1 point for test", "1 point for caveat"],
    tags: ["constitutional-law"],
  },
  "Logical Reasoning": {
    kind: "reasoning",
    items: [
      { prompt: "Three workers A, B, and C sit in a row. A is not on an end. B sits to the left of C. Who is in the middle?", answer: "A is in the middle." },
      { prompt: "If all invoices are documents and some documents are stamped, can we conclude that some invoices are stamped?", answer: "No. The conclusion does not logically follow." },
      { prompt: "A sequence doubles each step starting from 3. What is the fourth term?", answer: "24" },
    ],
    question: (item, index) => `${item.prompt} Give the exact answer and the reasoning in one or two steps.`,
    answer: (item) => item.answer,
    steps: () => ["Identify the logical relation", "Apply the rule", "State the exact answer"],
    citations: () => ["N/A"],
    alternatives: () => ["A concise symbolic explanation is acceptable."],
    hallucinations: ["yes because it feels right"],
    mistakes: ["assuming unstated premises", "overexplaining the obvious"],
    rubric: ["1 point for correct conclusion", "1 point for reasoning", "1 point for concision"],
    tags: ["logic"],
  },
  Mathematics: {
    kind: "calculation",
    items: [
      { a: 240, b: 15, unit: "%", ask: "What is the discounted price after 15% off?" },
      { a: 18, b: 7, unit: "hours", ask: "If a task takes 18 hours and is reduced by 7 hours, what is the remainder?" },
      { a: 45, b: 8, unit: "%", ask: "What is 8% of 45?" },
    ],
    question: (item) => mkCalcQuestion({
      subject: "Math",
      valueA: item.a,
      valueB: item.b,
      unit: item.unit,
      ask: item.ask,
    }),
    answer: (item) => {
      if (item.unit === "%") {
        if (item.ask.includes("discounted")) return { answer: String(item.a * (1 - item.b / 100)), alternatives: [String(Math.round(item.a * (1 - item.b / 100)))] };
        return { answer: String(item.a * item.b / 100), alternatives: [String(item.a * item.b / 100)] };
      }
      return { answer: String(item.a - item.b), alternatives: [String(item.a - item.b)] };
    },
    steps: () => ["Parse the numeric relationship", "Compute the arithmetic result", "State the number clearly"],
    citations: () => ["N/A"],
    alternatives: () => ["A numeric answer with units is acceptable."],
    hallucinations: ["incorrect arithmetic"],
    mistakes: ["missing units", "rounding when not needed"],
    rubric: ["2 points for correct number", "1 point for clear units"],
    tags: ["math"],
  },
  Coding: {
    kind: "coding",
    items: [
      { lang: "JavaScript", prompt: "A function returns undefined because it forgets to return inside map. What fix should be applied?", answer: "Add an explicit return or use an expression-bodied arrow function.", bug: "missing return" },
      { lang: "Python", prompt: "A loop appends to the same list it iterates over. What is the problem?", answer: "The loop can grow unbounded or skip items; iterate over a copy or build a new list.", bug: "mutating iteration source" },
      { lang: "TypeScript", prompt: "A union type is widened to any by an unsafe cast. What should be changed?", answer: "Remove the unsafe cast and narrow the type with guards or generics.", bug: "unsafe cast" },
    ],
    question: (item) => `Debug this ${item.lang} issue: ${item.prompt} Give the fix and why it works.`,
    answer: (item) => item.answer,
    steps: () => ["Identify the bug", "Describe the fix", "Explain why the fix is safe"],
    citations: () => ["Code snippet provided in prompt"],
    alternatives: () => ["A correct patch description is acceptable."],
    hallucinations: ["rewrite everything", "this cannot be fixed"],
    mistakes: ["missing the root cause", "changing unrelated code"],
    rubric: ["1 point for bug identification", "1 point for fix", "1 point for explanation"],
    tags: ["coding", "debugging"],
  },
  "Scientific Reasoning": {
    kind: "reasoning",
    items: [
      { prompt: "A plant grows faster under blue light than red light, but the blue lamp is also closer. What is the confounder?", answer: "Lamp distance is a confounder." },
      { prompt: "A vaccine study compares volunteers only after they self-select. What bias is likely?", answer: "Selection bias." },
      { prompt: "A treatment reduces symptoms but the placebo group was never blinded. What is the methodological problem?", answer: "Lack of blinding and expectancy bias." },
    ],
    question: (item) => `${item.prompt} Answer with the most likely scientific issue and one-sentence justification.`,
    answer: (item) => item.answer,
    steps: () => ["Identify the experimental design flaw", "Name the bias or confounder", "State why it matters"],
    citations: () => ["N/A"],
    alternatives: () => ["A different valid methodological term is acceptable if justified."],
    hallucinations: ["proof of causation"],
    mistakes: ["confusing correlation with causation"],
    rubric: ["1 point for issue", "1 point for justification", "1 point for scientific terminology"],
    tags: ["science", "bias"],
  },
  "Long Context": {
    kind: "long-context",
    items: [
      { question: "Read the policy memo and identify the contradiction.", answer: "The memo says the refund window is 30 days in one section and 14 days in the revision note.", targetTokens: 50000, contradictionType: "policy-window" , steps: ["Scan the full memo", "Locate the conflicting sections", "State the contradiction clearly"], citations: ["Document A"], alternatives: ["The response may quote both conflicting lines."], hallucinations: ["treating both versions as identical"], mistakes: ["missing the contradiction"], rubric: ["1 point for locating the conflict", "1 point for explaining it", "1 point for quoting the conflict"], reference: "Synthetic policy memo with deliberate contradiction" },
      { question: "Read the change log and identify which version is latest.", answer: "Version 4 is latest because it is explicitly dated after version 3 and marked superseding.", targetTokens: 100000, contradictionType: "version-order", steps: ["Check dates", "Read supersession note", "State latest version"], citations: ["Document B"], alternatives: ["The answer may say version 4 supersedes version 3."], hallucinations: ["choosing the first mention as latest"], mistakes: ["ignoring the supersession note"], rubric: ["1 point for date order", "1 point for supersession", "1 point for final answer"], reference: "Synthetic change log with contradictory version labels" },
      { question: "Find the clause that conflicts with the summary.", answer: "The body clause permits remote work twice weekly, while the summary says remote work is prohibited.", targetTokens: 250000, contradictionType: "summary-vs-body", steps: ["Compare summary and body", "Identify the mismatch", "State which clause controls"], citations: ["Document C"], alternatives: ["The answer may state the body clause and summary conflict."], hallucinations: ["assuming summaries always control"], mistakes: ["forgetting to compare sections"], rubric: ["1 point for mismatch", "1 point for control principle", "1 point for exact citation"], reference: "Synthetic handbook with summary mismatch" },
      { question: "Identify the contradictory safety instruction.", answer: "One section says wear goggles at all times; the appendix says goggles are optional for the same task.", targetTokens: 500000, contradictionType: "safety-protocol", steps: ["Scan procedure steps", "Locate appendix conflict", "State the contradiction"], citations: ["Document D"], alternatives: ["The answer may mention the exact sections."], hallucinations: ["ignoring appendix"], mistakes: ["missing the safety conflict"], rubric: ["1 point for locating conflict", "1 point for explaining risk", "1 point for concise answer"], reference: "Synthetic safety manual with inconsistent appendix" },
      { question: "Determine the latest applicable instruction in the document.", answer: "The update note dated later than the core policy is the latest instruction, and it reverses the earlier clause.", targetTokens: 1000000, contradictionType: "latest-instruction", steps: ["Find all dated instructions", "Compare dates", "Select the latest and note reversal"], citations: ["Document E"], alternatives: ["The answer may cite the last dated update."], hallucinations: ["assuming the longest section is latest"], mistakes: ["not checking dates"], rubric: ["1 point for date comparison", "1 point for identifying reversal", "1 point for exact latest instruction"], reference: "Synthetic mega-document with deliberate reversal" },
    ],
  },
  "Reading Comprehension": {
    kind: "reading",
    items: [
      { passage: mkReadingPassage("A company memo says:", ["The office will close on Fridays at 6 PM.", "Remote work is allowed only with manager approval.", "The cafeteria menu changes every Monday."]), question: "When does the office close on Fridays?", answer: "6 PM" },
      { passage: mkReadingPassage("A project brief states:", ["The pilot runs for eight weeks.", "Only three teams are included.", "Success is measured by defect reduction."]), question: "How long does the pilot run?", answer: "Eight weeks" },
      { passage: mkReadingPassage("The memo explains:", ["The contract renewal is optional.", "The supplier must keep the same pricing for 12 months.", "Any change needs written approval."]), question: "What is required for any price change?", answer: "Written approval" },
    ],
    question: (item) => `${item.passage}\n\nQuestion: ${item.question}`,
    answer: (item) => item.answer,
    steps: () => ["Read only the provided passage", "Locate the direct evidence", "Answer without outside assumptions"],
    citations: () => ["Provided passage"],
    alternatives: () => ["A direct paraphrase is acceptable."],
    hallucinations: ["inventing facts not in the passage"],
    mistakes: ["using background knowledge instead of the text"],
    rubric: ["1 point for direct extraction", "1 point for brevity", "1 point for fidelity to the passage"],
    tags: ["reading"],
  },
  Research: {
    kind: "research",
    items: [
      {
        sources: [
          { name: "Official Ministry Notice", url: "https://labour.gov.in" },
          { name: "Blog Post", url: "https://example.com/blog" },
          { name: "News Article", url: "https://example.com/news" },
        ],
        question: "Rank the sources by authority for a labour-law compliance claim.",
        answer: "Official Ministry Notice > News Article > Blog Post",
      },
      {
        sources: [
          { name: "EPFO Circular", url: "https://epfindia.gov.in" },
          { name: "Forum Thread", url: "https://example.com/forum" },
          { name: "Vendor Brochure", url: "https://example.com/brochure" },
        ],
        question: "Rank the sources by trustworthiness for an EPF compliance answer.",
        answer: "EPFO Circular > Vendor Brochure > Forum Thread",
      },
      {
        sources: [
          { name: "State Gazette", url: "https://example.gov.in/gazette" },
          { name: "Trade Blog", url: "https://example.com/trade-blog" },
          { name: "Social Post", url: "https://example.com/post" },
        ],
        question: "Which source should be cited first for a current notification?",
        answer: "State Gazette",
      },
    ],
    question: (item) => `${item.question}\n\nSources:\n${item.sources.map((source) => `- ${source.name}: ${source.url}`).join("\n")}`,
    answer: (item) => item.answer,
    steps: () => ["Rank by authority", "Prefer official or primary sources", "Explain the ranking"],
    citations: (item) => item.sources.map((source) => source.url),
    alternatives: () => ["A valid ranking that puts official sources first is acceptable."],
    hallucinations: ["blog first", "social post first"],
    mistakes: ["ignoring official source hierarchy"],
    rubric: ["1 point for source ranking", "1 point for official-source preference", "1 point for rationale"],
    tags: ["research", "source-ranking"],
    requiresWebSearch: true,
    requiresToolUse: true,
  },
  Planning: {
    kind: "planning",
    items: [
      { goal: "launch a compliance audit", stepsPlan: ["collect records", "map obligations", "assign owners", "fix gaps", "verify closure"], answer: "A 5-step plan that starts with records and ends with verification." },
      { goal: "roll out POSH training", stepsPlan: ["count workforce", "constitute ICC", "draft policy", "train staff", "publish contacts"], answer: "A 5-step plan that covers composition, policy, training, and publication." },
      { goal: "prepare a tender response", stepsPlan: ["read eligibility", "assemble documents", "confirm pricing", "review deviations", "submit before deadline"], answer: "A 5-step plan from eligibility review to submission." },
    ],
    question: (item) => `Create a realistic, ordered plan to ${item.goal} under time pressure. Give the steps in sequence.`,
    answer: (item) => item.answer,
    steps: (item) => item.stepsPlan,
    citations: () => ["N/A"],
    alternatives: () => ["A structured ordered list with the same dependencies is acceptable."],
    hallucinations: ["skip the verification step", "no sequencing"],
    mistakes: ["generic vague plan", "missing the earliest dependency"],
    rubric: ["1 point for ordering", "1 point for feasibility", "1 point for completeness"],
    tags: ["planning"],
  },
  "Decision Making": {
    kind: "decision",
    items: [
      { options: ["Option A: cheapest vendor, no compliance docs", "Option B: higher price, complete documents", "Option C: unclear scope"], answer: "Option B", rationale: "Compliance and clarity outweigh a marginal price advantage." },
      { options: ["Option A: immediate release with no review", "Option B: short review with written approval", "Option C: indefinite delay"], answer: "Option B", rationale: "It balances speed and control." },
      { options: ["Option A: one-person committee", "Option B: compliant committee with external member", "Option C: no committee"], answer: "Option B", rationale: "Only the compliant structure satisfies the rule." },
    ],
    question: (item) => `Choose the best option and explain why:\n${item.options.map((opt) => `- ${opt}`).join("\n")}`,
    answer: (item) => `${item.answer}: ${item.rationale}`,
    steps: () => ["Compare options against criteria", "Reject unsafe or non-compliant choices", "Pick the best trade-off"],
    citations: () => ["N/A"],
    alternatives: (item) => [item.answer],
    hallucinations: ["the cheapest option is always best"],
    mistakes: ["ignoring constraints", "choosing an unsafe option"],
    rubric: ["1 point for correct choice", "1 point for rationale", "1 point for constraint awareness"],
    tags: ["decision-making"],
  },
};

function buildCases() {
  const publicCases = [];
  const hiddenKeys = [];

  for (const category of CATEGORIES) {
    const spec = CATEGORY_SPECS[category];
    if (!spec) {
      throw new Error(`Missing spec for category: ${category}`);
    }

    for (let index = 0; index < COUNT_PER_CATEGORY; index += 1) {
      let built;
      if (spec.kind === "legal") {
        built = genericLegalCases(category, spec, index);
      } else if (spec.kind === "calculation") {
        built = calcCases(category, spec, index);
      } else if (spec.kind === "reasoning") {
        built = reasoningCases(category, spec, index);
      } else if (spec.kind === "coding") {
        built = codingCases(category, spec, index);
      } else if (spec.kind === "long-context") {
        built = longContextCases(category, spec, index);
      } else if (spec.kind === "reading") {
        built = readingCases(category, spec, index);
      } else if (spec.kind === "research") {
        built = researchCases(category, spec, index);
      } else if (spec.kind === "planning") {
        built = planningCases(category, spec, index);
      } else if (spec.kind === "decision") {
        built = decisionCases(category, spec, index);
      } else {
        throw new Error(`Unsupported kind: ${spec.kind}`);
      }
      publicCases.push(built.publicCase);
      hiddenKeys.push(built.hiddenKey);
    }
  }

  return { publicCases, hiddenKeys };
}

async function main() {
  await ensureOutputDir();
  const { publicCases, hiddenKeys } = buildCases();
  const manifest = {
    generatedAt: nowIso(),
    totalCases: publicCases.length,
    categories: CATEGORIES.map((category) => ({ category, count: COUNT_PER_CATEGORY })),
    publicFile: "output/cases.public.jsonl",
    hiddenFile: "output/keys.hidden.jsonl",
  };

  await writeJsonl(path.join(OUTPUT_DIR, "cases.public.jsonl"), publicCases);
  await writeJsonl(path.join(OUTPUT_DIR, "keys.hidden.jsonl"), hiddenKeys);
  await fs.writeFile(path.join(OUTPUT_DIR, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  await fs.writeFile(path.join(OUTPUT_DIR, "categories.txt"), `${CATEGORIES.join("\n")}\n`, "utf8");

  console.log(JSON.stringify(manifest, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
