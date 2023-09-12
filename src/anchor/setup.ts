import {
  Program,
  AnchorProvider,
  Idl,
  setProvider,
} from "@project-serum/anchor";
import { IDL, ChessProgram } from "../idl/idl";
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";

const programId = new PublicKey("2wkhhznqYKtLyUwu7oJho6u1RMCFLxyoR8zJoee5gkcN");
// const provider = new AnchorProvider(connection, wallet, {});

// setProvider(provider);
export const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const wallet = new NodeWallet(Keypair.generate());

// Create an Anchor provider
const provider = new AnchorProvider(connection, wallet, {});
setProvider(provider);
export const program = new Program(
  IDL as Idl,
  programId,
) as unknown as Program<ChessProgram>;

export const [mintPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("mint")],
  program.programId,
);

export const ChessProgramPDA = async (address: PublicKey) =>
  PublicKey.findProgramAddressSync(
    [Buffer.from("level1", "utf8"), address.toBuffer()],
    program.programId,
  );

export const [globalLevel1GameDataAccount] = PublicKey.findProgramAddressSync(
  [Buffer.from("level1", "utf8")],
  programId,
);
// export type ChessProgramData = IdlAccounts<ChessProgram>["ChessProgram"];
