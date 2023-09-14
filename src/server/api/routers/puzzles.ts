import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "src/server/api/trpc";
import { prisma } from "src/server/db";
import { update } from "@echecs/elo";
import { use } from "react";
import { PublicKey } from "@solana/web3.js";
import { program, connection } from "../../../anchor/setup";
import { BN } from "@coral-xyz/anchor";
import { Puzzle } from "lucide-react";

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
        id: z.string(),
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
              in: [...user.completedPuzzles, input.id],
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
        ranked: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.findFirst({
        where: {
          walletAddress: input.address,
        },
      });
      if (user.completedPuzzles.includes(input.puzzleID)) {
        return; // Puzzle already completed, return without updating
      }
      if (!user) {
        throw new Error("User not found");
      }

      let rating;
      let count;

      if (input.ranked === true) {
        if (user.puzzleCount === 5) {
          count = 0;
        } else {
          count = user.puzzleCount + 1;
        }
        rating = user.puzzleRatingChain;
        const puzzleDifficulty = parseInt(input.puzzleRating); // The puzzle's difficulty
        const newPlayerRating = calculateLossRatingChange(
          rating,
          puzzleDifficulty,
        );

        return await prisma.user.update({
          where: { walletAddress: input.address },
          data: {
            puzzleRatingChain: newPlayerRating, // Update the puzzleRating with the new rating
            completedPuzzles: [...user.completedPuzzles, input.puzzleID],
            puzzleCount: count, // Add the puzzle ID as a string to the completedPuzzles array
          },
        });
      } else {
        rating = user.puzzleRating;
        const puzzleDifficulty = parseInt(input.puzzleRating); // The puzzle's difficulty
        const newPlayerRating = calculateLossRatingChange(
          rating,
          puzzleDifficulty,
        );
        return await prisma.user.update({
          where: { walletAddress: input.address },
          data: {
            puzzleRatingChain: newPlayerRating, // Update the puzzleRating with the new rating
            completedPuzzles: [...user.completedPuzzles, input.puzzleID],
            puzzleCount: user.puzzleCount, // Add the puzzle ID as a string to the completedPuzzles array
          },
        });
      }
    }),

  onSuccess: publicProcedure
    .input(
      z.object({
        address: z.string(),
        puzzleRating: z.string(),
        puzzleID: z.string(),
        ranked: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.findFirst({
        where: {
          walletAddress: input.address,
        },
      });
      if (user.completedPuzzles.includes(input.puzzleID)) {
        return; // Puzzle already completed, return without updating
      }
      if (!user) {
        throw new Error("User not found");
      }

      let rating;
      let count;
      if (input.ranked === true) {
        if (user.puzzleCount === 5) {
          count = 0;
        } else {
          count = user.puzzleCount + 1;
        }
        rating = user.puzzleRatingChain;
        const puzzleDifficulty = parseInt(input.puzzleRating); // The puzzle's difficulty
        const newPlayerRating = calculateWinRatingChange(
          rating,
          puzzleDifficulty,
        );

        return await prisma.user.update({
          where: { walletAddress: input.address },
          data: {
            puzzleRatingChain: newPlayerRating, // Update the puzzleRating with the new rating
            completedPuzzles: [...user.completedPuzzles, input.puzzleID],
            puzzleCount: count, // Add the puzzle ID as a string to the completedPuzzles array
          },
        });
      } else {
        rating = user.puzzleRating;
        const puzzleDifficulty = parseInt(input.puzzleRating); // The puzzle's difficulty
        const newPlayerRating = calculateLossRatingChange(
          rating,
          puzzleDifficulty,
        );
        return await prisma.user.update({
          where: { walletAddress: input.address },
          data: {
            puzzleRating: newPlayerRating, // Update the puzzleRating with the new rating
            completedPuzzles: [...user.completedPuzzles, input.puzzleID],
            puzzleCount: user.puzzleCount, // Add the puzzle ID as a string to the completedPuzzles array
          },
        });
      }
    }),
  updateRating: publicProcedure
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const userUpdated = await prisma.user.findFirst({
        where: { walletAddress: input.address },
      });
      return userUpdated;
    }),
  updateRatingChain: publicProcedure
    .input(
      z.object({
        address: z.string(),
        rating: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const userUpdated = await prisma.user.update({
        where: { walletAddress: input.address },
        data: {
          puzzleCount: 0,
          puzzleRatingChain: input.rating, // Add the puzzle ID as a string to the completedPuzzles array
        },
      });
      return userUpdated;
    }),
});
