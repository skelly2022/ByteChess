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
import { GiHamburgerMenu } from "react-icons/gi";
import { signOut, useSession } from "next-auth/react";

interface UserMenuProps {}

const UserMenu: React.FC<UserMenuProps> = () => {
  const user = useUserStore();
  const loginModal = useLoginModal();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [hamOpen, setHamOpen] = useState(false);

  const { select, wallets, publicKey, disconnect } = useWallet();
  const { data: session, status } = useSession();

  // const newUser = api.example.createUser.useMutation({
  //   async onSuccess(data) {
  //     user.setUser(data);
  //     if (publicKey !== null) {
  //       const first5 = publicKey.toBase58().substring(0, 5);
  //       const last5 = publicKey
  //         .toBase58()
  //         .slice(publicKey.toBase58().length - 5);
  //       toast.success(`${first5}...${last5} connected`);
  //       loginModal.setPk(`${first5}...${last5}`);
  //       loginModal.onClose();
  //     }
  //   },
  // });
  function extractFirstAndLast5Characters(inputString) {
    if (typeof inputString !== "string" || inputString.length < 10) {
      return null; // Return null for invalid input
    }

    const first5 = inputString.substring(0, 5);
    const last5 = inputString.substring(inputString.length - 5);

    return `${first5}....${last5}`;
  }

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);
  const toggleHam = useCallback(() => {
    setHamOpen((value) => !value);
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

    signOut({ redirect: false }).then(() => {
      router.push("/"); // Redirect to the dashboard page after signing out
      loginModal.onClose();
    });
  };
  // useEffect(() => {
  //   //@ts-ignore

  //   if (publicKey !== null) {
  //     const data = { address: publicKey.toBase58() };
  //     newUser.mutateAsync(data);
  //   }
  // }, [publicKey]);

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div className="hidden items-center gap-3 md:flex">
          {" "}
          <div
            onClick={() => {
              puzzles();
            }}
            className=" bg-nav cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold
             text-black transition hover:bg-neutral-300  md:block "
          >
            Puzzles
          </div>
          <div
            onClick={() => {
              router.push("/leaderboard");
            }}
            className=" bg-nav cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-black
             transition hover:bg-neutral-300  md:block "
          >
            Leaderboard
          </div>
          {session ? (
            <div
              className="bg-nav cursor-pointer rounded-lg px-4 py-2 text-sm"
              onClick={toggleOpen}
            >
              {extractFirstAndLast5Characters(session.user.name)}
            </div>
          ) : (
            <div
              onClick={() => {
                connectWallet();
              }}
              className=" bg-nav cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-300  md:block "
            >
              Connect Wallet
            </div>
          )}
        </div>
        <div className="flex cursor-pointer md:hidden">
          <GiHamburgerMenu size={30} color="white" onClick={toggleHam} />
        </div>
      </div>
      {isOpen && (
        <div className="bg-nav absolute right-0 top-12 w-[40vw] overflow-hidden rounded-xl text-sm shadow-md md:w-3/4">
          <div className="flex cursor-pointer flex-col text-black">
            <>
              {/* <MenuItem onClick={login} label="Login" /> */}
              <MenuItem
                onClick={() => {
                  disconnectWallet();
                  toggleOpen();
                  disconnect();
                }}
                label="Disconnect"
              />
            </>
          </div>
        </div>
      )}
      {hamOpen && (
        <div className="bg-nav absolute right-0 top-12 w-[40vw] overflow-hidden rounded-xl text-sm shadow-md md:w-3/4">
          <div className="flex cursor-pointer flex-col text-center text-black">
            <>
              {/* <MenuItem onClick={login} label="Login" /> */}
              {publicKey ? (
                <div
                  className="bg-nav  cursor-pointer px-4 py-3 font-semibold transition hover:bg-neutral-300"
                  onClick={() => {
                    disconnect(), disconnectWallet();
                    toggleHam();
                  }}
                >
                  Disconnect
                </div>
              ) : (
                <MenuItem
                  onClick={() => {
                    connectWallet();
                    toggleHam();
                  }}
                  label="Connect Wallet"
                />
              )}

              <MenuItem
                onClick={() => {
                  router.push("/puzzles");
                  toggleHam();
                }}
                label="Puzzles"
              />
              <MenuItem
                onClick={() => {
                  router.push("/leaderboard");
                  toggleHam();
                }}
                label="Leaderboard"
              />
            </>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
