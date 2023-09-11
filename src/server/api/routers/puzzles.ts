import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "src/server/api/trpc";
import { prisma } from "src/server/db";
import { update } from "@echecs/elo";

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

export const puzzleRouter = createTRPCRouter({
  getRandomPuzzle: publicProcedure
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.findFirst({
        where: {
          walletAddress: input.address,
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      const completedPuzzleIDs = user.completedPuzzles;
      const highEnd = user.puzzleRating + 300;

      const puzzle = await prisma.puzzle.findFirst({
        where: {
          Rating: {
            gte: user.puzzleRating.toString(),
            lte: highEnd.toString(),
          },
          NOT: {
            PuzzleId: {
              in: completedPuzzleIDs,
            },
          },
        },
        orderBy: {
          id: "asc", // Or any other ordering field
        },
      });
      return puzzle;
    }),
  onFail: publicProcedure
    .input(
      z.object({
        address: z.string(),
        puzzleRating: z.string(),
        puzzleID: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.findFirst({
        where: {
          walletAddress: input.address,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }
      const playerRating = user.puzzleRating; // Get player's current rating
      const puzzleDifficulty = parseInt(input.puzzleRating); // The puzzle's difficulty
      const newPlayerRating = calculateLossRatingChange(
        playerRating,
        puzzleDifficulty,
      );
      if (user.completedPuzzles.includes(input.puzzleID)) {
        console.log("Puzzle already completed");
        return; // Puzzle already completed, return without updating
      }
      return await prisma.user.update({
        where: { walletAddress: input.address },
        data: {
          puzzleRating: newPlayerRating, // Update the puzzleRating with the new rating
          completedPuzzles: [...user.completedPuzzles, input.puzzleID], // Add the puzzle ID as a string to the completedPuzzles array
        },
      });
    }),
  onSuccess: publicProcedure
    .input(
      z.object({
        address: z.string(),
        puzzleRating: z.string(),
        puzzleID: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.findFirst({
        where: {
          walletAddress: input.address,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }
      const playerRating = user.puzzleRating; // Get player's current rating
      const puzzleDifficulty = parseInt(input.puzzleRating); // The puzzle's difficulty
      const newPlayerRating = calculateWinRatingChange(
        playerRating,
        puzzleDifficulty,
      );
      if (user.completedPuzzles.includes(input.puzzleID)) {
        console.log("Puzzle already completed");
        return; // Puzzle already completed, return without updating
      }
      const userUpdated = await prisma.user.update({
        where: { walletAddress: input.address },
        data: {
          puzzleRating: newPlayerRating, // Update the puzzleRating with the new rating
          completedPuzzles: [...user.completedPuzzles, input.puzzleID], // Add the puzzle ID as a string to the completedPuzzles array
        },
      });
      return userUpdated;
    }),
});
