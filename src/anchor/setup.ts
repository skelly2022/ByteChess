import { IdlAccounts, Program } from "@coral-xyz/anchor";
import { IDL, ChessProgram } from "../idl/idl";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

const programId = new PublicKey("HJPJwMey3UBiGHcXJ9M5kKef9LFNo8qhGT5TLLrTFsFt");
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export const program = new Program<ChessProgram>(IDL, programId, {
  connection,
});

export const [mintPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("mint")],
  program.programId,
);

export const [ChessProgramPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("tiny_adventure")],
  program.programId,
);

// export type ChessProgramData = IdlAccounts<ChessProgram>["ChessProgram"];
