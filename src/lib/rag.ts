import datasetRaw from "../data/labour-law-dataset.json";

export interface DatasetEntry {
  id: string;
  act: string;
  section: string;
  title: string;
  summary: string;
  applicability: {
    states: string[];
    employee_types: string[];
    company_size: string;
  };
  tags: string[];
  last_updated: string;
  source: string;
  implementation_status?: string;
}

export interface RetrievedChunk {
  entry: DatasetEntry;
  relevance: number;
}

const DATASET: DatasetEntry[] = (datasetRaw as any).entries || [];

function tokenize(text: string): string[] {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function computeRelevance(query: string, entry: DatasetEntry): number {
  const qTokens = tokenize(query);
  const text = [
    entry.act,
    entry.section,
    entry.title,
    entry.summary,
    entry.tags.join(" "),
    entry.applicability.states.join(" "),
    entry.applicability.employee_types.join(" ")
  ].join(" ").toLowerCase();

  let score = 0;
  for (const token of qTokens) {
    if (text.includes(token)) score += 1;
    // bonus for exact tag match
    if (entry.tags.some(t => t.toLowerCase().includes(token))) score += 0.8;
  }
  // boost for common labour keywords
  const keywords = ["termination", "retrenchment", "wage", "pf", "esi", "gratuity", "bonus", "maternity", "posh", "leave", "overtime", "notice", "contract labour"];
  for (const kw of keywords) {
    if (query.toLowerCase().includes(kw) && text.includes(kw)) score += 1.2;
  }
  return score;
}

export function retrieveRelevantChunks(query: string, topK = 5): RetrievedChunk[] {
  if (!query || query.trim().length < 3) return [];

  const scored = DATASET.map(entry => ({
    entry,
    relevance: computeRelevance(query, entry)
  }));

  return scored
    .filter(s => s.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, topK);
}

export function getAllEntries(): DatasetEntry[] {
  return DATASET;
}

export function getDatasetLastUpdated(): string {
  return (datasetRaw as any).metadata?.last_updated || "2026-06-18";
}
