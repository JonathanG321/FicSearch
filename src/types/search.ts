export type SpaceBattlesSearch = {
  keyWords?: string;
  tags?: string[];
  excludeTags?: string[];
  newerThan?: Date;
  olderThan?: Date;
  users?: string[];
  wordCountLower?: string;
  wordCountUpper?: string;
  replies?: string;
  order?: "date" | "relevance" | "words" | "last_update" | "replies";
};

export type AO3Search = {
  anyField: string;
  title: string;
  author: string;
  singleChapter: boolean;
  wordCount: number[];
  language: string;
  fandoms: string[];
  rating: number[];
  hits: number[];
  kudos: number[];
  crossovers: boolean;
  bookmarks: number[];
  comments: number[];
  completionStatus: boolean;
  sortColumn: string;
  sortDirection: string;
  revisedAt: string;
  characters: string;
  relationships: string;
  tags: string[];
};
