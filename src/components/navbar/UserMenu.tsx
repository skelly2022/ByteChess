"use client";
//@ts-nocheck
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import MenuItem from "./MenuItem";
import useLoginModal from "src/hooks/useLoginModal";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-hot-toast";
import useUserStore from "src/hooks/useUserStore";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiFillTrophy } from "react-icons/ai";
import { IoExtensionPuzzleSharp } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { MdLeaderboard } from "react-icons/md";

import { signOut, useSession } from "next-auth/react";
import useProfileModal from "~/hooks/useProfileModal";

interface UserMenuProps {}

const UserMenu: React.FC<UserMenuProps> = () => {
  const user = useUserStore();
  const loginModal = useLoginModal();
  const router = useRouter();
  const profileModal = useProfileModal();

  const [profile, showProfile] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [hamOpen, setHamOpen] = useState(false);

  const { select, wallets, publicKey, disconnect } = useWallet();
  const { data: session, status } = useSession();

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
  const tournaments = () => {
    router.push("/tournaments");
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
  const OpenProfile = async () => {
    profileModal.onOpen();
  };

  return (
    <div className="relative z-50">
      <div className="flex flex-row items-center gap-3">
        <div className="hidden items-center gap-3 md:flex">
          <div
            onClick={() => {
              tournaments();
            }}
            className=" cursor-pointer  items-center justify-center  border-2 border-yellow bg-green px-4 py-2 text-sm font-semibold  text-yellow
              transition  hover:border-black hover:text-black md:flex "
          >
            Tournaments <AiFillTrophy className="m-1" />
          </div>
          <div
            onClick={() => {
              puzzles();
            }}
            className=" cursor-pointer  items-center justify-center  border-2 border-yellow bg-green px-4 py-2 text-sm font-semibold text-yellow
              transition  hover:border-black hover:text-black md:flex "
          >
            Puzzles
            <IoExtensionPuzzleSharp className="m-1" />
          </div>

          {session ? (
            <div
              className="cursor-pointer  items-center 
              justify-center border-2 border-yellow 
              bg-green px-4 py-2 text-sm font-semibold text-black transition   hover:border-yellow hover:text-black md:flex "
              onClick={toggleOpen}
              style={{
                boxShadow: "-5px 5px black",
              }}
            >
              {extractFirstAndLast5Characters(session.user.name)}
            </div>
          ) : (
            <div
              onClick={() => {
                connectWallet();
              }}
              style={{
                boxShadow: "-5px 5px yellow",
              }}
              className=" m-1 cursor-pointer  items-center 
              justify-center border-2 border-yellow 
              px-4 py-2 text-sm font-semibold text-black transition    hover:border-yellow hover:text-black md:flex "
            >
              Connect Wallet
            </div>
          )}
        </div>
        <div className="flex cursor-pointer md:hidden ">
          <GiHamburgerMenu size={30} color="" onClick={toggleHam} />
        </div>
      </div>
      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-auto  bg-yellow  text-sm shadow-md ">
          <div className="flex w-full cursor-pointer flex-col text-black ">
            <div
              className=" cursor-pointer  items-center justify-center    bg-green px-4 py-2 text-sm font-semibold text-yellow
              transition  hover:border-black hover:text-black md:flex "
              onClick={() => {
                disconnectWallet();
                toggleOpen();
                disconnect();
              }}
            >
              Disconnect
              <CgProfile className="m-1" />
            </div>
            <div
              onClick={() => {
                OpenProfile();
              }}
              className=" cursor-pointer  items-center justify-center    bg-green px-4 py-2 text-sm font-semibold text-yellow
              transition  hover:border-black hover:text-black md:flex "
            >
              Profile
              <CgProfile className="m-1" />
            </div>
            <div
              onClick={() => {
                router.push("/leaderboard");
              }}
              className=" cursor-pointer  items-center  justify-center 
             bg-green px-4 py-2 text-sm font-semibold text-yellow 
             transition    hover:border-black hover:text-black md:flex "
            >
              Leaderboard <MdLeaderboard className="m-1" />
            </div>
          </div>
        </div>
      )}
      {hamOpen && (
        <div className=" z-190 absolute right-0 top-12 w-[40vw]  rounded-xl bg-white text-sm shadow-md md:hidden md:w-3/4">
          <div className="flex cursor-pointer flex-col text-center text-black">
            <>
              {/* <MenuItem onClick={login} label="Login" /> */}
              {session ? (
                <div
                  className="cursor-pointer  px-4 py-3 font-semibold transition  hover:border-black hover:bg-neutral-300 hover:text-black"
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
              {session ? (
                <MenuItem
                  onClick={() => {
                    OpenProfile();
                  }}
                  label="Profile"
                />
              ) : (
                <></>
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
                  router.push("/tournaments");
                  toggleHam();
                }}
                label="Tournaments"
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
