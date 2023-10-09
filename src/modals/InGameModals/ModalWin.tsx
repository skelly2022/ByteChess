//@ts-nocheck
import { useRouter } from "next/router";
import { useState } from "react";
import { useSession } from "next-auth/react";
import useUserModal from "~/hooks/useUserStore";
import { useWallet } from "@solana/wallet-adapter-react";

import ModalGame from "~/modals/InGameModals/ModalGame";
import useWinModal from "~/hooks/InGameModals/useWinModal";
import useTournamentModal from "~/hooks/useTournamentModal";
import socket2 from "~/helpers/socketMint";
import { connection, program } from "~/anchor/setup";
import { Transaction } from "@solana/web3.js";
import usePlayModal from "~/hooks/usePlayModal";

const UserWin = () => {
  const { publicKey, sendTransaction, signMessage } = useWallet();
  const [loading, setLoading] = useState(false);
  const WinModal = useWinModal();
  const session = useSession();
  const user = useUserModal();
  const tournamentStore = useTournamentModal();
  const play = usePlayModal();

  const router = useRouter();
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

      console.log(txSig);
    } catch (error) {
      console.log(error);
    }
  };
  const bodyContent = (
    <div className="flex flex-col items-center justify-center  text-white ">
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
        <button className="bg-yellow px-6 py-3 text-green">Rematch </button>
        <button className="bg-yellow px-6 py-3 text-green">New Opponent</button>
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
        <button className="bg-yellow px-6 py-3 text-green">Tweet It</button>
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
