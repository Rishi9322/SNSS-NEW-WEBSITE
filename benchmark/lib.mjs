import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

export const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const OUTPUT_DIR = path.join(__dirname, "output");

export const CATEGORIES = [
  "Labour Law",
  "Employment Law",
  "HR Compliance",
  "EPF",
  "ESIC",
  "Minimum Wages",
  "Bonus",
  "Gratuity",
  "POSH",
  "Contract Labour",
  "Industrial Relations",
  "GeM Procurement",
  "Government Contracts",
  "Tender Evaluation",
  "Criminal Law",
  "Civil Law",
  "Constitutional Law",
  "Logical Reasoning",
  "Mathematics",
  "Coding",
  "Scientific Reasoning",
  "Long Context",
  "Reading Comprehension",
  "Research",
  "Planning",
  "Decision Making",
];

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_>#\[\](){}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick(list, rnd) {
  return list[Math.floor(rnd() * list.length)];
}

export function writeJsonl(filePath, rows) {
  return fs.writeFile(filePath, rows.map((row) => JSON.stringify(row)).join("\n") + "\n", "utf8");
}

export function ensureArray(value) {
  if (Array.isArray(value)) return value;
  if (value == null || value === "") return [];
  return [value];
}

export function toNumber(value) {
  const match = String(value).replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : Number.NaN;
}

export function containsAny(text, needles) {
  const lowered = normalize(text);
  return needles.some((needle) => lowered.includes(normalize(needle)));
}

export function wordCount(text) {
  return normalize(text).split(" ").filter(Boolean).length;
}

export function asMarkdownList(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

export function buildPublicCase(caseData) {
  const {
    expectedAnswer,
    acceptableAlternativeAnswers,
    requiredCitations,
    commonHallucinations,
    commonMistakes,
    partialCreditRubric,
    ...publicData
  } = caseData;
  return {
    ...publicData,
    requiresWebSearch: !!caseData.requiresWebSearch,
    requiresToolUse: !!caseData.requiresToolUse,
    expectedContextTokens: caseData.expectedContextTokens || null,
    contextSpec: caseData.contextSpec || null,
  };
}

export function buildHiddenKey(caseData) {
  return {
    id: caseData.id,
    category: caseData.category,
    expectedAnswer: caseData.expectedAnswer,
    acceptableAlternativeAnswers: caseData.acceptableAlternativeAnswers || [],
    requiredCitations: caseData.requiredCitations || [],
    commonHallucinations: caseData.commonHallucinations || [],
    commonMistakes: caseData.commonMistakes || [],
    partialCreditRubric: caseData.partialCreditRubric || [],
    maxScore: caseData.maxScore,
  };
}

export function createCase({
  category,
  index,
  difficulty,
  question,
  expectedReasoningSteps,
  expectedAnswer,
  acceptableAlternativeAnswers = [],
  requiredCitations = [],
  commonHallucinations = [],
  commonMistakes = [],
  partialCreditRubric = [],
  maxScore = 10,
  tags = [],
  requiresWebSearch = false,
  requiresToolUse = false,
  contextSpec = null,
  expectedContextTokens = null,
  reference = null,
}) {
  const id = `${slugify(category)}-${String(index + 1).padStart(3, "0")}`;
  const caseData = {
    id,
    category,
    difficulty,
    question,
    expectedReasoningSteps,
    expectedAnswer,
    acceptableAlternativeAnswers,
    requiredCitations,
    commonHallucinations,
    commonMistakes,
    partialCreditRubric,
    maxScore,
    tags,
    requiresWebSearch,
    requiresToolUse,
    contextSpec,
    expectedContextTokens,
    reference,
  };
  return {
    publicCase: buildPublicCase(caseData),
    hiddenKey: buildHiddenKey(caseData),
    raw: caseData,
  };
}

export function numericCaseScore(prediction, key) {
  const predicted = toNumber(prediction);
  if (Number.isNaN(predicted)) return 0;
  const target = toNumber(key.expectedAnswer);
  if (Number.isNaN(target)) return 0;
  const diff = Math.abs(predicted - target);
  if (diff === 0) return 1;
  if (diff <= Math.max(1, Math.abs(target) * 0.01)) return 0.9;
  if (diff <= Math.max(5, Math.abs(target) * 0.05)) return 0.6;
  if (diff <= Math.max(10, Math.abs(target) * 0.1)) return 0.3;
  return 0;
}

export function citationHitScore(text, citations) {
  if (!citations.length) return 1;
  const lowered = normalize(text);
  const hits = citations.filter((citation) => lowered.includes(normalize(citation))).length;
  return hits / citations.length;
}

export function heuristicHallucinationFlags(text, hiddenKey) {
  const lowered = normalize(text);
  const flags = [];
  const banned = hiddenKey.commonHallucinations || [];
  for (const item of banned) {
    if (lowered.includes(normalize(item))) flags.push(item);
  }
  return flags;
}

export function extractModelText(response) {
  if (!response) return "";
  if (typeof response === "string") return response;
  if (response.content) return response.content;
  if (response.choices?.[0]?.message?.content) return response.choices[0].message.content;
  if (response.output_text) return response.output_text;
  return JSON.stringify(response);
}

export function detectStructuredAnswer(text) {
  const bullets = (text.match(/^\s*[-*•]\s+/gm) || []).length;
  const numbered = (text.match(/^\s*\d+\.\s+/gm) || []).length;
  return bullets + numbered;
}

export function estimateTokens(text) {
  return Math.ceil(String(text || "").length / 4);
}

export function nowIso() {
  return new Date().toISOString();
}

export async function readJsonl(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return raw
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

export async function ensureOutputDir() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function percentile(values, p) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[index];
}
