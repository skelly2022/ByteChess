import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "src/server/api/trpc";
import { prisma } from "src/server/db";
import axios from "axios";
export const mintRouter = createTRPCRouter({
  mint: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {}),
});
