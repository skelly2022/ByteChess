import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "src/server/api/trpc";
import { prisma } from "src/server/db";

function calculateLossRatingChange(playerRating, puzzleDifficulty) {
  const sensitivity = 0.1; // You can adjust this as needed
  const ratingChange = -sensitivity * (playerRating - puzzleDifficulty);
  const newPlayerRating = playerRating - ratingChange;
  return Math.floor(newPlayerRating);
}
function calculateWinRatingChange(playerRating, puzzleDifficulty) {
  const sensitivity = 0.1; // You can adjust this as needed
  const ratingChange = sensitivity * (puzzleDifficulty - playerRating);
  const newPlayerRating = playerRating + ratingChange;
  return Math.floor(newPlayerRating);
}

export const gamesRouter = createTRPCRouter({
  getGame: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const game = await prisma.customGame.findFirst({
        where: {
          id: input.id,
        },
      });
      if (!game) {
        throw new Error("game not found");
      }
      return game;
    }),
  newGame: publicProcedure
    .input(
      z.object({
        address: z.string(),
        mode: z.string(),
        time: z.string(),
        color: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      console.log(input);
      const user = await prisma.user.findFirst({
        where: {
          walletAddress: input.address,
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      console.log(user);
      return prisma.customGame.create({
        data: {
          walletAddress: input.address,
          Mode: input.mode,
          Time: input.time,
          Color: input.color,
          Rating: user.blitzRating,
        },
      });
    }),
  getAllGames: publicProcedure.query(async () => {
    const games = await prisma.customGame.findMany({});
    return games;
  }),
});
