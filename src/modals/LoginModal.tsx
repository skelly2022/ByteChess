"use client";
import { useCallback, useEffect, useState } from "react";
import useLoginModal from "../hooks/useLoginModal";
import Modal from "./Modal";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { api } from "src/utils/api";
import useUserStore from "src/hooks/useUserStore";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { SigninMessage } from "~/utils/SigninMessage";
import bs58 from "bs58";

const LoginModal = () => {
  const { data: session, status } = useSession();

  const { select, wallets, publicKey, disconnect } = useWallet();
  const user = useUserStore();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const wallet = useWallet();

  const newUser = api.example.createUser.useMutation({
    async onSuccess(data) {
      user.setUser(data);
    },
  });
  const sign = (name) => {
    console.log(name);
    if (wallet.connected === false) {
      select(name);
    } else {
      handleSignIn();
    }
  };

  const handleSignIn = async () => {
    try {
      if (!wallet.connected) {
        // walletModal.setVisible(true);
      }

      const csrf = await getCsrfToken();
      // if (!wallet.publicKey || !csrf || !wallet.signMessage) return;

      const message = new SigninMessage({
        domain: window.location.host,
        publicKey: wallet.publicKey?.toBase58(),
        statement: `Sign this message to sign in to the app.`,
        nonce: csrf,
      });

      const data = new TextEncoder().encode(message.prepare());
      const signature = await wallet.signMessage(data);
      const serializedSignature = bs58.encode(signature);

      signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature: serializedSignature,
      });
      loginModal.onClose();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (wallet.connected && status === "unauthenticated") {
      handleSignIn();
    }
  }, [wallet.connected]);

  useEffect(() => {
    console.log(wallet.connected);
    console.log(publicKey);
  }, []);
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
            onClick={() => sign(wallet.adapter.name)}
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
