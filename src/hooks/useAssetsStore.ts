import { Program } from "@coral-xyz/anchor";
// import {
//   PROGRAM_ID as METADATA_PROGRAM_ID,
//   Metadata,
// } from "@metaplex-foundation/mpl-token-metadata";
import { Keypair, PublicKey } from "@solana/web3.js";
import { ChessProgram } from "../idl/idl";
import { BN } from "@coral-xyz/anchor";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const getPoolAddress = (programId: PublicKey, address: PublicKey) =>
  PublicKey.findProgramAddressSync(
    [Buffer.from("level1", "utf8"), address.toBuffer()],
    programId,
  );

export const getAssets = async (
  program: Program<ChessProgram>,
  address: PublicKey,
): Promise<any> => {
  try {
    const poolAddress = await getPoolAddress(program.programId, address);
    // Do something with poolAddress
  } catch (error) {
    console.error("Error:", error);
  }
};
