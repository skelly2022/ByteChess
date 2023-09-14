//@ts-nocheck
import React, { useEffect, useState } from "react";

import LiveGame from "./LiveGame";
import LiveGameScoreBoard from "./LiveGameScoreBoard";
import RatingContainer from "./RatingContainer";
import useUserStore from "~/hooks/useUserStore";
import Assets from "~/helpers/assets";
import Timer from "./Timer";
import usePlayModal from "~/hooks/usePlayModal";
import joinGameLogic from "~/helpers/joinGameLogic";
import socket from "~/helpers/socket";

const { categorizeChessGame, getOppositeColor } = joinGameLogic;
const { extractFirstAndLast5Characters } = Assets;

interface LiveGameProps {
  boardOrientation: any;
  connected: boolean;
}

const LiveGameContainer: React.FC<LiveGameProps> = ({
  boardOrientation,
  connected,
}) => {
  const user = useUserStore();
  const play = usePlayModal();

  // Now, chessMoves contains the alternated moves with new rows as

  return (
    <div className="flex h-[calc(1indexvh-112px)] w-screen items-center justify-center gap-2 ">
      <div className=" flex h-full w-full flex-col  md:w-auto">
        <div className="w-full md:hidden">
          <RatingContainer type="opponent" />
        </div>
        <div className="flex h-auto w-full   md:justify-end">
          <LiveGame boardOrientation={boardOrientation} connected={connected} />
        </div>
        <div className="w-full md:hidden">
          <RatingContainer type="me" />
        </div>
      </div>
      <div className=" hidden h-full w-1/4 flex-col gap-2  md:flex md:justify-start ">
        <div className=" flex h-auto w-full flex-col ">
          <LiveGameScoreBoard />
        </div>
        {/* <div className=" flex h-1/3 w-full flex-col items-center justify-center gap-2 rounded-xl bg-white ">
          <h1 className="">Chat</h1>
        </div> */}
      </div>
    </div>
  );
};

export default LiveGameContainer;
