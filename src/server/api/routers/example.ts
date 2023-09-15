import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "src/server/api/trpc";
import { prisma } from "src/server/db";

export const exampleRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(z.object({ address: z.string() }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.findFirst({
        where: {
          walletAddress: input.address,
        },
      });
      if (user) {
        return user;
      } else {
        return prisma.user.create({
          data: {
            walletAddress: input.address,
          },
        });
      }
    }),
  updateUser: publicProcedure
    .input(z.object({ address: z.string() }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.update({
        where: {
          walletAddress: input.address,
        },
        data: {
          ratedAccount: true, // Add the puzzle ID as a string to the completedPuzzles array
        },
      });
      return user;
    }),
  getUser: publicProcedure
    .input(z.object({ address: z.string() }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.findFirst({
        where: {
          walletAddress: input.address,
        },
      });
      return user;
    }),
  getAllUsers: publicProcedure.mutation(async () => {
    const users = await prisma.user.findMany({});
    console.log(users);
    return users;
  }),
});
