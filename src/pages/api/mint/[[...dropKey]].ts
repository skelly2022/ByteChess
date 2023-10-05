/**
 * Mint NFTs to a collection
 *
 * note: this endpoint should always return a response that supports the SolanaPay spec!
 */

import {
  MetadataArgs,
  TokenProgramVersion,
  TokenStandard,
} from "@metaplex-foundation/mpl-bubblegum";
import { PublicKey } from "@solana/web3.js";
import type { NextApiRequest, NextApiResponse } from "next";
import { loadKeypairFromFile, loadOrGenerateKeypair } from "~/helpers/helpers";
const COLLECTION_DETAILS = {
  collectionAddress: process.env.SOLANA_COLLECTION_ADDRESS,

  treeAddress: process.env.SOLANA_TREE_ADDRESS,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { account } = req.body;

    // const payer = process.env?.LOCAL_PAYER_JSON_ABSPATH
    //   ? loadKeypairFromFile(process.env?.LOCAL_PAYER_JSON_ABSPATH)
    //   : loadOrGenerateKeypair("payer");
    // const testWallet = process.env?.LOCAL_PAYER_JSON_ABSPATH
    //   ? loadKeypairFromFile(process.env?.LOCAL_PAYER_JSON_ABSPATH)
    //   : loadOrGenerateKeypair("testWallet");
    // const GENERIC_METADATA_DEFAULTS = {
    //   symbol: "BC",
    //   collection: {
    //     name: "ByteChess",
    //     family: "DevRel",
    //   },
    //   description: "google.com",
    //   isMutable: true,
    //   seller_fee_basis_points: 500,
    //   properties: {
    //     category: "image",
    //     creators: [
    //       {
    //         address: payer.publicKey,
    //         verified: false,
    //         share: 100,
    //       },
    //     ],
    //   },
    // };
    // const compressedNFTMetadata: MetadataArgs = {
    //   name: "Byte Chess CNFT",
    //   // @ts-ignore
    //   uri: nftToMint.metadataUri,
    //   symbol: GENERIC_METADATA_DEFAULTS.symbol,
    //   isMutable: GENERIC_METADATA_DEFAULTS.isMutable,
    //   // massage the creators array into a valid format
    //   creators: [],
    //   sellerFeeBasisPoints: GENERIC_METADATA_DEFAULTS.seller_fee_basis_points,
    //   collection: {
    //     key: new PublicKey(COLLECTION_DETAILS.collectionAddress),
    //     // note: when minting to collection v1, this nft will be auto verified
    //     // (when the tx is signed by the collection authority)
    //     verified: false,
    //   },
    //   uses: null,
    //   primarySaleHappened: true,
    //   editionNonce: null,
    //   tokenStandard: TokenStandard.NonFungible,
    //   tokenProgramVersion: TokenProgramVersion.Original,
    // };
  } catch (err) {}

  // always send a response to the client
  // (one that should be parsable via the Solana Pay spec)
  return res.status(400).json({
    success: false,
  });
}
