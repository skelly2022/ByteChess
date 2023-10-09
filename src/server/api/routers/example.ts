import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "src/server/api/trpc";
import { prisma } from "src/server/db";
import axios from "axios";
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
      console.log(input);
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

  updateAvatar: publicProcedure
    .input(z.object({ address: z.string(), Image: z.string() }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.update({
        where: {
          walletAddress: input.address,
        },
        data: {
          avatar: input.Image, // Add the puzzle ID as a string to the completedPuzzles array
        },
      });
      return user;
    }),

  updateName: publicProcedure
    .input(z.object({ address: z.string(), Name: z.string() }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.update({
        where: {
          walletAddress: input.address,
        },
        data: {
          name: input.Name, // Add the puzzle ID as a string to the completedPuzzles array
        },
      });
      return user;
    }),

  getAllNfts: publicProcedure
    .input(z.object({ address: z.string() }))
    .mutation(async ({ input }) => {
      const url = `https://api-mainnet.magiceden.dev/v2/wallets/${input.address}/tokens`;
      const response = await axios.get(url, {
        headers: {
          accept: "application/json",
        },
      });

      console.log("Response:", response);
      //    if (response.data) {
      //    res.json(response.data);
      //    } else {
      //    res.status(204).send('No Content');
      //   }
      // } catch (error) {
      //     console.log('Error:', error);
      //   res.status(500).json({ error: error.toString() });
      //  }
      return response.data;
    }),
});
