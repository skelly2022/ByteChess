import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "src/server/api/trpc";
import { prisma } from "~/server/db";

export const leaderboardRouter = createTRPCRouter({
  getRandomPuzzle: protectedProcedure.query(async () => {
    const puzzle = await prisma.puzzle.findFirst({});
  }),
});
