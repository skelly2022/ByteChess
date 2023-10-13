//@ts-nocheck
import { useRouter } from "next/router";
import useUserModal from "~/hooks/useUserStore";
import ModalGame from "~/modals/InGameModals/ModalGame";
import usePlayModal from "~/hooks/usePlayModal";
import useTournamentModal from "~/hooks/useTournamentModal";
import useDrawModal from "~/hooks/InGameModals/useDrawModal";
import { useState, useEffect } from "react";
import socket from "~/helpers/socket";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

const ModalDraw = () => {
  const bodyContent = (
    <div className="flex flex-col   items-center justify-evenly  rounded-lg py-3 text-white ">
      <div className="mt-4 grid grid-cols-2 gap-4"></div>

      <div className="mt-4 grid grid-cols-1 gap-4"></div>
    </div>
  );

  const footerContent = <div className=" flex flex-col gap-4"></div>;

  return (
    <ModalGame
      //   disabled={isLoading}
      isOpen={ModalDraw.isOpen}
      title="Draw"
      actionLabel="Continue"
      onClose={ModalDraw.onClose}
      onSubmit={() => {}}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default ModalDraw;
