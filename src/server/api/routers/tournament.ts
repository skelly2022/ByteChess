import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "src/server/api/trpc";
import { prisma } from "src/server/db";
import socket from "~/helpers/socket";

export const tournamentRouter = createTRPCRouter({
  newTournament: publicProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.string(),
        date: z.date(),
        duration: z.string(),
        image: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const newTournament = await prisma.tournament.create({
        data: {
          name: input.name,
          type: input.type,
          date: input.date,
          duration: input.duration,
          image: input.image,
        },
      });
      const allTournaments = await prisma.tournament.findMany();
      return allTournaments;
    }),
  getAllTournaments: publicProcedure.mutation(async () => {
    // Use Prisma to fetch all tournaments
    const allTournaments = await prisma.tournament.findMany();
    return allTournaments;
  }),
  getTournament: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const tournament = await prisma.tournament.findFirst({
        where: { id: input.id },
      });
      const currentPlayers = await prisma.tournamentPlayer.findMany({
        where: {
          tournamentId: input.id,
        },
      });

      return { tournament: tournament, players: currentPlayers };
    }),
  joinTournament: publicProcedure
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
      const tournamentPlayer = await prisma.tournamentPlayer.create({
        data: {
          walletAddress: user.walletAddress,
          name: user.name,
          bulletRating: user.bulletRating,
          blitzRating: user.blitzRating,
          rapidRating: user.rapidRating,
        },
      });
      const updateTournament = await prisma.tournament.update({
        where: {
          id: input.id,
        },
        data: {
          players: {
            connect: {
              id: tournamentPlayer.id, // Connect the player to the tournament
            },
          },
        },
      });
      const currentPlayers = await prisma.tournamentPlayer.findMany({
        where: {
          tournamentId: input.id,
        },
        orderBy: {
          result: "desc", // This sorts players by 'result' in descending order
        },
      });
      return { players: currentPlayers };
    }),
  leaveTournament: publicProcedure
    .input(
      z.object({
        id: z.string(),
        tournamentId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const deleteCurrentPlayers = await prisma.tournamentPlayer.delete({
        where: {
          id: input.id,
        },
      });
      const currentPlayers = await prisma.tournamentPlayer.findMany({
        where: {
          tournamentId: input.tournamentId,
        },
        orderBy: {
          result: "desc", // This sorts players by 'result' in descending order
        },
      });
      return { players: currentPlayers };
    }),
  updateTournamentWin: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const find = await prisma.tournamentPlayer.findFirst({
        where: {
          walletAddress: input.id,
        },
        orderBy: {
          createdAt: "desc", // Assuming you have a 'createdAt' field. Change this to your timestamp field's name if different.
        },
      });
      const update = await prisma.tournamentPlayer.update({
        where: {
          id: find.id,
        },
        data: {
          result: find.result + 3,
        },
      });

      return;
    }),
  getPlayers: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const currentPlayers = await prisma.tournamentPlayer.findMany({
        where: {
          tournamentId: input.id,
        },
        orderBy: {
          result: "desc", // This sorts players by 'result' in descending order
        },
      });
      return { players: currentPlayers };
    }),
  updateTournamentDraw: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const currentPlayers = await prisma.customGame.findFirst({
        where: { id: input.id },
      });
      const find = await prisma.tournamentPlayer.findFirst({
        where: {
          walletAddress: currentPlayers.walletAddress,
        },
        orderBy: {
          createdAt: "desc", // Assuming you have a 'createdAt' field. Change this to your timestamp field's name if different.
        },
      });
      const update = await prisma.tournamentPlayer.update({
        where: {
          id: find.id,
        },
        data: {
          result: find.result + 1,
        },
      });
      const find2 = await prisma.tournamentPlayer.findFirst({
        where: {
          walletAddress: currentPlayers.walletAddress2,
        },
        orderBy: {
          createdAt: "desc", // Assuming you have a 'createdAt' field. Change this to your timestamp field's name if different.
        },
      });
      const update2 = await prisma.tournamentPlayer.update({
        where: {
          id: find2.id,
        },
        data: {
          result: find2.result + 1,
        },
      });
      return;
    }),
});
