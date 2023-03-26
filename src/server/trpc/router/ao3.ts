import { z } from "zod";
import { parse } from "node-html-parser";

import { router, publicProcedure } from "../trpc";

import type { HTMLElement } from "node-html-parser";

type Work = {
  author: string;
  bookmarks?: number;
  link: string;
  categories: string[];
  chapterCount: number;
  characters: string[];
  complete: boolean;
  comments?: number;
  expectedChapters: number;
  fandoms: string[];
  hits: number;
  kudos: number;
  language?: string;
  rating?: string;
  relationships: string[];
  restricted: boolean;
  summary: string;
  tags: string[];
  title: string;
  warnings: string[];
  id: number;
  words: number;
  collections?: number;
  dateUpdated: Date;
  datePublished: Date;
};

function ifTuple(tuple?: Array<number | undefined>) {
  if (!tuple) return;
  return tuple[1] ? `${tuple[0]}-${tuple[1]}` : `${tuple[0]}`;
}

function urlMerge(url: string, field: string, data?: string) {
  return url.concat(`&work_search[${field}]=${data || ""}`);
}

function getTextFromHTML(html: HTMLElement, querySelector: string) {
  return html.querySelector(querySelector)?.innerText;
}
function getNumberFromHTML(html: HTMLElement, querySelector: string) {
  return parseInt(getTextFromHTML(html, querySelector) || "0", 10);
}

function AO3Input() {
  return z
    .object({
      anyField: z.string().optional().default(""),
      title: z.string().optional().default(""),
      author: z.string().optional().default(""),
      singleChapter: z.boolean().optional().default(false),
      wordCount: z.tuple([z.number(), z.number().optional()]).optional(),
      language: z.string().optional().default(""),
      fandoms: z.string().array().optional(),
      rating: z.tuple([z.number(), z.number().optional()]).optional(),
      hits: z.tuple([z.number(), z.number().optional()]).optional(),
      kudos: z.tuple([z.number(), z.number().optional()]).optional(),
      crossovers: z.custom<"T" | "F">().nullable().optional().default(null),
      bookmarks: z.tuple([z.number(), z.number().optional()]).optional(),
      comments: z.tuple([z.number(), z.number().optional()]).optional(),
      completionStatus: z.custom<"T" | "F">().nullable().optional().default(null),
      page: z.number().optional().default(1),
      sortColumn: z.string().optional().default(""),
      sortDirection: z.string().optional().default(""),
      revisedAt: z.date().optional(),
      // session: z.null().optional().default(null),
      characters: z.string().array().optional(),
      relationships: z.string().array().optional(),
      tags: z.string().array().optional(),
    })
    .nullish();
}

export const AO3InputType = AO3Input()._type;

function getAO3URL(input: NonNullable<typeof AO3InputType>) {
  let url = "https://archiveofourown.org/works/search?";
  url = urlMerge(url, "query", input.anyField != "" ? input.anyField : " ");
  url = url.concat(`&page=${input.page}`);
  url = urlMerge(url, "title", input.title);
  url = urlMerge(url, "creators", input.author);
  if (input.singleChapter) url = url.concat(`&work_search[single_chapter]=1`);
  url = urlMerge(url, "word_count", ifTuple(input.wordCount));
  url = urlMerge(url, "language_id", input.language);
  url = urlMerge(url, "fandom_names", input.fandoms?.join(","));
  url = urlMerge(url, "character_names", input.characters?.join(","));
  url = urlMerge(url, "relationship_names", input.relationships?.join(","));
  url = urlMerge(url, "freeform_names", input.tags?.join(","));
  url = urlMerge(url, "rating_ids", ifTuple(input.rating));
  url = urlMerge(url, "hits", ifTuple(input.hits));
  url = urlMerge(url, "kudos_count", ifTuple(input.kudos));
  if (input.crossovers !== undefined) url = urlMerge(url, "crossover", input.crossovers ? "T" : "F");
  url = urlMerge(url, "bookmarks_count", ifTuple(input.bookmarks));
  url = urlMerge(url, "comments_count", ifTuple(input.comments));
  if (input.completionStatus !== undefined)
    url = urlMerge(url, "complete", input.completionStatus ? "T" : "F");
  url = urlMerge(url, "sort_column", input.sortColumn);
  url = urlMerge(url, "sort_direction", input.sortDirection);
  // url = urlMerge(url, "revised_at", input.revisedAt);
  return url;
}

async function getWorkFromArticle(article: HTMLElement): Promise<Work> {
  const chapters = article.querySelector("dd.chapters")?.innerText.split("/");
  const id = parseInt(
    article.querySelector("h4.heading a")?.attrs["href"]?.replace("/works/", "") || "0",
    10
  );
  const work = parse(
    await (
      await fetch(`https://archiveofourown.org/works/${id}`, {
        headers: {
          cookie: "accepted_tos=20180523; view_adult=true;",
        },
      })
    ).text()
  );
  const datePublished = new Date(work.querySelector("dl.stats dd.published")?.innerText || "");
  const categoryString = getTextFromHTML(article, "dd.categories");
  return {
    title: article.querySelectorAll("h4.heading a")[0]?.innerText || "",
    link: `https://archiveofourown.org/works/${id}`,
    author: article.querySelectorAll("h4.heading a")[1]?.innerText || "",
    id,
    fandoms: article.querySelectorAll("h5.fandoms.heading a.tag").map((fandom) => fandom.innerText),
    warnings: article.querySelectorAll("ul.tags li.warnings a.tag").map((warning) => warning.innerText),
    relationships: article
      .querySelectorAll("ul.tags li.relationships a.tag")
      .map((warning) => warning.innerText),
    characters: article.querySelectorAll("ul.tags li.characters a.tag").map((warning) => warning.innerText),
    tags: article.querySelectorAll("ul.tags li.freeforms a.tag").map((warning) => warning.innerText),
    summary: article
      .querySelectorAll("blockquote.summary p")
      .map((warning) => warning.innerText)
      .join("/n"),
    words: getNumberFromHTML(article, "dd.words"),
    language: article.querySelector("dd.language")?.innerText,
    chapterCount: parseInt(chapters && chapters[0] ? chapters[0] : "" || "0", 10),
    expectedChapters: parseInt(chapters && chapters[1] ? chapters[1] : "0", 10),
    hits: getNumberFromHTML(article, "dd.hits"),
    complete: chapters ? chapters[0] === chapters[1] : false,
    comments: getNumberFromHTML(article, "dd.comments"),
    collections: getNumberFromHTML(article, "dd.collections"),
    bookmarks: getNumberFromHTML(article, "dd.bookmarks"),
    kudos: getNumberFromHTML(article, "dd.kudos"),
    restricted: !!article.querySelector("img[title=restricted]"), // TODO: test this
    dateUpdated: new Date(article.querySelector("p.datetime")?.innerText || ""), // TODO: test this
    categories: !!categoryString ? categoryString.split(", ") : [],
    rating: getTextFromHTML(article, "span.rating"),
    datePublished,
  };
}

async function processAO3Search(req: Response) {
  const parsed = parse(await req.text());
  const results = parsed.querySelector("ol.work.index.group");

  if (
    !results ||
    !!parsed
      .querySelector("#main.works-search.region")
      ?.childNodes.find(
        (node) =>
          node.textContent === "No results found. You may want to edit your search to make it less specific."
      )
  ) {
    return;
  }

  const articles = results.querySelectorAll("li[role='article']");

  const works: Work[] = await Promise.all(articles.map(async (article) => await getWorkFromArticle(article)));

  return works;
}

export const AO3Router = router({
  search: publicProcedure.input(AO3Input()).query(async ({ input }) => {
    if (!input) throw new Error("Something went wrong with the AO3 Router. No input was given.");

    const url = getAO3URL(input);

    // const search = { results: [], totalResults: 0, pages: 0 };

    let req = null;
    /* if (input.session === null)*/ req = await fetch(url);
    // else req = session.get(url)
    if (!req) throw new Error("Something went wrong with fetching from AO3. No request was returned.");
    if (req.status === 429)
      throw new Error("We are being rate-limited. Try again in a while or reduce the number of requests");

    return processAO3Search(req);
  }),
  login: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .query(async ({ input }) => {
      if (!input) throw new Error("Something went wrong with the AO3 Router. No input was given.");

      // const search = { results: [], totalResults: 0, pages: 0 };
      const req = await fetch(
        `https://archiveofourown.org/users/login?authenticity_token=9riXYn8UdReE4RFxZ1NLlhAM6L8h1iOzoXYJfIc2fAv3ORK99Vjn6ql4524ZmXuZFF%2Fj8fEVOaekNkzgWJMicw%3D%3D&user%5Blogin%5D=${input.username}&user%5Bpassword%5D=${input.password}&user%5Bremember_me%5D=1&commit=Log+In`,
        { method: "POST" }
      );

      if (!req) throw new Error("Something went wrong with fetching from AO3. No request was returned.");
      if (req.status === 429)
        throw new Error("We are being rate-limited. Try again in a while or reduce the number of requests");

      console.log({ req });
      return processAO3Search(req);
    }),
});
