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
  // Optional
  characters,
  complete,
  fandoms,
  hits,
  kudos,
  relationships,
  warnings,
}: StoryBanner) {
  const completeText = complete === true ? "Complete" : complete === false ? "Incomplete" : undefined;
  return (
    <div className="m-4 rounded-md border">
      <div className="flex justify-between">
        <div className="flex">
          <Link href={link}>
            <h3 className="font-bold">{title}</h3>
          </Link>
          <h3 className="text-neutral-500">by: {author}</h3>
        </div>
        <h3>{origin}</h3>
      </div>
      <div className="flex">
        {fandoms && fandoms[0] && (
          <>
            <p className="mr-2">Fandoms:</p>
            {fandoms.map((fandom) => (
              <p key={fandom} className="mr-2 bg-cyan-300">
                {fandom}
              </p>
            ))}
          </>
        )}
      </div>
      <div className="flex">
        {tags && tags[0] && (
          <>
            <p className="mr-2">Tags:</p>
            {tags.map((tag) => (
              <p key={tag} className="mr-2 bg-cyan-300">
                {tag}
              </p>
            ))}
          </>
        )}
      </div>
      <div className="flex">
        {characters && characters[0] && (
          <>
            <p className="mr-2">Characters:</p>
            {characters.map((character) => (
              <p key={character} className="mr-2 bg-cyan-300">
                {character}
              </p>
            ))}
          </>
        )}
      </div>
      <div className="flex">
        {relationships && relationships[0] && (
          <>
            <p className="mr-2">Relationships:</p>
            {relationships.map((relationship) => (
              <p key={relationship} className="mr-2 bg-cyan-300">
                {relationship}
              </p>
            ))}
          </>
        )}
      </div>
      <div className="flex">
        {warnings && warnings[0] && (
          <>
            <p className="mr-2">Warnings:</p>
            {warnings.map((warning) => (
              <p key={warning} className="mr-2 bg-cyan-300">
                {warning}
              </p>
            ))}
          </>
        )}
      </div>
      <div className="flex">
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
