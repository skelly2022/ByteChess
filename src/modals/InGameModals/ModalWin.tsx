//@ts-nocheck
import { PrismaClient } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import useUserModal from "~/hooks/useUserStore";
import axios from "axios"; // Import the axios library
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import useLoginModal from "~/hooks/useLoginModal";
import ModalGame from "~/modals/InGameModals/ModalGame";
import useWinModal from "~/hooks/InGameModals/useWinModal";
import { Console } from "console";
import useTournamentModal from "~/hooks/useTournamentModal";

const UserWin = () => {
  const WinModal = useWinModal();
  const user = useUserModal();
  const tournamentStore = useTournamentModal();
  const router = useRouter();
  const handleClick = () => {};
  const bodyContent = (
    <div className="flex flex-col items-center justify-center gap-8 rounded-lg p-4 text-white shadow-lg">
      <h1 className="text-4xl font-bold">Congratulations</h1>
      <h2 className="text-2xl font-bold">
        Your New Rank: {user.user.bulletRating}
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <button className="bg-yellow px-6 py-3 text-green">Rematch </button>
        <button className="bg-yellow px-6 py-3 text-green">New Opponent</button>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4">
        <button className="bg-yellow px-6 py-3 text-green">
          Mint your Game
        </button>
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
