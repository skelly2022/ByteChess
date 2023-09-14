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
});
