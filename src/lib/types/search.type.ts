/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SearchResult {
  id: string;
  type: "vehicle" | "lead" | "customer";
  title: string;
  description: string;
  url: string;
  image?: string;
  metadata?: Record<string, any>;
}
