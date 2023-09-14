"use client";
import { useCallback, useEffect, useState } from "react";
import useLoginModal from "../hooks/useLoginModal";
import Modal from "./Modal";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { api } from "src/utils/api";
import useUserStore from "src/hooks/useUserStore";

const LoginModal = () => {
  const { select, wallets, publicKey, disconnect } = useWallet();
  const user = useUserStore();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const newUser = api.example.createUser.useMutation({
    async onSuccess(data) {
      user.setUser(data);
    },
  });

  const bodyContent = (
    <div className="flex h-[100px] items-center justify-center gap-8">
      {wallets.map((wallet) => {
        return (
          <Image
            key={wallet.adapter.name}
            src={wallet.adapter.icon}
            width={45}
            height={45}
            alt="wallet"
            className="cursor-pointer"
            onClick={() => select(wallet.adapter.name)}
          />
        );
      })}
    </div>
  );
  const footerContent = <div className=" flex flex-col gap-4"></div>;

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Sellect Wallet"
      actionLabel="Continue"
      onClose={loginModal.onClose}
      onSubmit={() => {}}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;
