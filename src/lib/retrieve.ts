// Pure retrieval (no JSON import) so both the browser (rag.ts) and the API function can use it.
export interface DatasetEntry {
  id: string;
  act: string;
  section: string;
  title: string;
  summary: string;
  applicability: { states: string[]; employee_types: string[]; company_size: string };
  tags: string[];
  last_updated: string;
  source: string;
  implementation_status?: string;
}

export interface RetrievedChunk {
  entry: DatasetEntry;
  relevance: number;
}

const STOP = new Set(
  "a an and are as at be but by can do does for from had has have how i if in is it its me my not of on or our so than that the their them then there they this to was we what when where which who why will with you your am been being into just may might must shall should would could about after also any because before between both did during each few more most other out over same some such too under until up very".split(" ")
);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

const KEYWORDS = ["termination", "retrenchment", "wage", "pf", "esi", "gratuity", "bonus", "maternity", "posh", "leave", "overtime", "notice", "contract labour", "minimum wage", "dismissal", "harassment", "provident fund"];

export function computeRelevance(query: string, entry: DatasetEntry): number {
  const text = [entry.act, entry.section, entry.title, entry.summary, entry.tags.join(" "), entry.applicability.states.join(" "), entry.applicability.employee_types.join(" ")].join(" ");
  const words = new Set(tokenize(text)); // whole-word match, not substring
  const tagWords = new Set(entry.tags.flatMap((t) => tokenize(t)));
  const q = query.toLowerCase();
  const lower = text.toLowerCase();

  let score = 0;
  for (const token of new Set(tokenize(query))) {
    if (words.has(token)) score += 1;
    if (tagWords.has(token)) score += 0.8;
  }
  for (const kw of KEYWORDS) {
    if (q.includes(kw) && lower.includes(kw)) score += 1.2;
  }
  return score;
}

export function retrieve(dataset: DatasetEntry[], query: string, topK = 5): RetrievedChunk[] {
  if (!query || query.trim().length < 3) return [];
  return dataset
    .map((entry) => ({ entry, relevance: computeRelevance(query, entry) }))
    .filter((s) => s.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, topK);
}
