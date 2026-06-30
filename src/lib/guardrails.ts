/**
 * Guardrails Layer for Labour Law Assist
 * Runs before and after generating responses. Independent of model choice.
 */

export interface GuardrailResult {
  allowed: boolean;
  reason?: string;
  escalation: boolean;
  suggestedNote?: string;
  isOffTopic?: boolean;
  isDrafting?: boolean;
}

// ─── Scope Whitelist (positive signals required) ──────────────────────────────
// A query must contain at least one of these to be considered in-scope.
const LABOUR_LAW_SIGNALS = [
  // Employment basics
  "job", "employ", "work", "worker", "staff", "employee", "employer",
  "hr ", "human resource", "workforce", "labour", "labor", "industrial",
  // Pay & benefits
  "salary", "wage", "pay ", "payment", "payslip", "bonus", "increment",
  "arrear", "deduction", "pf", "epf", "provident fund", "esi", "esic",
  "gratuity", "compensation", "reimbursement",
  // Exit events
  "termination", "terminate", "fired", "sacked", "dismissal", "dismissed",
  "retrench", "layoff", "lay-off", "notice period", "resign", "resignation",
  "voluntary retirement", "vrs",
  // Leave & hours
  "leave", "maternity", "paternity", "earned leave", "casual leave",
  "sick leave", "overtime", "working hours", "shift", "holiday", "rest day",
  // Statutory benefits & schemes
  "minimum wage", "contract labour", "apprentice", "trainee",
  "shops and establishments", "factories act", "industrial disputes",
  "standing order", "trade union",
  // Harassment & safety
  "posh", "harassment", "hostile workplace", "workplace safety", "occupational",
  // Regulatory bodies
  "labour commissioner", "labour court", "labour officer",
  "epfo", "esic office", "conciliation",
  // Common question patterns
  "employment contract", "offer letter", "appointment letter",
  "probation", "confirmation", "transfer", "promotion", "demotion",
];

// Hard-blocked topics (take priority even if labour signals exist)
const BLOCKED_TOPICS = [
  // Non-employment legal
  "divorce", "property dispute", "real estate", "land acquisition",
  "criminal case", "fir ", "police ", "murder", "theft", "robbery",
  "court case outcome", "win my case", "court verdict",
  // Tax / finance
  "income tax", "gst return", "tax filing", "itr ", "tds return",
  "mutual fund", "stock market", "share price", "crypto",
  // Business registration
  "company registration", "trademark", "patent", "copyright",
  "llp registration", "gst registration",
  // Medical / personal
  "medical diagnosis", "prescription", "symptoms", "treatment",
  "relationship advice", "marriage",
  // Immigration
  "visa", "passport", "citizenship",
];

const DRAFTING_PATTERNS = [
  /draft.*(notice|letter|complaint|reply|application|affidavit)/i,
  /write.*(notice|legal|complaint|show cause)/i,
  /prepare.*(termination|resignation|warning) letter/i,
  /legal notice template/i,
  /format for (complaint|petition)/i,
  /sample letter for/i,
];

const ESCALATION_TRIGGERS = [
  "termination", "fired", "retrenched", "dismissed", "sacked",
  "posh", "sexual harassment", "harassed at work",
  "labour court", "conciliation", "litigation",
];

/**
 * Pre-response guardrail check on the user's query.
 * Uses a whitelist (must have labour law signals) + hard blocklist.
 */
export function checkQueryGuardrails(query: string): GuardrailResult {
  const q = query.toLowerCase().trim();

  // 1. Drafting block (highest priority)
  for (const pattern of DRAFTING_PATTERNS) {
    if (pattern.test(q)) {
      return {
        allowed: false,
        reason: "Document drafting is out of scope.",
        escalation: false,
        isDrafting: true,
        suggestedNote:
          "I cannot draft legal notices, complaints, or formal documents. For drafting assistance, please consult a qualified labour lawyer or consultant.",
      };
    }
  }

  // 2. Hard-blocked topics
  for (const kw of BLOCKED_TOPICS) {
    if (q.includes(kw)) {
      return {
        allowed: false,
        reason: "Off-topic query.",
        escalation: false,
        isOffTopic: true,
        suggestedNote:
          "I only assist with Indian labour and employment law — wages, termination, PF/ESI, leave, POSH, working conditions, and similar topics. Your question appears to be outside that scope.",
      };
    }
  }

  // 3. Whitelist check — must have at least one labour law signal
  const hasSignal = LABOUR_LAW_SIGNALS.some((sig) => q.includes(sig));
  if (!hasSignal) {
    return {
      allowed: false,
      reason: "No labour law relevance detected.",
      escalation: false,
      isOffTopic: true,
      suggestedNote:
        "I can only help with Indian labour and employment law questions — for example: salary disputes, PF/ESI, termination rights, leave entitlements, POSH, gratuity, or minimum wages. Please rephrase your question around your employment situation.",
    };
  }

  // 4. Escalation flags
  const needsEscalation = ESCALATION_TRIGGERS.some((kw) => q.includes(kw));

  return {
    allowed: true,
    escalation: needsEscalation,
    suggestedNote: needsEscalation
      ? "This situation may involve termination, harassment, or a potential dispute. The information below is general. Consult a qualified labour lawyer for advice specific to your facts."
      : undefined,
  };
}

/**
 * Post-response guardrail — softens overconfident language and appends required footers.
 */
export function applyResponseGuardrails(
  draftResponse: string,
  hasCitations: boolean,
  escalationFlagFromQuery: boolean
): { response: string; escalation: boolean; warnings: string[] } {
  let text = draftResponse.trim();
  const warnings: string[] = [];
  let escalation = escalationFlagFromQuery;

  const overconfidentPatterns = [
    [/\byou will win\b/gi, "you may have grounds to argue"],
    [/\byou are guaranteed\b/gi, "you may be entitled"],
    [/\byou definitely have a strong case\b/gi, "you may have a case worth pursuing"],
    [/\b100% chance\b/gi, "it depends on the facts"],
    [/\bthe court will order\b/gi, "a court may consider ordering"],
    [/\byou will get\b/gi, "you may be entitled to claim"],
    [/\bthey must pay you\b/gi, "they may be required to pay"],
  ] as const;

  for (const [pat, replacement] of overconfidentPatterns) {
    if ((pat as RegExp).test(text)) {
      text = text.replace(pat as RegExp, replacement as string);
      warnings.push("Softened overconfident language");
    }
  }

  if (!hasCitations && text.length > 120) {
    text +=
      "\n\nNote: The above is based on general principles. Please verify with the latest official notifications and consult a lawyer.";
    warnings.push("Added citation reminder");
  }

  if (escalation && !text.toLowerCase().includes("consult a qualified")) {
    text +=
      "\n\n⚠️ Your situation may involve termination, POSH, or potential litigation. This tool provides general information only. Strongly consider consulting a qualified labour lawyer or approaching the appropriate authority (Labour Commissioner, Internal Complaints Committee, etc.).";
    warnings.push("Added escalation note");
  }

  if (!text.toLowerCase().includes("not legal advice")) {
    text +=
      "\n\nThis is not legal advice. Labour laws are subject to change and state-specific rules. Verify with official sources.";
  }

  return { response: text, escalation, warnings };
}

// ─── Token / Rate-Limit Budget ────────────────────────────────────────────────

const RATE_LIMIT_KEY = "lla_rate";
const MAX_REQUESTS_PER_HOUR = 15;
const MAX_REQUESTS_PER_DAY = 40;
const MAX_QUERY_CHARS = 1000;
const MIN_QUERY_CHARS = 5;

interface RateRecord {
  hourTs: number;
  hourCount: number;
  dayTs: number;
  dayCount: number;
}

function getToday(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function checkRateLimit(): { allowed: boolean; reason?: string } {
  try {
    const now = Date.now();
    const hourAgo = now - 3_600_000;
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const rec: RateRecord = raw
      ? JSON.parse(raw)
      : { hourTs: now, hourCount: 0, dayTs: getToday(), dayCount: 0 };

    if (rec.hourTs < hourAgo) { rec.hourTs = now; rec.hourCount = 0; }
    const today = getToday();
    if (rec.dayTs < today) { rec.dayTs = today; rec.dayCount = 0; }

    if (rec.hourCount >= MAX_REQUESTS_PER_HOUR) {
      return { allowed: false, reason: `You've reached the limit of ${MAX_REQUESTS_PER_HOUR} questions per hour. Please try again later.` };
    }
    if (rec.dayCount >= MAX_REQUESTS_PER_DAY) {
      return { allowed: false, reason: `Daily limit of ${MAX_REQUESTS_PER_DAY} questions reached. Please try again tomorrow.` };
    }

    rec.hourCount += 1;
    rec.dayCount += 1;
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(rec));
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

export function checkQueryLength(query: string): { allowed: boolean; reason?: string } {
  if (query.trim().length < MIN_QUERY_CHARS) {
    return { allowed: false, reason: "Please describe your situation in more detail (at least a few words)." };
  }
  if (query.length > MAX_QUERY_CHARS) {
    return { allowed: false, reason: `Please keep your question under ${MAX_QUERY_CHARS} characters.` };
  }
  return { allowed: true };
}

/** Returns true only if the query has positive labour law signals. */
export function isLabourLawQuery(query: string): boolean {
  const q = query.toLowerCase();
  return LABOUR_LAW_SIGNALS.some((sig) => q.includes(sig));
}
