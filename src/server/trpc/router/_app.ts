import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { AO3Router } from "./ao3";
import { spaceBattlesRouter } from "./spaceBattles";

export const appRouter = router({
  example: exampleRouter,
  AO3: AO3Router,
  spaceBattles: spaceBattlesRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
