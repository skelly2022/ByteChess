import { exampleRouter } from "src/server/api/routers/example";
import { createTRPCRouter } from "src/server/api/trpc";
import { puzzleRouter } from "./routers/puzzles";
import { gamesRouter } from "./routers/games";
import { leaderboardRouter } from "./routers/leaderboard";
import { tournamentRouter } from "./routers/tournament";
import { mintRouter } from "./routers/mint";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  puzzles: puzzleRouter,
  games: gamesRouter,
  leaderboard: leaderboardRouter,
  tournament: tournamentRouter,
  mint: mintRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
