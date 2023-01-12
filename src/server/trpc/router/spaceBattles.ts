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
      newerThan: z.date().optional(),
      olderThan: z.date().optional(),
      users: z.array(z.string()).optional().default([]),
      wordCountLower: z.string().optional(),
      wordCountUpper: z.string().optional(),
      replies: z.string().optional(),
      order: z.string().optional().default("date"),
      session: z.null().optional().default(null),
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
  console.log(results);

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
    console.log(url);

    // const search = { results: [], totalResults: 0, pages: 0 };

    let req = null;
    if (input.session === null)
      req = await fetch(url, {
        headers: [
          [
            "cookie",
            "__gads=ID=abd70bf29679d654:T=1643190624:S=ALNI_Mb8fxRl_aj5UkA2kncOcLxh0jGDDw; cto_bundle=_s2EJV9QRmdVb3FtWTVBM0YlMkJsM3ltZjNhU2FBajF2dHlhWHdDTkN6MndlN1kxJTJCbW5YZEthWFNsT0hmWU8zSEltQTRnJTJCVjhhZmdOMXlqbG80YXN0cExQNkEwdVlZdWhPckRtVG5WUmR5U09sV3JRNEFwZUt5MCUyRlZLRkJhOXg2aHBBYU83empGTWtTNzFpc3NWYkZPTWg4VnExc1VYeHZOeEljdEZuRjNCSDFYdWJQZFpuTTM0ajVvWiUyQjQyelhUOEdHeGRZVk1UeWFzSHRHOWx0WHJVTW1KS2NvUSUzRCUzRA; cf_clearance=rWA_fGyucvAqRh7IuRxoMvcZtrFCdYQ_wSSZib3oqrE-1661744578-0-150; _pbjs_userid_consent_data=3524755945110770; __qca=P0-249217702-1671157176011; __gpi=UID=00000908d8dcb887:T=1670126958:RT=1672743521:S=ALNI_MYaTFAE7_qPdIyIt6tsY8coHpe36Q; _gid=GA1.2.212849269.1673386887; _lr_geo_location=CA; _ga=GA1.2.1513995099.1568686015; _ga_F3CLTL2CJQ=GS1.1.1673389445.123.0.1673389448.0.0.0; xf_session=U45Linrs-vPRMG6_YS53voeAT6nxPKLL; xf_csrf=djQcqR6nLWL8-R-O",
          ],
        ],
      });
    // else req = session.get(url)
    if (!req)
      throw new Error("Something went wrong with fetching from SpaceBattles. No request was returned.");
    if (req.status === 429)
      throw new Error("We are being rate-limited. Try again in a while or reduce the number of requests");

    return processSpaceBattlesSearch(req);
  }),
});
