import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { AO3Router } from "./ao3";

export const appRouter = router({
  example: exampleRouter,
  AO3: AO3Router,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
