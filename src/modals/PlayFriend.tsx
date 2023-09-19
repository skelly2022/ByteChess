"use client";

import { useCallback, useEffect, useState } from "react";
import useLoginModal from "../hooks/useLoginModal";
import Modal from "./Modal";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import { api } from "src/utils/api";
import useUserStore from "src/hooks/useUserStore";
import usePlayModal from "src/hooks/usePlayModal";
import Dropdown from "react-dropdown";
import Assets from "../helpers/assets";
import "react-dropdown/style.css";
import Loading from "src/components/Loading";
import { useRouter } from "next/navigation";

const { whiteStyle, blackStyle, half } = Assets;

const options = ["Timed", "Unlimited"];
const LoginModal = () => {
  const user = useUserStore();
  const play = usePlayModal();
  const login = useLoginModal();
  const router = useRouter();
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [incrementCount, setIncrementCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState(options[0]); // Initialize selected option
  const [selectedMode, setSelectedMode] = useState("rated"); // Initialize selected option
  const { select, wallets, publicKey, disconnect } = useWallet();

  const [isLoading, setIsLoading] = useState(false);
  const newGame = api.games.newGame.useMutation({
    async onSuccess(data) {
      router.push(`/play/${data.id}`);
      play.onClose();
    },
  });

  function getRandomColor(preferredColor: string) {
    if (preferredColor === "white") {
      return "white";
    } else if (preferredColor === "black") {
      return "black";
    } else if (preferredColor === "wb" || !preferredColor) {
      // Generate a random number between 0 and 1
      const randomValue = Math.random();

      // Use the random number to determine the color
      if (randomValue < 0.5) {
        return "white";
      } else {
        return "black";
      }
    } else {
      throw new Error("Invalid color option");
    }
  }
  function handleChangeTime(event) {
    setCount(event.target.value);
  }
  function handleChangeSeconds(event) {
    setIncrementCount(event.target.value);
  }
  function createGame(color: string) {
    setLoading(true);
    if (selectedOption === "Unlimited") {
      const data = {
        address: publicKey.toBase58(),
        mode: selectedMode,
        time: "Unlimited",
        color: getRandomColor(color),
      };
      newGame.mutateAsync(data);
    } else {
      const data = {
        address: publicKey.toBase58(),
        mode: selectedMode,
        time: count.toString() + " + " + incrementCount.toString(),
        color: getRandomColor(color),
      };
      newGame.mutateAsync(data);
    }
  }
  const dropDownSelect = (selected) => {
    setSelectedOption(selected.value); // Update the selected option state
  };

  // useEffect(() => {
  //   //@ts-ignore
  //   if (user.user.walletAddress === "" && play.isOpen === true) {
  //     play.onClose();
  //     login.onOpen();
  //   }
  // }, [play]);
  const bodyContent = (
    <div className="flex h-[400px] w-full flex-col items-center justify-center gap-3">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex items-center justify-center gap-10 pb-2">
            <div className="w-auto"> Time control </div>
            <Dropdown
              options={options}
              onChange={(selected) => {
                dropDownSelect(selected); // Pass the selected value to the dropDownSelect function
              }}
              value={options[0]}
            />
          </div>
          {selectedOption === "Timed" && (
            <>
              <div className="flex w-full items-center justify-center">
                Minutes per side: {count}
              </div>
              <div className="w-3/4">
                <input
                  type="range"
                  id="slider"
                  className="w-full"
                  defaultValue={count}
                  onChange={handleChangeTime}
                  min="1"
                  max="15"
                  step="0.5"
                />
              </div>
              <div className="flex w-full items-center justify-center">
                Increment in seconds: {incrementCount}
              </div>
              <div className="w-3/4">
                <input
                  type="range"
                  id="slider2"
                  className="w-full"
                  defaultValue={incrementCount}
                  onChange={handleChangeSeconds}
                  min="0"
                  max="30"
                  step="1"
                />
              </div>
            </>
          )}
          <div className="flex w-full justify-center pt-1">
            <button
              className={` px-4 py-2 font-bold  shadow ${
                selectedMode === "casual"
                  ? "bg-success text-white"
                  : "bg-slate-50 text-black"
              }`}
              onClick={() => {
                setSelectedMode("casual");
              }}
            >
              {" "}
              Casual
            </button>
            <button
              className={` px-4 py-2 font-bold  shadow ${
                selectedMode === "rated"
                  ? "bg-success text-white"
                  : "bg-slate-50 text-black"
              }`}
              onClick={() => {
                setSelectedMode("rated");
              }}
            >
              {" "}
              Rated
            </button>
          </div>
          <div className="flex h-24 w-full items-end justify-center gap-4">
            <div className="flex h-[60px] w-[60px] items-center justify-center bg-slate-300 hover:scale-110">
              <div
                style={whiteStyle}
                onClick={() => {
                  createGame("white");
                }}
              ></div>
            </div>
            <div className="flex h-[80px] w-[80px] items-center justify-center bg-slate-300 hover:scale-110">
              <div
                style={half}
                onClick={() => {
                  createGame("black");
                }}
              ></div>
            </div>
            <div className="flex h-[60px] w-[60px] items-center justify-center bg-slate-300 hover:scale-110">
              <div
                style={blackStyle}
                onClick={() => {
                  createGame("black");
                }}
              ></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
  const footerContent = <div className=" flex flex-col gap-4"></div>;

  return (
    <Modal
      disabled={isLoading}
      isOpen={play.isOpen}
      title="Create a game"
      actionLabel="Continue"
      onClose={play.onClose}
      onSubmit={() => {}}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;
