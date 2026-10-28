import datasetRaw from "../data/labour-law-dataset.json";
import { retrieve, type DatasetEntry, type RetrievedChunk } from "./retrieve";

export type { DatasetEntry, RetrievedChunk };

const DATASET: DatasetEntry[] = (datasetRaw as { entries?: DatasetEntry[] }).entries || [];

export function retrieveRelevantChunks(query: string, topK = 5): RetrievedChunk[] {
  return retrieve(DATASET, query, topK);
}

export function getAllEntries(): DatasetEntry[] {
  return DATASET;
}

export function getDatasetLastUpdated(): string {
  return (datasetRaw as { metadata?: { last_updated?: string } }).metadata?.last_updated || "2026-06-18";
}
