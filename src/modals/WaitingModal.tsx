"use client";

import { useCallback, useEffect, useState } from "react";
import useLoginModal from "../hooks/useLoginModal";
import Modal from "./Modal";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import { api } from "src/utils/api";
import useUserStore from "src/hooks/useUserStore";
import Dropdown from "react-dropdown";
import Assets from "../helpers/assets";
import "react-dropdown/style.css";
import Loading from "src/components/Loading";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useWaitingModal from "~/hooks/InGameModals/useWaitingModal";
import WaitModalContainer from "./WaitModalContainer";


const WaitingModalComp = () => {
  const wait = useWaitingModal();

  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const copyLinkToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`https://www.bytechess.io/play/${wait.pk}`);
      toast.success("Link copied Succesfully!"); // Using react-hot-toast to give feedback
    } catch (err) {
      toast.error("Failed to copy the link.");
    }
  };

  const bodyContent = (
<div className="fixed inset-0 flex items-center justify-center z-50  ">
  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
    {/* Modal Header */}
    <div className="text-xl font-semibold mb-4">Invite a Friend</div>
    
    {/* Modal Content */}
    <div className="mb-4">
      <p className="text-gray-700">Share the game link with your friend to invite them:</p>
      <div className="flex items-center mt-2">
        <input
          type="text"
          value={`https://www.bytechess.io/play/${wait.pk}`}
          className="flex-grow px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-500"
          readOnly
        />
        <button
          onClick={copyLinkToClipboard}
          className="ml-2 px-4 py-2 bg-blue-500 text-black rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Copy
        </button>
      </div>
    </div>

  </div>
</div>
  );
  const footerContent = <div className=" flex flex-col gap-4"></div>;

  return (
    <WaitModalContainer
      disabled={isLoading}
      isOpen={wait.isOpen}
      title="INVITE YOUR FRIEND"
      actionLabel="Continue"
      onClose={wait.onClose}
      onSubmit={() => {}}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default WaitingModalComp;