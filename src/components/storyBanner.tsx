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
      <div className="my-2 flex">
        {fandoms && fandoms[0] && (
          <>
            <p className="mr-2">Fandoms:</p>
            {fandoms.map((fandom) => (
              <p key={fandom} className="mr-2 rounded bg-cyan-300 px-2">
                {fandom}
              </p>
            ))}
          </>
        )}
      </div>
      <div className="my-2 flex">
        {tags && tags[0] && (
          <>
            <p className="mr-2">Tags:</p>
            {tags.map((tag) => (
              <p key={tag} className="mr-2 rounded bg-cyan-300 px-2">
                {tag}
              </p>
            ))}
          </>
        )}
      </div>
      <div className="my-2 flex">
        {characters && characters[0] && (
          <>
            <p className="mr-2">Characters:</p>
            {characters.map((character) => (
              <p key={character} className="mr-2 rounded bg-cyan-300 px-2">
                {character}
              </p>
            ))}
          </>
        )}
      </div>
      <div className="my-2 flex">
        {relationships && relationships[0] && (
          <>
            <p className="mr-2">Relationships:</p>
            {relationships.map((relationship) => (
              <p key={relationship} className="mr-2 rounded bg-cyan-300 px-2">
                {relationship}
              </p>
            ))}
          </>
        )}
      </div>
      <div className="my-2 flex">
        {warnings && warnings[0] && (
          <>
            <p className="mr-2">Warnings:</p>
            {warnings.map((warning) => (
              <p key={warning} className="mr-2 rounded bg-cyan-300 px-2">
                {warning}
              </p>
            ))}
          </>
        )}
      </div>
      <div className="my-2 flex">
        {completeText && <p>{completeText}</p>}
        <p>Words: {words}</p>
        <p>Chapters: {chapterCount}</p>
        <p>Comments: {comments}</p>
        <p>Updated: {dateUpdated.toLocaleDateString()}</p>
        <p>Published: {datePublished.toLocaleDateString()}</p>
        {hits && <p>Hits: {hits}</p>}
        {kudos && <p>Kudos: {kudos}</p>}
      </div>
      <p>{summary}</p>
    </div>
  );
}

export default StoryBanner;
