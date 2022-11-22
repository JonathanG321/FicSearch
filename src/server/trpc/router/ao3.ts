import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const AO3Router = router({
  search: publicProcedure
    .input(
      z
        .object({
          anyField: z.string().default(""),
          title: z.string().default(""),
          author: z.string().default(""),
          singleChapter: z.boolean().default(false),
          wordCount: z.tuple([z.number(), z.number()]).nullable(),
          language: z.string().default(""),
          fandoms: z.string().default(""),
          rating: z
            .tuple([z.number(), z.number().nullable().default(null)])
            .nullable(),
          hits: z
            .tuple([z.number(), z.number().nullable().default(null)])
            .nullable(),
          kudos: z
            .tuple([z.number(), z.number().nullable().default(null)])
            .nullable(),
          crossovers: z.boolean().default(false),
          bookmarks: z
            .tuple([z.number(), z.number().nullable().default(null)])
            .nullable(),
          comments: z
            .tuple([z.number(), z.number().nullable().default(null)])
            .nullable(),
          completionStatus: z.boolean().nullable(),
          page: z.number().default(1),
          sortColumn: z.string().default(""),
          sortDirection: z.string().default(""),
          revisedAt: z.string().default(""),
          session: z.null().default(null),
          characters: z.string().default(""),
          relationships: z.string().default(""),
          tags: z.string().default(""),
        })
        .nullish()
    )
    .query(async ({ input }) => {
      if (!input)
        throw new Error(
          "Something went wrong with the AO3 Router. No input was given."
        );
      const url = "https://archiveofourown.org/works/search?";
      url.concat(
        `work_search[query]=${input.anyField != "" ? input.anyField : " "}`
      );
      if (input.page !== 1) url.concat(`page=${input.page}`);
      if (input.title !== "") url.concat(`work_search[title]=${input.title}`);
      if (input.author !== "")
        url.concat(`work_search[creators]=${input.author}`);
      if (input.singleChapter) url.concat(`work_search[single_chapter]=1`);
      if (input.wordCount !== null)
        url.concat(`work_search[word_count]=${input.wordCount}`);
      if (input.language !== "")
        url.concat(`work_search[language_id]=${input.language}`);
      if (input.fandoms !== "")
        url.concat(`work_search[fandom_names]=${input.fandoms}`);
      if (input.characters !== "")
        url.concat(`work_search[character_names]=${input.characters}`);
      if (input.relationships !== "")
        url.concat(`work_search[relationship_names]=${input.relationships}`);
      if (input.tags !== "")
        url.concat(`work_search[freeform_names]=${input.tags}`);
      if (input.rating !== null)
        url.concat(
          `work_search[rating_ids]=${
            input.rating[1]
              ? `${input.rating[0]}-${input.rating[1]}`
              : input.rating[0]
          }`
        );
      if (input.hits !== null)
        url.concat(
          `work_search[hits]=${
            input.hits[1] ? `${input.hits[0]}-${input.hits[1]}` : input.hits[0]
          }`
        );
      if (input.kudos !== null)
        url.concat(
          `work_search[kudos_count]=${
            input.kudos[1]
              ? `${input.kudos[0]}-${input.kudos[1]}`
              : input.kudos[0]
          }`
        );
      if (input.crossovers !== null)
        url.concat(`work_search[crossover]=${input.crossovers ? "T" : "F"}`);
      if (input.bookmarks !== null)
        url.concat(`work_search[bookmarks_count]=${input.bookmarks}`);
      if (input.comments !== null)
        url.concat(`work_search[comments_count]=${input.comments}`);
      if (input.completionStatus !== null)
        url.concat(
          `work_search[complete]=${input.completionStatus ? "T" : "F"}`
        );
      if (input.sortColumn != "")
        url.concat(`work_search[sort_column]=${input.sortColumn}`);
      if (input.sortDirection != "")
        url.concat(`work_search[sort_direction]=${input.sortDirection}`);
      if (input.revisedAt != "")
        url.concat(`work_search[revised_at]=${input.revisedAt}`);

      let req = null;
      if (input.session === null) req = await fetch(url);
      // else req = session.get(url)
      if (!req)
        throw new Error(
          "Something went wrong with fetching from AO3. No request was returned."
        );
      if (req.status === 429)
        throw new Error(
          "We are being rate-limited. Try again in a while or reduce the number of requests"
        );
      // const soup = BeautifulSoup(req.content, features="lxml")
      // return soup
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
});
