"use client";

import { AiOutlineMenu } from "react-icons/ai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Avatar from "../Avatar";
import MenuItem from "./MenuItem";
import useLoginModal from "src/hooks/useLoginModal";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-hot-toast";
import { api } from "src/utils/api";
import useUserStore from "src/hooks/useUserStore";

interface UserMenuProps {}

const UserMenu: React.FC<UserMenuProps> = () => {
  const user = useUserStore();
  const loginModal = useLoginModal();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const { select, wallets, publicKey, disconnect } = useWallet();

  const newUser = api.example.createUser.useMutation({
    async onSuccess(data) {
      user.setUser(data);
      const first5 = publicKey.toBase58().substring(0, 5);
      const last5 = publicKey.toBase58().slice(publicKey.toBase58().length - 5);
      toast.success(`${first5}...${last5} connected`);
      loginModal.setPk(`${first5}...${last5}`);
    },
  });
  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const puzzles = () => {
    router.push("/puzzles");
  };
  const connectWallet = async () => {
    loginModal.onOpen();
  };
  const disconnectWallet = async () => {
    toast.error("Wallet disconnected");
    user.setUser({
      id: "",
      walletAddress: "",
      puzzleRating: 1200,
      bulletRating: 1200,
      blitzRating: 1200,
      rapidRating: 1200,
      createdAt: "",
      completedPuzzles: [],
    });
    loginModal.setPk("");
    router.push("/");
  };
  useEffect(() => {
    if (publicKey !== null && loginModal.pk === "") {
      loginModal.onClose();
      const data = { address: publicKey.toBase58() };
      newUser.mutateAsync(data);
    }
  }, [publicKey]);

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={() => {
            puzzles();
          }}
          className=" cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-300  md:block "
        >
          Puzzles
        </div>
        {publicKey ? (
          <div
            className="cursor-pointer rounded-full bg-white px-4 py-2 text-sm"
            onClick={toggleOpen}
          >
            {loginModal.pk}
          </div>
        ) : (
          <div
            onClick={() => {
              connectWallet();
            }}
            className=" cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-300  md:block "
          >
            Connect Wallet
          </div>
        )}
      </div>
      {isOpen && (
        <div className="absolute right-0 top-12 w-[40vw] overflow-hidden rounded-xl bg-white text-sm shadow-md md:w-3/4">
          <div className="flex cursor-pointer flex-col text-black">
            <>
              {/* <MenuItem onClick={login} label="Login" /> */}
              <MenuItem
                onClick={() => {
                  disconnect(), toggleOpen();
                  disconnectWallet();
                }}
                label="Disconnect"
              />
            </>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
