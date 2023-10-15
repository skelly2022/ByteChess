import { z } from "zod";

import { Connection, Keypair, clusterApiUrl } from "@solana/web3.js";
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
} from "@metaplex-foundation/js";
import { createTRPCRouter, publicProcedure } from "src/server/api/trpc";
import { prisma } from "src/server/db";
import axios from "axios";

const QUICKNODE_RPC = process.env.RPC_URL ?? clusterApiUrl("devnet");
const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC);

const WALLET = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(process.env.NEXT_PUBLIC_TREE_CREATOR as string)),
);
const METAPLEX = Metaplex.make(SOLANA_CONNECTION)
  .use(keypairIdentity(WALLET))
  .use(
    bundlrStorage({
      address: "https://devnet.bundlr.network",
      providerUrl: QUICKNODE_RPC,
      timeout: 60000,
    }),
  );

async function appendLikesToAssets(assets, userAddress) {
  return Promise.all(
    assets.map(async (asset) => {
      const existingMint = await prisma.mint.findUnique({
        where: {
          img: asset.image,
        },
      });

      const likesCount = existingMint ? existingMint.likes : 0;
      const isLiked = existingMint
        ? existingMint.usersLiked.includes(userAddress)
        : false;

      return { ...asset, likes: likesCount, isLiked: isLiked };
    }),
  );
}

function arrayToPGN(moves) {
  let pgn = "";
  for (let i = 0; i < moves.length; i += 2) {
    const moveNumber = i / 2 + 1; // Move numbers start from 1
    pgn += `${moveNumber}. ${moves[i]} `;

    // Add the black move if it exists (there might not always be a pair)
    if (i + 1 < moves.length) {
      pgn += `${moves[i + 1]} `;
    }
  }

  return pgn.trim(); // Remove any trailing space
}

async function uploadMetadata(
  imgUri: string,
  imgType: string,
  nftName: string,
  description: string,
  //@ts-ignore
  attributes: { trait_type: string; value: Array }[],
) {
  console.log(`Step 2 - Uploading Metadata`);
  const { uri } = await METAPLEX.nfts().uploadMetadata({
    name: nftName,
    description: description,
    image: imgUri,
    attributes: attributes,
    properties: {
      files: [
        {
          type: imgType,
          uri: imgUri,
        },
      ],
    },
  });
  console.log("   Metadata URI:", uri);
  return uri;
}

export const mintRouter = createTRPCRouter({
  getAllNftsProfile: publicProcedure
    .input(z.object({ address: z.string() }))
    .mutation(async ({ input }) => {
      const url = `https://devnet.helius-rpc.com/?api-key=${process.env.RPC_KEY}`;

      try {
        // Log input to ensure it's being received correctly

        const response = await axios.post(url, {
          jsonrpc: "2.0",
          id: "my-id",
          method: "getAssetsByOwner",
          params: {
            ownerAddress: input.address, // Use the dynamic address from the input
            page: 1,
            limit: 1000,
          },
        });

        // Log the full response to ensure it's structured as expected

        // Check if response.data.result.items is defined and not empty
        if (
          !response.data.result.items ||
          response.data.result.items.length === 0
        ) {
          console.warn("No items found in the response.");
          return [];
        }

        // Filter assets based on the compression's tree address
        const filteredAssets = response.data.result.items.filter((asset) => {
          return (
            asset.compression &&
            asset.compression.tree ===
              "AsvQToP6iTK7XKXcaZKd2hkxY9n5f8HojbujvJSVn625"
          );
        });

        // Check if filteredAssets is empty
        if (filteredAssets.length === 0) {
          console.warn("No filtered assets found.");
          return [];
        }

        // Array to hold all the promises from fetch operations
        const fetchPromises = filteredAssets.map((asset) => {
          return fetch(asset.content.json_uri)
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .catch((error) => {
              console.error(
                "There was a problem with the fetch operation:",
                error.message,
              );
              return null; // or you can return an empty object {} based on your needs
            });
        });

        // Wait for all promises to complete
        const allGames = await Promise.all(fetchPromises);

        // Filter out any null values (from failed fetch operations, if any)
        const validGames = allGames.filter((game) => game !== null);
        const validGamesWithLikes = await appendLikesToAssets(
          validGames,
          input.address,
        );
        return validGamesWithLikes;
      } catch (error) {
        console.error("Error in getAllNftsProfile:", error);
        throw error; // Forward the error to tRPC so it's handled correctly
      }
    }),

  getAllNfts: publicProcedure
    .input(z.object({ address: z.string() }))
    .mutation(async ({ input }) => {
      const url = `https://devnet.helius-rpc.com/?api-key=${process.env.RPC_KEY}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "my-id",
          method: "getAssetsByGroup",
          params: {
            groupKey: "collection",
            groupValue: "A8fMfD6b3EB7bjjwcYuyxQDWgD4UKP1DJDZPj6rbsQkR",
            page: 1, // Starts at 1
            limit: 1000,
          },
        }),
      });
      const { result } = await response.json();

      // Array to hold all the promises from fetch operations
      const fetchPromises = result.items.map((asset) => {
        return fetch(asset.content.json_uri)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .catch((error) => {
            console.error(
              "There was a problem with the fetch operation:",
              error.message,
            );
            return null; // or you can return an empty object {} based on your needs
          });
      });

      // Wait for all promises to complete
      const allNfts = await Promise.all(fetchPromises);

      // Filter out any null values (from failed fetch operations, if any)
      const validNfts = allNfts.filter((nft) => nft !== null);

      const validNftsWithLikes = await appendLikesToAssets(
        validNfts,
        input.address,
      );
      return validNftsWithLikes;
    }),
  addLike: publicProcedure
    .input(z.object({ img: z.string(), address: z.string() }))
    .mutation(async ({ input }) => {
      const imageUrl = input.img;
      const userAddress = input.address;

      try {
        // Find an existing record with the provided img URL
        const existingMint = await prisma.mint.findUnique({
          where: {
            img: imageUrl,
          },
        });

        // If a record exists
        if (existingMint) {
          // Check if user has already liked the image
          if (existingMint.usersLiked.includes(userAddress)) {
            // User has already liked, so we will remove the like
            return await prisma.mint.update({
              where: {
                img: imageUrl,
              },
              data: {
                likes: existingMint.likes - 1, // decrease the like count
                usersLiked: {
                  set: existingMint.usersLiked.filter(
                    (address) => address !== userAddress,
                  ), // remove user's address from the usersLiked array
                },
              },
            });
          } else {
            // If user hasn't liked the image yet, increase the like count and add user's address to usersLiked
            return await prisma.mint.update({
              where: {
                img: imageUrl,
              },
              data: {
                likes: existingMint.likes + 1,
                usersLiked: {
                  push: userAddress,
                },
              },
            });
          }
        } else {
          // If a record doesn't exist, create a new one with likes set to 1 and add the user's address to usersLiked
          return await prisma.mint.create({
            data: {
              img: imageUrl,
              likes: 1,
              usersLiked: [userAddress], // Initial array with the user's address
            },
          });
        }
      } catch (error) {
        console.error("Error in addLike:", error);
        throw error; // Forward the error to tRPC so it's handled correctly
      }
    }),
  getLikes: publicProcedure
    .input(z.object({ img: z.string() }))
    .mutation(async ({ input }) => {
      const imageUrl = input.img;
      const existingMint = await prisma.mint.findUnique({
        where: {
          img: imageUrl,
        },
      });
      return existingMint;
    }),
  getURI: publicProcedure
    .input(
      z.object({
        imgUri: z.string(),
        moves: z.array(z.string()),
        myWallet: z.string(),
        oWallet: z.string(),
        rating: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const CONFIG = {
        uploadPath: "uploads/",
        imgFileName: "output.jpg",
        imgType: "image/jpg",
        imgName: "ByteChess cNFT",
        description: "https://www.bytechess.io",
        attributes: [
          {
            trait_type: "Moves",
            value: arrayToPGN(input.moves),
          },
          { trait_type: "White", value: input.myWallet },
          { trait_type: "Black", value: input.oWallet },
          {
            trait_type: "Rank",
            value: input.rating,
          },
        ],
        sellerFeeBasisPoints: 500, //500 bp = 5%
        symbol: "BC",
        creators: [{ address: WALLET.publicKey, share: 100 }],
      };
      const metadataUri = await uploadMetadata(
        input.imgUri,
        CONFIG.imgType,
        CONFIG.imgName,
        CONFIG.description,
        CONFIG.attributes,
      );

      return metadataUri;
    }),
});
