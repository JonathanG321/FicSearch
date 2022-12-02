import { z } from "zod";
import { parse } from "node-html-parser";

import { router, publicProcedure } from "../trpc";

import type { HTMLElement } from "node-html-parser";

type Work = {
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
};

function getTextFromHTML(html: HTMLElement, querySelector: string) {
  return html.querySelector(querySelector)?.innerText.trim();
}
function getNumberFromHTML(html: HTMLElement, querySelector: string) {
  return parseInt(getTextFromHTML(html, querySelector) || "0", 10);
}

function spaceBattlesInput() {
  return z
    .object({
      keyWords: z.string().optional().default(""),
      tags: z.array(z.string()).optional().default([]),
      excludeTags: z.array(z.string()).optional().default([]),
      newerThan: z.date(),
      olderThan: z.date(),
      users: z.array(z.string()).optional().default([]),
      wordCountLower: z.string(),
      wordCountUpper: z.string(),
      replies: z.string(),
      order: z.string().default("date"),
      session: z.null().default(null),
    })
    .nullish();
}

const spaceBattlesInputType = spaceBattlesInput()._type;

function getSpaceBattlesURL(input: NonNullable<typeof spaceBattlesInputType>) {
  let url =
    "https://forums.spacebattles.com/search/38499309/?q=%2A&t=post&c[child_nodes]=1&c[in_threadmark_categories]=1&c[nodes][0]=18&c[threadmark_categories][0]=1&c[threadmark_categories][1]=16&c[threadmark_only]=1&g=1";
  // https://forums.spacebattles.com/search/38405835/?q=ha&c[excludeTags]=fate&c[newer_than]=2022-11-08&c[older_than]=2022-11-30&c[users]=Sontar-ha&c[word_count][lower]=1&c[word_count][upper]=10000&o=date
  url = url.concat(`&q=${input.keyWords}`);
  url = url.concat(`&c[tags]=${input.tags.join(",")}`);
  url = url.concat(`&c[excludeTags]=${input.excludeTags.join(",")}`);
  url = url.concat(`&c[newer_than]=${input.newerThan}`);
  url = url.concat(`&c[older_than]=${input.olderThan}`);
  url = url.concat(`&c[users]=${input.users.join(",")}`);
  url = url.concat(`&c[word_count][lower]=${input.wordCountLower}`);
  url = url.concat(`&c[word_count][upper]=${input.wordCountUpper}`);
  url = url.concat(`&c[min_reply_count]=${input.replies}`);
  url = url.concat(`&o=${input.order}`);
  return url;
}

async function getWorkFromArticle(article: HTMLElement): Promise<Work> {
  const linkPath = article.querySelector("h3.contentRow-title a")?.attrs["href"];
  const work = parse(await (await fetch(`https://forums.spacebattles.com/${linkPath}`)).text());

  return {
    title: getTextFromHTML(article, "h3.contentRow-title a") || "",
    link: `https://forums.spacebattles.com/${linkPath}`,
    summary:
      getTextFromHTML(work, "article.threadmarkListingHeader-extraInfoChild.message-body div.bbwrapper") ||
      "",
    words: parseInt(article.querySelector("li.wordcount")?.attrs["data-word_count"] || "0", 10),
    author: getTextFromHTML(article, "a.username") || "",
    tags: article.querySelectorAll("li span.tagItem").map((tag) => tag.innerText.trim()),
    comments:
      parseInt(
        article
          .querySelectorAll("ul.listInLine li")
          .filter((data) => data.innerText.includes("Replies:"))[0]
          ?.innerText.replace("Replies: ", "") || "0"
      ) || 0,
    datePublished: new Date(article.querySelector("time.u-dt")?.attrs["datetime"] || ""),
    chapterCount: getNumberFromHTML(work, "div.pairJustifier dl.fauxBlockLink dd"),
    dateUpdated: new Date(
      work.querySelector("li[role=tabpanel] div.structItemContainer:last-child time.u-dt")?.attrs[
        "datetime"
      ] || ""
    ),
  };
}

async function processSpaceBattlesSearch(req: Response) {
  const parsed = parse(await req.text());
  const results = parsed.querySelector("ol.block-body");

  if (
    !results ||
    !!parsed
      .querySelector("div.block-message")
      ?.childNodes.find((node) => node.textContent === "No results found.")
  ) {
    return;
  }

  const articles = results.querySelectorAll("li.block-row");

  const works: Work[] = await Promise.all(articles.map(async (article) => await getWorkFromArticle(article)));

  return works;
}

export const spaceBattlesRouter = router({
  search: publicProcedure.input(spaceBattlesInput()).query(async ({ input }) => {
    if (!input) throw new Error("Something went wrong with the spaceBattles Router. No input was given.");

    const url = getSpaceBattlesURL(input);

    // const search = { results: [], totalResults: 0, pages: 0 };

    let req = null;
    if (input.session === null) req = await fetch(url);
    // else req = session.get(url)
    if (!req)
      throw new Error("Something went wrong with fetching from SpaceBattles. No request was returned.");
    if (req.status === 429)
      throw new Error("We are being rate-limited. Try again in a while or reduce the number of requests");

    return processSpaceBattlesSearch(req);
  }),
});
