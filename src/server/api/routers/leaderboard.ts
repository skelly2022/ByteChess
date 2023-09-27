import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "src/server/api/trpc";
import { prisma } from "~/server/db";

export const leaderboardRouter = createTRPCRouter({
  getBullet: protectedProcedure.mutation(async () => {
    const bullet = await prisma.user.findMany({
      orderBy: {
        bulletRating: "desc", // 'asc' for ascending order, 'desc' for descending order
      },
    });
    return bullet;
  }),
  getRapid: protectedProcedure.mutation(async () => {
    const bullet = await prisma.user.findMany({
      orderBy: {
        rapidRating: "desc", // 'asc' for ascending order, 'desc' for descending order
      },
    });
    return bullet;
  }),
  getBlitz: protectedProcedure.mutation(async () => {
    const bullet = await prisma.user.findMany({
      orderBy: {
        blitzRating: "desc", // 'asc' for ascending order, 'desc' for descending order
      },
    });
    return bullet;
  }),
  getPuzzle: protectedProcedure.mutation(async () => {
    const bullet = await prisma.user.findMany({
      orderBy: {
        puzzleRating: "desc", // 'asc' for ascending order, 'desc' for descending order
      },
    });
    return bullet;
  }),
});
