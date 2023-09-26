//@ts-nocheck

import { BiCircle, BiSolidCircle } from "react-icons/bi";
import Timer from "./Timer";
import useUserStore from "~/hooks/useUserStore";
import usePlayModal from "~/hooks/usePlayModal";

import Assets from "~/helpers/assets";
import joinGameLogic from "~/helpers/joinGameLogic";
import { useSession } from "next-auth/react";
import MyTimer from "../MyTimer";
import OpponentTimer from "./OpponentTimer";
const { categorizeChessGame, getOppositeColor } = joinGameLogic;
const { extractFirstAndLast5Characters } = Assets;

interface RatingContainerProps {
  type: string;
  // rating: string;
}
const RatingContainer: React.FC<RatingContainerProps> = ({
  // rating,
  type,
}) => {
  const time2 = new Date();

  const user = useUserStore();
  const play = usePlayModal();
  const session = useSession();
  const time = categorizeChessGame(play.minutes + " + " + play.increment);
  return (
    <div
      className={`flex h-12 w-full items-center justify-between  ${
        type === "opponent" ? "rounded-t-lg" : "rounded-b-lg"
      }  p-3`}
    >
      <div className="flex items-center gap-3">
        {type === "opponent" && play.opponent.walletAddress !== "" && (
          <BiSolidCircle color="green" />
        )}
        {type === "opponent" && play.opponent.walletAddress === "" && (
          <BiCircle />
        )}
        {type === "opponent" && play.opponent.walletAddress !== "" && (
          <h1>{extractFirstAndLast5Characters(play.opponent.walletAddress)}</h1>
        )}
        {type === "opponent" && play.opponent.walletAddress === "" && (
          <h1>Waiting for opponent...</h1>
        )}
        {time === "Bullet" && type === "opponent" && (
          <h1>{play.opponent.bulletRating}</h1>
        )}
        {time === "Blitz" && type === "opponent" && (
          <h1>{play.opponent.blitzRating}</h1>
        )}
        {time === "Rapid" && type === "opponent" && (
          <h1>{play.opponent.rapidRating}</h1>
        )}
      </div>
      <OpponentTimer
        expiryTimestamp={time2.setSeconds(time2.getSeconds() + 60)}
      />
    </div>
  );
};

export default RatingContainer;
