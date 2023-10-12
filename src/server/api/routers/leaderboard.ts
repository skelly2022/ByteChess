import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "src/server/api/trpc";
import { prisma } from "~/server/db";

export const leaderboardRouter = createTRPCRouter({
  getRatings: protectedProcedure.mutation(async () => {
    const bullet = await prisma.user.findMany({
      orderBy: {
        bulletRating: "desc",
      },
    });

    const rapid = await prisma.user.findMany({
      orderBy: {
        rapidRating: "desc",
      },
    });

    const blitz = await prisma.user.findMany({
      orderBy: {
        blitzRating: "desc",
      },
    });

    const puzzle = await prisma.user.findMany({
      orderBy: {
        puzzleRating: "desc",
      },
    });

    return {
      bullet,
      rapid,
      blitz,
      puzzle,
    };
  }),
});
