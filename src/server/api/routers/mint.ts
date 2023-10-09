import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "src/server/api/trpc";
import { prisma } from "src/server/db";
import axios from "axios";

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

export const mintRouter = createTRPCRouter({
  getAllNftsProfile: publicProcedure
    .input(z.object({ address: z.string() }))
    .mutation(async ({ input }) => {
      const url = `https://devnet.helius-rpc.com/?api-key=2a0a1927-3fb2-4924-9701-23a098d4e383`;

      try {
        // Log input to ensure it's being received correctly
        console.log("Input Address:", input.address);

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
        console.log("Full Response:", response.data);

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
              "E4qNhhNBbH81ZRSVsQPwjcL5miXudafqeTFWSbs4UzNu"
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
            groupValue: "H7XHUcdG9z55xHTeid3TWDFRsvgqfcWqf3HmztVpr9mo",
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
});
