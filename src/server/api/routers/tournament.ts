import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "src/server/api/trpc";
import { prisma } from "src/server/db";

export const tournamentRouter = createTRPCRouter({
  newTournament: publicProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.string(),
        date: z.date(),
        duration: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const newTournament = await prisma.tournament.create({
        data: {
          name: input.name,
          type: input.type,
          date: input.date,
          duration: input.duration,
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
});
