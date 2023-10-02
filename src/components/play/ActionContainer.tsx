//@ts-nocheck

import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsFlag } from "react-icons/bs";
import { useRouter } from "next/router";
import socket from "~/helpers/socket";
import { api } from "~/utils/api";
import useUserModal from "~/hooks/useUserStore";
import usePlayModal from "~/hooks/usePlayModal";
import styles from "../styles/Animations.module.css";
import useWinModal from "~/hooks/InGameModals/useWinModal";
import useLossModal from "~/hooks/InGameModals/useLossModal";
import useDrawModal from "~/hooks/InGameModals/useDrawModal";

const ActionContainer = () => {
  const router = useRouter();
  const { playID } = router.query;
  const user = useUserModal();
  const play = usePlayModal();
  const [showClose, setShowClose] = useState(false);
  const [showHalf, setShowHalf] = useState(false);
  const [showFlag, setShowFlag] = useState(false);
  const [activeIcon, setActiveIcon] = useState(null);
  const [drawRequested, setDrawRequested] = useState(false);
  const [gameResigned, setGameResigned] = useState(false);
  const WinModal = useWinModal();
  const LossModal = useLossModal();
  const DrawModal = useDrawModal();

  const icons = [
    {
      icon: (
        <AiOutlineClose
          size={30}
          className={`mt-2 cursor-pointer text-black`}
        />
      ),
      text: "Close button clicked.",
    },
    {
      icon: <h1 className="text-4xl">½</h1>,
      text: (
        <div className="flex h-full w-full scale-150 items-center rounded-md px-2">
          <h1>Draw Offer Sent</h1>
          <svg
            className="ml-1 mt-[1px]  h-3 w-3 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="gray"
              stroke-width="2"
            ></circle>
            <path
              className="opacity-75"
              fill="gray"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>{" "}
        </div>
      ),
    },
    {
      icon: <BsFlag size={25} className="mt-2 cursor-pointer text-black" />,
      text: <></>,
    },
  ];
  const updateWin = api.games.updateGameWin.useMutation({
    async onSuccess(result) {
      console.log(result);
      user.setUser(result.loserRating);
      play.setOpponent(result.rating);
      socket.emit("checkmate", {
        roomId: playID,
        loser: result.loserRating,
        winner: result.rating,
      });
    },
  });
  const updateDraw = api.games.updateGameDraw.useMutation({
    async onSuccess(result) {
      console.log(result);
      user.setUser(result.loserRating);
      play.setOpponent(result.rating);
      DrawModal.onOpen();
      socket.emit("drawAccept", {
        roomId: playID,
        loser: result.loserRating,
        winner: result.rating,
      });
    },
  });
  const handleIconClick = (index) => {
    setActiveIcon(index);
    if (activeIcon === index) {
      setShowHalf(true);
      if (index === 1) {
        socket.emit("drawRequest", { roomId: playID });
      }
      if (index === 2) {
        setGameResigned(true);
        socket.emit("resignGame", { roomId: playID });
        updateWin.mutateAsync({
          winnerAddress: play.opponent.walletAddress,
          wElo: play.opponent.bulletRating,
          lElo: user.user.bulletRating,
          loserAddress: user.user.walletAddress,
        });
        LossModal.onOpen();
      }
    }
  };
  const resetActiveIcon = () => {
    if (activeIcon === 1 && showHalf === true) {
      socket.emit("drawDecline", { roomId: playID });
    }
    setDrawRequested(false);
    setActiveIcon(null);
    setShowHalf(false);
    setShowFlag(false);
    setShowClose(false);
  };

  const declineDraw = () => {
    resetActiveIcon();
    socket.emit("drawDecline", { roomId: playID });
  };
  const acceptDraw = () => {
    resetActiveIcon();
    setGameResigned(true);
    updateDraw.mutateAsync({
      winnerAddress: play.opponent.walletAddress,
      wElo: play.opponent.bulletRating,
      lElo: user.user.bulletRating,
      loserAddress: user.user.walletAddress,
    });
    DrawModal.onOpen();
  };
  useEffect(() => {
    socket.on("drawRequested", (data) => {
      console.log("drawRequested");
      setDrawRequested(true);
    });
    socket.on("drawDeclined", (data) => {
      resetActiveIcon();
    });
    socket.on("gameResigned", (data) => {
      resetActiveIcon();
      setGameResigned(true);
      WinModal.onOpen();
    });
    socket.on("checkmated", (data) => {
      play.setOpponent(data.loser);
      user.setUser(data.winner);
    });
    socket.on("drawAccepted", (data) => {
      resetActiveIcon();
      console.log(data);
      DrawModal.onOpen();
      setGameResigned(true);
      play.setOpponent(data.loser);
      user.setUser(data.winner);
    });
  }, []);
  return (
    <div className="relative w-full cursor-pointer">
      {drawRequested === false && gameResigned === false && (
        <div className=" flex h-12 w-full items-center justify-center gap-10  text-black">
          {icons.map((item, index) => (
            <div
              key={index}
              className={`${
                activeIcon !== null && activeIcon !== index
                  ? "hidden"
                  : "flex w-auto items-center justify-center  px-2   text-center text-black shadow transition-transform active:scale-y-75"
              } ${
                activeIcon === index
                  ? showClose || showHalf || showFlag
                    ? "m-2 h-full w-full bg-green"
                    : "rounded-sm bg-error  "
                  : "rounded-sm border-2 border-yellow"
              }`}
            >
              <ul className=" ">
                <li
                  className={`inline-block w-auto transform transition-transform  ${
                    activeIcon === index ? " " : ""
                  }`}
                  onClick={() => handleIconClick(index)}
                >
                  {showHalf && activeIcon === index ? item.text : item.icon}
                </li>
              </ul>
            </div>
          ))}
          {activeIcon !== null && (
            <div className="bg-blue-500 top-50 absolute right-3 text-center  text-black">
              <ul className="text-4xl">
                <li
                  className="inline-block w-auto transform transition-transform hover:scale-150"
                  onClick={() => resetActiveIcon()}
                >
                  <AiOutlineClose
                    size={25}
                    className="mt-1 cursor-pointer text-black"
                  />
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
      {drawRequested === true && (
        <div className="flex h-16 w-full items-center justify-center gap-2 text-black">
          <h3>Draw Requested</h3>
          <button className="bg-success px-2" onClick={() => acceptDraw()}>
            Y
          </button>
          <button onClick={() => declineDraw()} className="bg-error px-2">
            N
          </button>
        </div>
      )}
      {gameResigned === true && (
        <div className="flex h-16 w-full flex-col items-center justify-center gap-2 pt-0 text-black sm:pt-4">
          <h3 className=" w-1/2 bg-yellow py-1 text-center shadow transition-transform active:scale-y-75">
            Find New Opponent
          </h3>
          <h3 className=" w-1/2 bg-yellow py-[2px] text-center shadow transition-transform active:scale-y-75">
            Rematch
          </h3>
        </div>
      )}
    </div>
  );
};

export default ActionContainer;
