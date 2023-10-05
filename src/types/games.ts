import { Prisma } from "@prisma/client";

// Define the User type
export type User = {
  id?: string;
  walletAddress: string;
  puzzleRating?: number;
  puzzleRatingChain?: number;
  bulletRating?: number;
  blitzRating?: number;
  rapidRating?: number;
  createdAt?: Date | string;
  puzzleCount?: number;
  completedPuzzles?: string[];
  ratedAccount?: boolean;
  name?: string;
  avatar?: string;
  wins?: number;
  draws?: number;
  losses?: number;
};

// Define the Puzzle type
export type Puzzle = Prisma.PuzzleCreateInput;

// Define the CustomGame type
export type CustomGame = Prisma.CustomGameCreateInput;

// Define the Tournament type
export type Tournament = Prisma.TournamentCreateInput;
export type TournamentPlayer = Prisma.TournamentPlayerCreateInput;

// Define the Profile type
export type Profile = Prisma.ProfileCreateInput;
