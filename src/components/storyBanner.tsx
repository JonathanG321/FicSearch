import Link from "next/link";

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
  return (
    <div className="m-4 rounded-md border">
      <div className="flex justify-between">
        <Link href={link}>
          <h3 className="font-bold">{title}</h3>
        </Link>
        <h3>{origin}</h3>
      </div>
    </div>
  );
}

export default StoryBanner;
