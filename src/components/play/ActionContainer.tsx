//@ts-nocheck

import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsFlag } from "react-icons/bs";
import { useRouter } from "next/router";
import socket from "~/helpers/socket";
import { api } from "~/utils/api";
import useUserModal from "~/hooks/useUserStore";
import usePlayModal from "~/hooks/usePlayModal";
const icons = [
  {
    icon: <AiOutlineClose size={30} className="cursor-pointer text-black" />,
    text: "Close button clicked.",
    component: null,
  },
  {
    icon: <h1 className="text-4xl">½</h1>,
    text: (
      <div className="flex h-full w-full scale-150 rounded-md  px-2">
        <h1>Draw Offer Sent..</h1>
      </div>
    ),
    component: null,
  },
  {
    icon: <BsFlag size={25} className="cursor-pointer text-black" />,
    text: <></>,
    component: (
      <div className="flex-col">
        <button>Send Rematch Offer</button>
        <button>Find New Opponent</button>
      </div>
    ),
  },
];
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
    });
    socket.on("checkmated", (data) => {
      play.setOpponent(data.loser);
      user.setUser(data.winner);
    });
    socket.on("drawAccepted", (data) => {
      resetActiveIcon();
      console.log(data);
      setGameResigned(true);
      play.setOpponent(data.loser);
      user.setUser(data.winner);
    });
  }, []);
  return (
    <div className="">
      {drawRequested === false && gameResigned === false && (
        <div className="relative flex h-16 w-full items-center justify-center gap-10   text-black">
          {icons.map((item, index) => (
            <div
              key={index}
              className={`${
                activeIcon !== null && activeIcon !== index
                  ? "hidden"
                  : "bg-blue-500 gap-w flex pb-1 text-center font-sans text-black focus:scale-150 "
              } ${
                activeIcon === index
                  ? showClose || showHalf || showFlag
                    ? ""
                    : ""
                  : ""
              }`}
            >
              <ul className="pr-3 text-sm">
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
            <div className="bg-blue-500 top-50 absolute right-0 text-center font-sans text-black">
              <ul className="text-4xl">
                <li
                  className="inline-block w-auto transform transition-transform hover:scale-150"
                  onClick={() => resetActiveIcon()}
                >
                  <AiOutlineClose
                    size={30}
                    className="cursor-pointer text-black"
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
        <div className="flex h-16 w-full flex-col items-center justify-center gap-2 text-black">
          <h3 className=" w-full text-center">Find New Opponent</h3>
          <h3 className="w-full text-center">Rematch</h3>
        </div>
      )}
    </div>
  );
};

export default ActionContainer;
