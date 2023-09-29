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
  useEffect(() => {
    console.log(session);
    // if (session.status === "authenticated") {
    //   showProfile(true);
    //   console.log(session);
    //   console.log(session.data.user.name);
    // } else {
    //   showProfile(false);
    // }
  }, [session]);
  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div className="hidden items-center gap-3 md:flex">
          <div
            onClick={() => {
              tournaments();
            }}
            className=" cursor-pointer rounded-lg border border-yellow  px-4 py-2 text-sm font-semibold text-yellow
              transition md:block "
          >
            Tournaments
          </div>
          <div
            onClick={() => {
              puzzles();
            }}
            className=" cursor-pointer rounded-lg border border-yellow  px-4 py-2 text-sm font-semibold text-yellow
              transition md:block "
          >
            Puzzles
          </div>
          {session ? (
            <div
              onClick={() => {
                OpenProfile();
              }}
              className=" cursor-pointer rounded-lg border border-yellow  px-4 py-2 text-sm font-semibold text-yellow
              transition md:block "
            >
              Profile
            </div>
          ) : (
            <></>
          )}
          <div
            onClick={() => {
              router.push("/leaderboard");
            }}
            className=" cursor-pointer rounded-lg border  border-yellow px-4 
            py-2 text-sm font-semibold text-yellow 
             transition   md:block "
          >
            Leaderboard
          </div>
          {session ? (
            <div
              className="cursor-pointer rounded-lg border 
              border-yellow px-4 py-2 
              text-sm font-semibold text-yellow transition   md:block "
              onClick={toggleOpen}
            >
              {extractFirstAndLast5Characters(session.user.name)}
            </div>
          ) : (
            <div
              onClick={() => {
                connectWallet();
              }}
              className=" cursor-pointer rounded-lg border 
              border-yellow px-4 py-2 
              text-sm font-semibold text-yellow transition   md:block "
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
        <div className="absolute right-0 top-12 w-[40vw] overflow-hidden rounded-xl bg-nav text-sm shadow-md md:w-3/4">
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
        <div className=" absolute right-0 top-12 w-[40vw] overflow-hidden rounded-xl bg-white text-sm shadow-md md:hidden md:w-3/4">
          <div className="flex cursor-pointer flex-col text-center text-black">
            <>
              {/* <MenuItem onClick={login} label="Login" /> */}
              {publicKey ? (
                <div
                  className="cursor-pointer  bg-nav px-4 py-3 font-semibold transition hover:bg-neutral-300"
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
