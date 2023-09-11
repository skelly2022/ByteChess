import { Puzzle, User } from "@prisma/client";

export type SafeUser = Omit<User, "createdAt"> & {
  walletAddress: string;
  createdAt: string;
  bulletRating: number;
  blitzRating: number;
  rapidRating: number;
  completedPuzzles: string[];
};
