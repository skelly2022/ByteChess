import { Prisma } from "@prisma/client";

// Define the User type

// Define the Puzzle type
export type Puzzle = Prisma.PuzzleCreateInput;
export type User = Prisma.UserCreateInput;

// Define the CustomGame type
export type CustomGame = Prisma.CustomGameCreateInput;

// Define the Tournament type
export type Tournament = Prisma.TournamentCreateInput;
export type TournamentPlayer = Prisma.TournamentPlayerCreateInput;

// Define the Profile type
export type Profile = Prisma.ProfileCreateInput;
