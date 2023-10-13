import { z } from "zod";
import { Chess } from "chess.js";
import { createCanvas, Image } from "canvas";
import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
} from "@metaplex-foundation/js";
import { createTRPCRouter, publicProcedure } from "src/server/api/trpc";
import { prisma } from "src/server/db";
import axios from "axios";
import path from "path";
import fs from "fs";

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

// Array of all squares on the board
const array = [
  "a8",
  "b8",
  "c8",
  "d8",
  "e8",
  "f8",
  "g8",
  "h8",
  "a7",
  "b7",
  "c7",
  "d7",
  "e7",
  "f7",
  "g7",
  "h7",
  "a6",
  "b6",
  "c6",
  "d6",
  "e6",
  "f6",
  "g6",
  "h6",
  "a5",
  "b5",
  "c5",
  "d5",
  "e5",
  "f5",
  "g5",
  "h5",
  "a4",
  "b4",
  "c4",
  "d4",
  "e4",
  "f4",
  "g4",
  "h4",
  "a3",
  "b3",
  "c3",
  "d3",
  "e3",
  "f3",
  "g3",
  "h3",
  "a2",
  "b2",
  "c2",
  "d2",
  "e2",
  "f2",
  "g2",
  "h2",
  "a1",
  "b1",
  "c1",
  "d1",
  "e1",
  "f1",
  "g1",
  "h1",
];
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
async function loadImage(filename) {
  const imagePath = path.join(process.cwd(), "public", filename);
  const imageBuffer = fs.readFileSync(imagePath);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = `data:image/png;base64,${imageBuffer.toString("base64")}`;
  });
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

async function drawChessboard(fen) {
  // Create a new chess instance and load the FEN
  const chess = new Chess();
  chess.load(fen);

  // Create a canvas to draw the chessboard
  const canvas = createCanvas(400, 400);
  const ctx = canvas.getContext("2d");

  // Define the square size
  const squareSize = canvas.width / 8;

  // Define custom dark and light square styles
  const customDarkSquareStyle = { backgroundColor: "#1D5951" };
  const customLightSquareStyle = { backgroundColor: "#FFDC26" };

  // Iterate through the squares and draw the chessboard grid and pieces
  for (const square of array) {
    const [file, rank] = square.split("");

    // Determine the square's style based on its position
    const squareStyle =
      (file.charCodeAt(0) - "a".charCodeAt(0) + parseInt(rank, 10)) % 2 === 0
        ? customLightSquareStyle
        : customDarkSquareStyle;

    ctx.fillStyle = squareStyle.backgroundColor;
    ctx.fillRect(
      (file.charCodeAt(0) - "a".charCodeAt(0)) * squareSize,
      (8 - parseInt(rank, 10)) * squareSize,
      squareSize,
      squareSize,
    );

    const piece = chess.get(square);

    if (piece !== null && piece.type && piece.color) {
      const image = await loadImage(
        `images/pieces/${piece.color}${piece.type}.png`,
      );

      ctx.drawImage(
        image,
        (file.charCodeAt(0) - "a".charCodeAt(0)) * squareSize,
        (8 - parseInt(rank, 10)) * squareSize,
        squareSize,
        squareSize,
      );
    }
  }

  // Save the canvas as a JPEG image
  return new Promise((resolve, reject) => {
    canvas.toBuffer((err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
}

async function uploadMetadata(
  imgUri: string,
  imgType: string,
  nftName: string,
  description: string,
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
async function uploadImageBuffer(
  buffer: Buffer,
  fileName: string,
): Promise<string> {
  console.log(`Step 1 - Uploading Image`);
  const imgMetaplexFile = toMetaplexFile(buffer, fileName);
  const imgUri = await METAPLEX.storage().upload(imgMetaplexFile);
  console.log(`   Image URI:`, imgUri);
  return imgUri;
}
export const mintRouter = createTRPCRouter({
  getAllNftsProfile: publicProcedure
    .input(z.object({ address: z.string() }))
    .mutation(async ({ input }) => {
      const url = `https://devnet.helius-rpc.com/?api-key=2a0a1927-3fb2-4924-9701-23a098d4e383`;

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
              "J3YBxHqCeTuZWs4DfjCG4d31eGs5zguEXMty2JvQSmvU"
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
      const url =
        "https://devnet.helius-rpc.com/?api-key=2a0a1927-3fb2-4924-9701-23a098d4e383";
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
            groupValue: "Bxvv8TkqQZkygX6yzAJ3RFGheWLh2LkrDYfW95zPA8zi",
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
        fen: z.string(),
        moves: z.array(z.string()),
        myWallet: z.string(),
        oWallet: z.string(),
        rating: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const imgBuffer = await drawChessboard(input.fen);
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
          { trait_type: "myWallet", value: input.myWallet },
          { trait_type: "oWallet", value: input.oWallet },
          {
            trait_type: "Rank",
            value: input.rating,
          },
        ],
        sellerFeeBasisPoints: 500, //500 bp = 5%
        symbol: "BC",
        creators: [{ address: WALLET.publicKey, share: 100 }],
      };
      const imgUri = await uploadImageBuffer(imgBuffer, CONFIG.imgFileName);
      const metadataUri = await uploadMetadata(
        imgUri,
        CONFIG.imgType,
        CONFIG.imgName,
        CONFIG.description,
        CONFIG.attributes,
      );

      return metadataUri;
    }),
});
