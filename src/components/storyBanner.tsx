import Link from "next/link";

export type StoryBannerType = {
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
  // Optional
  characters,
  complete,
  fandoms,
  hits,
  kudos,
  relationships,
  warnings,
}: StoryBannerType) {
  const completeText = complete === true ? "Complete" : complete === false ? "Incomplete" : undefined;
  return (
    <div className="m-4 rounded-md border p-4 text-white">
      <div className="mb-1 flex justify-between">
        <div className="flex">
          <Link href={link}>
            <h3 className="mr-1 font-bold">{title}</h3>
          </Link>
          <h3 className="text-neutral-500">by: {author}</h3>
        </div>
        <h3>{origin}</h3>
      </div>
      {fandoms && fandoms[0] && (
        <>
          <div className="my-2 flex">
            <p className="mr-2">Fandoms:</p>
            {fandoms.map((fandom) => (
              <p key={fandom} className="mr-2 rounded bg-cyan-600 px-2">
                {fandom}
              </p>
            ))}
          </div>
        </>
      )}
      {tags && tags[0] && (
        <>
          <div className="my-2 flex">
            <p className="mr-2">Tags:</p>
            {tags.map((tag) => (
              <p key={tag} className="mr-2 rounded bg-cyan-600 px-2">
                {tag}
              </p>
            ))}
          </div>
        </>
      )}
      {characters && characters[0] && (
        <>
          <div className="my-2 flex">
            <p className="mr-2">Characters:</p>
            {characters.map((character) => (
              <p key={character} className="mr-2 rounded bg-cyan-600 px-2">
                {character}
              </p>
            ))}
          </div>
        </>
      )}
      {relationships && relationships[0] && (
        <>
          <div className="my-2 flex">
            <p className="mr-2">Relationships:</p>
            {relationships.map((relationship) => (
              <p key={relationship} className="mr-2 rounded bg-cyan-600 px-2">
                {relationship}
              </p>
            ))}
          </div>
        </>
      )}
      {warnings && warnings[0] && (
        <>
          <div className="my-2 flex">
            <p className="mr-2">Warnings:</p>
            {warnings.map((warning) => (
              <p key={warning} className="mr-2 rounded bg-cyan-600 px-2">
                {warning}
              </p>
            ))}
          </div>
        </>
      )}
      <div className="my-4 flex flex-wrap overflow-x-visible">
        {completeText && <p className="mr-4">{completeText}</p>}
        <p className="mr-4">Words: {words}</p>
        <p className="mr-4">Chapters: {chapterCount}</p>
        <p className="mr-4">Comments: {comments}</p>
        <p className="mr-4">Updated: {dateUpdated.toLocaleDateString()}</p>
        <p className="mr-4">Published: {datePublished.toLocaleDateString()}</p>
        {hits && <p className="mr-4">Hits: {hits}</p>}
        {kudos && <p className="mr-4">Kudos: {kudos}</p>}
      </div>
      <p>{summary}</p>
    </div>
  );
}

export default StoryBanner;
