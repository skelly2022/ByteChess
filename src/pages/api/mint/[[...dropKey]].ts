// /**
//  * Mint NFTs to a collection
//  *
//  * note: this endpoint should always return a response that supports the SolanaPay spec!
//  */

// import { debug } from "@/lib/utils/logs";
// import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
// import type { NextApiRequest, NextApiResponse } from "next";
// import { SOLANA_KEYPAIR } from "@/lib/solana/general";
// import { SolanaConnection } from "@/lib/solana/SolanaConnection";
// import { PublicKey } from "@solana/web3.js";
// import {
//   buildSolanaPayGetResponse,
//   buildSolanaPayPostResponse,
// } from "@/lib/solana/SolanaPay";
// import { buildMintCompressedNftTransaction } from "@/lib/solana/compression";
// import {
//   TokenProgramVersion,
//   TokenStandard,
//   MetadataArgs,
// } from "@metaplex-foundation/mpl-bubblegum";
// import {
//   COLLECTION_DETAILS,
//   GENERIC_METADATA_DEFAULTS,
//   STATIC_NFT_ITEMS,
// } from "@/lib/constants/drops";

// /**
//  * the SolanaPay spec only supports GET and POST requests
//  *
//  * For unwanted request methods, we will send an error JSON response,
//  * but one that still supports the SolanaPay GET spec so users will
//  * see some sort of error message in their wallet app
//  * (since it is unknown how wallets/clients will handle the headers)
//  */
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   try {

//   } catch (err) {
//   }

//   // always send a response to the client
//   // (one that should be parsable via the Solana Pay spec)
//   return res.status(400).json({
//     success: false,
//     ...buildSolanaPayGetResponse({
//       label: "Unknown mint. Expect a failure.",
//       message: "An error ocurred while locating the NFT to mint.",
//     }),
//   });
// }
