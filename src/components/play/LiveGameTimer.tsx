//@ts-nocheck

import {
  AiFillFastBackward,
  AiFillFastForward,
  AiFillStepBackward,
  AiFillStepForward,
} from "react-icons/ai";

import { GiHamburgerMenu } from "react-icons/gi";
import { BiCircle } from "react-icons/bi";
import Timer from "./Timer";
import RatingContainer from "./RatingContainer";
import useUserStore from "~/hooks/useUserStore";
import Assets from "~/helpers/assets";
import usePlayModal from "~/hooks/usePlayModal";
import joinGameLogic from "~/helpers/joinGameLogic";

const { categorizeChessGame, getOppositeColor } = joinGameLogic;
const { extractFirstAndLast5Characters } = Assets;

const LiveGameTimer = () => {
  const user = useUserStore();
  const play = usePlayModal();
  const time = categorizeChessGame(play.minutes + " + " + play.increment);

  return (
    <div className="flex w-full flex-col ">
      <RatingContainer type="opponent" />

      <div className="relative flex items-center justify-center gap-3 bg-slate-50 p-2 shadow">
        <AiFillFastBackward size={30} />
        <AiFillStepBackward size={25} />
        <AiFillStepForward size={25} />
        <AiFillFastForward size={30} />
        <div className="absolute right-2 top-2">
          <GiHamburgerMenu size={30} />
        </div>
      </div>
      <div className="flex h-48 items-center justify-center bg-white">
        ScoreBoard
      </div>
      <RatingContainer type="me" />
    </div>
  );
};

export default LiveGameTimer;
