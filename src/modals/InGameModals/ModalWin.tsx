//@ts-nocheck
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import useUserModal from "~/hooks/useUserStore";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";

import ModalGame from "~/modals/InGameModals/ModalGame";
import useWinModal from "~/hooks/InGameModals/useWinModal";
import useTournamentModal from "~/hooks/useTournamentModal";
import socket from "~/helpers/socket";
import { api } from "~/utils/api";

import socket2 from "~/helpers/socketMint";
import { connection, program } from "~/anchor/setup";
import { Transaction } from "@solana/web3.js";
import usePlayModal from "~/hooks/usePlayModal";

const UserWin = () => {
  const { sendTransaction } = useWallet();
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
  const handleClick = async () => {
    setLoading(true);
    const tx = new Transaction();
    try {
      const txSig = await sendTransaction(tx, connection);
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      setLoading(false);
      socket2.emit("mintGame", {
        wallet: session.data.user.name,
        fen: play.currentFen,
        moves: play.moves,
        wWallet: wWallet(),
        bWallet: bWallet(),
      });
    } catch (error) {}
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
