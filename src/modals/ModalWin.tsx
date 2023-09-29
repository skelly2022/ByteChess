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
import ModalGame from "~/modals/ModalGame";
import useWinModal from "~/hooks/useWinModal";
import { Console } from "console";

const UserWin = () => {
  const WinModal = useWinModal();
  const user = useUserModal();

  const bodyContent = (
    <div className="flex flex-col justify-center gap-5 p-1 align-middle text-xl font-bold">
      <h1>Congratulations</h1>
      <h1>You wWOON</h1>
      <h1>Your New Rank {user.user.rank}</h1>
      <h1>You beat {user.user.name}</h1>
      <div className="grid gap-4 p-1">
        <button className="bg-yellow px-6 py-3 text-green">
          Mint your Game
        </button>
        <button className="bg-yellow px-6 py-3 text-green">Tweet It</button>
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
