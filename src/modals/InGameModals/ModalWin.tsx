//@ts-nocheck

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import useUserModal from "~/hooks/useUserStore";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  MetadataArgs,
  TokenProgramVersion,
  TokenStandard,
  createMintV1Instruction,
} from "@metaplex-foundation/mpl-bubblegum";
import ModalGame from "~/modals/InGameModals/ModalGame";
import useWinModal from "~/hooks/InGameModals/useWinModal";
import useTournamentModal from "~/hooks/useTournamentModal";
import socket from "~/helpers/socket";
import { api } from "~/utils/api";
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  createAllocTreeIx,
  ValidDepthSizePair,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import {
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,

  createMintToCollectionV1Instruction,
} from "@metaplex-foundation/mpl-bubblegum";
import {
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  clusterApiUrl,
} from "@solana/web3.js";
import {
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,

} from "@metaplex-foundation/mpl-token-metadata";
import usePlayModal from "~/hooks/usePlayModal";

import { connection } from "~/anchor/setup";

const UserWin = () => {
  const treeCreator = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(process.env.NEXT_PUBLIC_TREE_CREATOR as string)),
  );
  console.log('help')
  const { sendTransaction, wallet, publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const WinModal = useWinModal();
  const session = useSession();
  const user = useUserModal();
  const tournamentStore = useTournamentModal();
  const play = usePlayModal();
  const router = useRouter();

  const [rematchState, setRematchState] = useState(play.rematchState);
  const [newGameLoading, setNewGameLoading] = useState(false);

  // DEFAULT, LOADING, OFFERED
  const { playID } = router.query;
  const data = api.mint.getURI.useMutation({
    async onSuccess(data) {
      console.log(data);
      try {
        const payer = publicKey;

        const creator: PublicKey = new PublicKey(
          "dKTV1dqiqwJ9gATrh1sdejiYi2VWKpVrntK5Vj2Yqtt",
        );
        const treeAddress: PublicKey = new PublicKey(
          "J3YBxHqCeTuZWs4DfjCG4d31eGs5zguEXMty2JvQSmvU",
        );
        const collectionMint: PublicKey = new PublicKey(
          "Bxvv8TkqQZkygX6yzAJ3RFGheWLh2LkrDYfW95zPA8zi",
        );
        const collectionMetadata: PublicKey = new PublicKey(
          "W63c27HNftiZ1uFXvQA2CXH3o3SBBwMevRfFrkgF4mq",
        );
        const collectionMasterEditionAccount: PublicKey = new PublicKey(
          "6xY8heWdsCeGTMKm7xVCL936wKks1azt9K37mfoh4Scs",
        );
        // create a new rpc connection, using the ReadApi wrapper

        const compressedNFTMetadata: MetadataArgs = {
          name: "Byte Chess",
          symbol: "BC",
          uri: data,
          creators: [
            {
              address: creator,
              verified: false,
              share: 100,
            },
          ],
          editionNonce: 0,
          uses: null,
          collection: null,
          primarySaleHappened: false,
          sellerFeeBasisPoints: 0,
          isMutable: false,
          tokenProgramVersion: TokenProgramVersion.Original,
          tokenStandard: TokenStandard.NonFungible,
        };

        const [treeAuthority] = PublicKey.findProgramAddressSync(
          [treeAddress.toBuffer()],
          BUBBLEGUM_PROGRAM_ID,
        );
        const [bubblegumSigner, _bump2] = PublicKey.findProgramAddressSync(
          // `collection_cpi` is a custom prefix required by the Bubblegum program
          [Buffer.from("collection_cpi", "utf8")],
          BUBBLEGUM_PROGRAM_ID,
        );
        const mintIxs: TransactionInstruction[] = [];
        const metadataArgs = Object.assign(compressedNFTMetadata, {
          collection: { key: collectionMint, verified: false },
        });
        mintIxs.push(
          createMintToCollectionV1Instruction(
            {
              payer: payer,

              merkleTree: treeAddress,
              treeAuthority,
              treeDelegate: creator,

              // set the receiver of the NFT
              leafOwner: payer,
              // set a delegated authority over this NFT
              leafDelegate: payer,
              collectionAuthority: creator,
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
        const latestBlockhash = await connection.getLatestBlockhash();

        const transaction = new Transaction({
          feePayer: payer,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        }).add(...mintIxs);

        transaction.sign(treeCreator);
        const txSig = await sendTransaction(transaction, connection);
      } catch (error) {
        console.log(error.message);
      }
    },
  });
  function getRandomColor(preferredColor: string) {
    if (preferredColor === "black") {
      return "white";
    } else {
      return "black";
    }
  }
  if (rematchState === "LOADING") {
    setRematchState("DEFAULT");
  }

  const newGame = api.games.newGame.useMutation({
    async onSuccess(data) {
      play.resetState();
      play.setRematch();
      setRematchState("DEFAULT");

      WinModal.onClose();
      socket.emit("rematchNewGame", { playID, gameID: data.id });
      router.push(`/play/${data.id}`);
    },
    onError(error) {
      console.log(error);
    },
  });
  const wWallet = () => {
    if (play.side === "white") {
      return user.user.walletAddress;
    } else {
      return play.opponent.walletAddress;
    }
  };

  const bWallet = () => {
    if (play === "black") {
      return user.user.walletAddress;
    } else {
      return play.opponent.walletAddress;
    }
  };
  function getGameType(timeControl) {
    // Split the string by the "+" sign
    const [minutes, increment] = timeControl.split("+").map(Number);

    if (minutes < 3) {
      return "Bullet";
    } else if (minutes < 10) {
      return "Blitz";
    } else {
      return "Rapid";
    }
  }
  const cancelRematch = () => {
    setRematchState("REMATCH");
    socket.emit("rematchDeclined", { playID });
  };
  const sendRematchOffer = () => {
    setRematchState("OFFERED");
    socket.emit("sendRematchOffer", { playID });
  };

  // Handle rematch acceptance
  const acceptRematch = () => {
    socket.emit("acceptRematch", { playID });
    setRematchState("LOADING");
    // Do any other logic required on rematch acceptance here
  };
  let newGameButtonContent;
  if (newGameLoading) {
    newGameButtonContent = (
      <button
        className="relative flex animate-pulse items-center bg-yellow px-6 py-3 text-green"
        onClick={() => {
          setNewGameLoading(false);
        }}
      >
        Finding Opponent
        <svg
          className="ml-1 mt-[1px] h-5 w-5 animate-spin text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="black"
            strokeWidth="2"
          ></circle>
          <path
            className="opacity-75"
            fill="black"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </button>
    );
  } else {
    newGameButtonContent = (
      <button
        className="bg-yellow px-6 py-3 text-green"
        onClick={() => {
          socket.emit("joinQ", {
            wallet: session.data.user.name,
            gameType: `${play.minutes.toString()} + ${play.increment}`,
          });
          setNewGameLoading(true);
          // TODO: Add the logic or function call to find a new opponent
        }}
      >
        New Opponent
      </button>
    );
  }
  let rematchButtonContent;
  switch (rematchState) {
    case "LOADING":
      rematchButtonContent = (
        <button
          className="relative flex items-center bg-yellow px-6 py-3 text-green"
          onClick={() => {
            cancelRematch();
          }}
        >
          Rematch Accepted
          <svg
            className="ml-1 mt-[1px] h-5 w-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="black"
              strokeWidth="2"
            ></circle>
            <path
              className="opacity-75"
              fill="black"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </button>
      );
      break;
    case "OFFERED":
      rematchButtonContent = (
        <button
          className="relative flex items-center bg-yellow px-6 py-3 text-green"
          // onClick={() => {
          //   sendRematchOffer();
          // }}
        >
          Rematch Sent
          <svg
            className="ml-1 mt-[1px] h-5 w-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="black"
              strokeWidth="2"
            ></circle>
            <path
              className="opacity-75"
              fill="black"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>{" "}
          <div
            className="absolute right-2 top-0"
            onClick={() => {
              cancelRematch();
            }}
          >
            X
          </div>
        </button>
      );
      break;

    case "OFFERDME":
      rematchButtonContent = (
        <div className="flex flex-col items-center gap-2 bg-yellow px-6 py-3 text-green">
          Rematch
          <div className="flex w-full items-center justify-center gap-2">
            <button
              className="rounded-lg bg-success px-1 py-2"
              onClick={() => {
                acceptRematch();
              }}
            >
              Yes
            </button>
            <button
              className="rounded-lg bg-error px-1 py-2"
              onClick={() => {
                socket.emit("rematchDeclined", { playID });
                setRematchState("");
              }}
            >
              No
            </button>
          </div>
        </div>
      );
      break;

    default:
      rematchButtonContent = (
        <button
          className="bg-yellow px-6 py-3 text-green"
          onClick={() => {
            sendRematchOffer();
          }}
        >
          Rematch
        </button>
      );
  }
  const time = getGameType(play.minutes + " + " + play.increment);
  function getRatingBasedOnGameType() {
    const gameType = time;

    let rating;
    switch (gameType) {
      case "Bullet":
        rating = (user.user.bulletRating + play.opponent.bulletRating) / 2;
        break;
      case "Blitz":
        rating = (user.user.blitzRating + play.opponent.blitzRating) / 2;
        break;
      case "Rapid":
        rating = (user.user.rapidRating + play.opponent.rapidRating) / 2;
        break;
      default:
        throw new Error("Invalid game type");
    }

    return rating.toString();
  }

  const handleClick = async () => {
    const CLUSTER_URL = process.env.RPC_URL ?? clusterApiUrl("devnet");
    const fen = play.currentFen;
    const moves = play.moves;
    const myWallet = wWallet();
    const oWallet = bWallet();
    const rating = getRatingBasedOnGameType();
    socket.emit("mint", { fen: fen }, (response) => {
      // Handle server's response here.
      console.log(response);
      const imgUri = response
        data.mutateAsync({ imgUri, moves, myWallet, oWallet, rating });

      // Now 'response' contains the 'x' value sent from the server.
      // You can use it as needed on the client-side.
    });
    console.log(moves);

    console.log(
      typeof fen,
      typeof moves,
      typeof myWallet,
      typeof oWallet,
      typeof rating,
    );
  };
  const bodyContent = (
    <div className="flex flex-col   items-center justify-evenly  bg-green  text-white ">
      <h1 className="text-4xl font-bold">Congratulations</h1>
      {time === "Bullet" && (
        <h2 className="text-2xl font-bold">
          Your New Rank: {user.user.bulletRating}
        </h2>
      )}
      {time === "Blitz" && (
        <h2 className="text-2xl font-bold">
          Your New Rank: {user.user.blitzRating}
        </h2>
      )}
      {time === "Rapid" && (
        <h2 className="text-2xl font-bold">
          Your New Rank: {user.user.rapidRating}
        </h2>
      )}
      <div className="mt-4 grid grid-cols-2 gap-4">
        {tournamentStore.tournamentID === "" && (
          <>
            {rematchButtonContent}
            {newGameButtonContent}
          </>
        )}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4">
        {loading ? (
          <button className="bg-yellow px-6 py-3 text-green">
            <svg
              className="ml-1  h-6 w-[115px] animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="black"
                strokeWidth="2"
              ></circle>
              <path
                className="opacity-75"
                fill="black"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>{" "}
          </button>
        ) : (
          <button
            className="bg-yellow px-6 py-3 text-green"
            onClick={() => {
              handleClick();
            }}
          >
            Mint your Game
          </button>
        )}
        <button
          className="bg-yellow px-6 py-3 text-green"
          onClick={() => {
            router.push(`/`);
            WinModal.onClose();
          }}
        >
          Return Home{" "}
        </button>
        {tournamentStore.tournamentID !== "" && (
          <button
            className="bg-yellow px-6 py-3 text-green"
            onClick={() => {
              router.push(`/tournaments/${tournamentStore.tournamentID}`);
              WinModal.onClose();
            }}
          >
            Return to Tournament{" "}
          </button>
        )}
      </div>
    </div>
  );

  useEffect(() => {
    // Listen for a received rematch offer
    const handleReceivedRematchOffer = () => {
      setRematchState("OFFERDME");
    };

    socket.on("receivedRematchOffer", handleReceivedRematchOffer);

    // Cleanup
    return () => {
      socket.off("receivedRematchOffer", handleReceivedRematchOffer);
    };
  }, []);
  useEffect(() => {
    // Listen for a received rematch offer

    socket.on("rematchGameID", (data) => {
      play.resetState();
      WinModal.onClose();
      setRematchState("DEFAULT");
      play.setRematch();

      router.push(`/play/${data}`);
    });

    // Cleanup
    return () => {
      socket.off("rematchGameID");
    };
  }, []);
  useEffect(() => {
    setRematchState(play.rematchState);
  }, [play.rematchState]);
  useEffect(() => {
    socket.on("matchedUp", (data) => {
      setNewGameLoading(false);
    });
    return () => {
      socket.off("matchedUp");
    };
  }, []);
  useEffect(() => {
    socket.on("matched", (roomData) => {
      setNewGameLoading(false);
    });

    return () => {
      socket.off("matched");
    };
  }, []);
  useEffect(() => {
    // Listen for a received rematch offer
    const handleReceivedRematchOffer = () => {
      setRematchState("OFFERDME");
    };

    socket.on("receivedRematchOffer", handleReceivedRematchOffer);

    // Cleanup
    return () => {
      socket.off("receivedRematchOffer", handleReceivedRematchOffer);
    };
  }, []);

  useEffect(() => {
    // Listen for rematch acceptance
    const handleRematchAccepted = () => {
      if (WinModal.isOpen) {
        const data = {
          address: session.data.user.name,
          mode: "Rated",
          time: play.minutes + " + " + play.increment,
          color: getRandomColor(play.side),
        };
        newGame.mutateAsync(data);
      }
      setRematchState("LOADING");
    };

    socket.on("rematchAccepted", handleRematchAccepted);

    // Cleanup
    return () => {
      socket.off("rematchAccepted", handleRematchAccepted);
    };
  }, [WinModal.isOpen]);

  useEffect(() => {
    // Listen for rematch declined
    const handleRematchDeclinedSend = () => {
      setRematchState("");
      // Do any other logic like routing or setting up the game here
    };

    socket.on("rematchDeclinedSend", handleRematchDeclinedSend);

    // Cleanup
    return () => {
      socket.off("rematchDeclinedSend", handleRematchDeclinedSend);
    };
  }, []);
  const footerContent = <div className=" flex flex-col gap-4"></div>;

  return (
    <ModalGame
      //   disabled={isLoading}
      isOpen={WinModal.isOpen}
      title="Win"
      actionLabel="Continue"
      onClose={WinModal.onClose}
      onSubmit={() => {}}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default UserWin;