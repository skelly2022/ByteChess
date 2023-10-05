import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "src/server/api/trpc";
import { prisma } from "src/server/db";

function calculateEloChange(winnerRating, loserRating) {
  const kFactor = 32; // You can adjust this as needed
  const expectedWinnerScore =
    1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
  const expectedLoserScore =
    1 / (1 + Math.pow(10, (winnerRating - loserRating) / 400));

  const winnerNewRating = winnerRating + kFactor * (1 - expectedWinnerScore);
  const loserNewRating = loserRating + kFactor * (0 - expectedLoserScore);

  return {
    winnerNewRating: Math.round(winnerNewRating),
    loserNewRating: Math.round(loserNewRating),
  };
}
function calculateEloChangeDraw(playerRating, opponentRating) {
  const kFactor = 8; // You can adjust this as needed
  const expectedScore =
    1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));

  const playerNewRating = playerRating + kFactor * (0.5 - expectedScore);
  const opponentNewRating =
    opponentRating + kFactor * (0.5 - (1 - expectedScore));

  return {
    winnerNewRating: Math.round(playerNewRating),
    loserNewRating: Math.round(opponentNewRating),
  };
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
  getGameTournament: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const game = await prisma.customGame.findFirst({
        where: {
          walletAddress: input.id,
        },
        orderBy: {
          createdAt: "desc", // Assuming you have a 'createdAt' field. Change this to your timestamp field's name if different.
        },
      });

      if (!game) {
        throw new Error("game not found");
      }
      return game;
    }),

  updatePlayerJoin: publicProcedure
    .input(
      z.object({
        address: z.string(),
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const userUpdated = await prisma.customGame.update({
        where: { id: input.id },
        data: {
          walletAddress2: input.address,
        },
      });
      return userUpdated;
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
      const user = await prisma.user.findFirst({
        where: {
          walletAddress: input.address,
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      return prisma.customGame.create({
        data: {
          walletAddress: input.address,
          walletAddress2: "",
          Mode: input.mode,
          Time: input.time,
          Color: input.color,
          Rating: user.blitzRating,
        },
      });
    }),
  updateGameFen: publicProcedure
    .input(
      z.object({
        id: z.string(),
        fen: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      console.log(input);
      // const games = await prisma.customGame.findMany({});
      // return games;
      const games = await prisma.customGame.update({
        where: { id: input.id },
        data: {
          FEN: input.fen,
        },
      });
    }),
  updateGameWin: publicProcedure
    .input(
      z.object({
        winnerAddress: z.string(),
        loserAddress: z.string(),
        wElo: z.number(),
        lElo: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      console.log(input);
      const { winnerNewRating, loserNewRating } = calculateEloChange(
        input.wElo,
        input.lElo,
      );
      const rating = await prisma.user.update({
        where: { walletAddress: input.winnerAddress },
        data: {
          bulletRating: winnerNewRating,
        },
      });
      const loseUser = await prisma.user.findFirst({
        where: { walletAddress: input.loserAddress },
      });
      const loserRating = await prisma.user.update({
        where: { walletAddress: input.loserAddress },
        data: {
          bulletRating: loserNewRating,

          // losse,
        },
      });
      return { rating: rating, loserRating: loserRating };
    }),
  updateGameDraw: publicProcedure
    .input(
      z.object({
        winnerAddress: z.string(),
        loserAddress: z.string(),
        wElo: z.number(),
        lElo: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      console.log(input);
      const { winnerNewRating, loserNewRating } = calculateEloChangeDraw(
        input.wElo,
        input.lElo,
      );
      console.log(winnerNewRating, loserNewRating);
      const rating = await prisma.user.update({
        where: { walletAddress: input.winnerAddress },
        data: {
          bulletRating: winnerNewRating,
        },
      });
      const loserRating = await prisma.user.update({
        where: { walletAddress: input.loserAddress },
        data: {
          bulletRating: loserNewRating,
        },
      });
      return { rating: rating, loserRating: loserRating };
    }),
  getUsers: publicProcedure
    .input(
      z.object({
        winnerAddress: z.string(),
        loserAddress: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      console.log(input);

      const rating = await prisma.user.findFirst({
        where: { walletAddress: input.winnerAddress },
      });
      const loserRating = await prisma.user.findFirst({
        where: { walletAddress: input.loserAddress },
      });
      return { rating: rating, loserRating: loserRating };
    }),
  getAllGames: publicProcedure.query(async () => {
    const games = await prisma.customGame.findMany({});
    return games;
  }),
  createNFT: publicProcedure.mutation(async () => {}),
});
