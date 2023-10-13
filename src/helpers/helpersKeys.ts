//@ts-nocheck
import { Chess } from "chess.js";
import { createCanvas, loadImage } from "canvas";
import { Connection, Keypair, clusterApiUrl } from "@solana/web3.js";
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
} from "@metaplex-foundation/js";

// Define the FEN notation
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

    // Apply the square's style
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
        `/images/pieces/${piece.color}${piece.type}.png`,
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
    const buffer = canvas.toDataURL().split(",")[1];
    const imgBuffer = Buffer.from(buffer, "base64");
    return imgBuffer;
  });
}
const main = async (fen, moves, myWallet, oWallet, rating) => {
  const imgBuffer = await drawChessboard(fen);
  const CONFIG = {
    uploadPath: "uploads/",
    imgFileName: "output.jpg",
    imgType: "image/jpg",
    imgName: "ByteChess cNFT",
    description: "https://www.bytechess.io",
    attributes: [
      {
        trait_type: "Moves",
        value: arrayToPGN(moves),
      },
      { trait_type: "myWallet", value: myWallet },
      { trait_type: "oWallet", value: oWallet },
      {
        trait_type: "Rank",
        value: rating,
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
};
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
// Call the drawChessboard function
export default main;

/*
  Locally save a demo data to the filesystem for later retrieval
*/
