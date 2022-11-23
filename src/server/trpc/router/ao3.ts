import { z } from "zod";

import { router, publicProcedure } from "../trpc";

function ifTuple(tuple: Array<number | null>) {
  return tuple[1] ? `${tuple[0]}-${tuple[1]}` : `${tuple[0]}`;
}

function urlMerge(url: string, field: string, data: string) {
  return url.concat(`work_search[${field}]=${data}`);
}

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
          rating: z.tuple([z.number(), z.number().nullable().default(null)]).nullable(),
          hits: z.tuple([z.number(), z.number().nullable().default(null)]).nullable(),
          kudos: z.tuple([z.number(), z.number().nullable().default(null)]).nullable(),
          crossovers: z.boolean().default(false),
          bookmarks: z.tuple([z.number(), z.number().nullable().default(null)]).nullable(),
          comments: z.tuple([z.number(), z.number().nullable().default(null)]).nullable(),
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
    .query(async ({ input, ctx }) => {
      if (!input) throw new Error("Something went wrong with the AO3 Router. No input was given.");
      const url = "https://archiveofourown.org/works/search?";
      urlMerge(url, "query", input.anyField != "" ? input.anyField : " ");
      if (input.page !== 1) url.concat(`page=${input.page}`);
      if (input.title !== "") urlMerge(url, "title", input.title);
      if (input.author !== "") urlMerge(url, "creators", input.author);
      if (input.singleChapter) url.concat(`work_search[single_chapter]=1`);
      if (input.wordCount !== null) urlMerge(url, "word_count", ifTuple(input.wordCount));
      if (input.language !== "") urlMerge(url, "language_id", input.language);
      if (input.fandoms !== "") urlMerge(url, "fandom_names", input.fandoms);
      if (input.characters !== "") urlMerge(url, "character_names", input.characters);
      if (input.relationships !== "") urlMerge(url, "relationship_names", input.relationships);
      if (input.tags !== "") urlMerge(url, "freeform_names", input.tags);
      if (input.rating !== null) urlMerge(url, "rating_ids", ifTuple(input.rating));
      if (input.hits !== null) urlMerge(url, "hits", ifTuple(input.hits));
      if (input.kudos !== null) urlMerge(url, "kudos_count", ifTuple(input.kudos));
      if (input.crossovers !== null) urlMerge(url, "crossover", input.crossovers ? "T" : "F");
      if (input.bookmarks !== null) urlMerge(url, "bookmarks_count", ifTuple(input.bookmarks));
      if (input.comments !== null) urlMerge(url, "comments_count", ifTuple(input.comments));
      if (input.completionStatus !== null) urlMerge(url, "complete", input.completionStatus ? "T" : "F");
      if (input.sortColumn !== "") urlMerge(url, "sort_column", input.sortColumn);
      if (input.sortDirection !== "") urlMerge(url, "sort_direction", input.sortDirection);
      if (input.revisedAt !== "") urlMerge(url, "revised_at", input.revisedAt);

      let req = null;
      if (input.session === null) req = await fetch(url);
      // else req = session.get(url)
      if (!req) throw new Error("Something went wrong with fetching from AO3. No request was returned.");
      if (req.status === 429)
        throw new Error("We are being rate-limited. Try again in a while or reduce the number of requests");
      // const soup = BeautifulSoup(req.content, features="lxml")
      // return soup
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
});
