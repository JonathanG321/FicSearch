type StoryBanner = {
  origin: string;
  author: string;
  link: string;
  chapterCount: number;
  comments: number;
  summary: string;
  tags: string[];
  title: string;
  words: number;
  dateUpdated: Date;
  datePublished: Date;
  characters?: string[];
  complete?: boolean;
  fandoms?: string[];
  hits?: number;
  relationships?: string[];
  kudos?: number;
  warnings?: string[];
};

function StoryBanner({
  origin,
  author,
  chapterCount,
  comments,
  datePublished,
  dateUpdated,
  link,
  summary,
  tags,
  title,
  words,
  characters,
  complete,
  fandoms,
  hits,
  kudos,
  relationships,
  warnings,
}: StoryBanner) {
  return <div></div>;
}

export default StoryBanner;
