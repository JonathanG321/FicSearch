export const sortByValues = [
  "_score",
  "authors_to_sort_on",
  "title_to_sort_on",
  "created_at",
  "revised_at",
  "word_count",
  "hits",
  "kudos_count",
  "comments_count",
  "bookmarks_count",
];

export const sortByOptions = [
  { label: "Relevance", value: sortByValues[0] },
  { label: "Author", value: sortByValues[1] },
  { label: "Title", value: sortByValues[2] },
  { label: "Date Created", value: sortByValues[3] },
  { label: "Date Revised", value: sortByValues[4] },
  { label: "Word Count", value: sortByValues[5] },
  { label: "Hits", value: sortByValues[6] },
  { label: "Kudos", value: sortByValues[7] },
  { label: "Comments", value: sortByValues[8] },
  { label: "Bookmarks", value: sortByValues[9] },
];
