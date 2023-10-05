import {
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  Connection,
  TransactionInstruction,
} from "@solana/web3.js";
import { program, connection } from "../anchor/setup";

import {
  createAccount,
  createMint,
  mintTo,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  createAllocTreeIx,
  ValidDepthSizePair,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import {
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
  MetadataArgs,
  computeCreatorHash,
  computeDataHash,
  createCreateTreeInstruction,
  createMintToCollectionV1Instruction,
} from "@metaplex-foundation/mpl-bubblegum";
import {
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
  CreateMetadataAccountArgsV3,
  createCreateMetadataAccountV3Instruction,
  createCreateMasterEditionV3Instruction,
  createSetCollectionSizeInstruction,
} from "@metaplex-foundation/mpl-token-metadata";
import { useWallet } from "@solana/wallet-adapter-react";

// import local helper functions
// import { explorerURL, extractSignatureFromFailedTransaction } from "@/utils/helpers";

/*
  Helper function to create a merkle tree on chain, including allocating 
  all the space required to store all the nodes
*/
const { connected, publicKey, sendTransaction } = useWallet();
export async function mintCompressedNFT(
  connection: Connection,
  payer: Keypair,
  treeAddress: PublicKey,
  collectionMint: PublicKey,
  collectionMetadata: PublicKey,
  collectionMasterEditionAccount: PublicKey,
  compressedNFTMetadata: MetadataArgs,
  receiverAddress?: PublicKey,
) {
  // derive the tree's authority (PDA), owned by Bubblegum
  const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
    [treeAddress.toBuffer()],
    BUBBLEGUM_PROGRAM_ID,
  );

  // derive a PDA (owned by Bubblegum) to act as the signer of the compressed minting
  const [bubblegumSigner, _bump2] = PublicKey.findProgramAddressSync(
    // `collection_cpi` is a custom prefix required by the Bubblegum program
    [Buffer.from("collection_cpi", "utf8")],
    BUBBLEGUM_PROGRAM_ID,
  );

  // create an array of instruction, to mint multiple compressed NFTs at once
  const mintIxs: TransactionInstruction[] = [];

  /**
   * correctly format the metadata args for the nft to mint
   * ---
   * note: minting an nft into a collection (via `createMintToCollectionV1Instruction`)
   * will auto verify the collection. But, the `collection.verified` value inside the
   * `metadataArgs` must be set to `false` in order for the instruction to succeed
   */
  const metadataArgs = Object.assign(compressedNFTMetadata, {
    collection: { key: collectionMint, verified: false },
  });

  /**
   * compute the data and creator hash for display in the console
   *
   * note: this is not required to do in order to mint new compressed nfts
   * (since it is performed on chain via the Bubblegum program)
   * this is only for demonstration
   */
  const computedDataHash = new PublicKey(
    computeDataHash(metadataArgs),
  ).toBase58();
  const computedCreatorHash = new PublicKey(
    computeCreatorHash(metadataArgs.creators),
  ).toBase58();
  console.log("computedDataHash:", computedDataHash);
  console.log("computedCreatorHash:", computedCreatorHash);

  /*
    Add a single mint to collection instruction 
    ---
    But you could all multiple in the same transaction, as long as your 
    transaction is still within the byte size limits
  */
  mintIxs.push(
    createMintToCollectionV1Instruction(
      {
        payer: receiverAddress,

        merkleTree: treeAddress,
        treeAuthority,
        treeDelegate: payer.publicKey,

        // set the receiver of the NFT
        leafOwner: receiverAddress || payer.publicKey,
        // set a delegated authority over this NFT
        leafDelegate: payer.publicKey,

        /*
            You can set any delegate address at mint, otherwise should 
            normally be the same as `leafOwner`
            NOTE: the delegate will be auto cleared upon NFT transfer
            ---
            in this case, we are setting the payer as the delegate
          */

        // collection details
        collectionAuthority: payer.publicKey,
        collectionAuthorityRecordPda: BUBBLEGUM_PROGRAM_ID,
        collectionMint: collectionMint,
        collectionMetadata: collectionMetadata,
        editionAccount: collectionMasterEditionAccount,

        // other accounts
        compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
        logWrapper: SPL_NOOP_PROGRAM_ID,
        bubblegumSigner: bubblegumSigner,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      },
      {
        metadataArgs,
      },
    ),
  );

  try {
    // construct the transaction with our instructions, making the `payer` the `feePayer`
    const tx = new Transaction().add(...mintIxs);
    tx.feePayer = receiverAddress;

    // send the transaction to the cluster
    const txSignature = await sendAndConfirmTransaction(
      connection,
      tx,
      [payer],
      {
        commitment: "confirmed",
        skipPreflight: true,
      },
    );

    console.log("\nSuccessfully minted the compressed NFT!");
    // console.log(explorerURL({ txSignature }));

    return txSignature;
  } catch (err) {
    console.error("\nFailed to mint compressed NFT:", err);

    // log a block explorer link for the failed transaction
    // await extractSignatureFromFailedTransaction(connection, err);

    throw err;
  }
}
