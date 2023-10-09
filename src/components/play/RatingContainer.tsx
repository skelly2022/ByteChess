//@ts-nocheck

import { BiCircle, BiSolidCircle } from "react-icons/bi";
import Timer from "./Timer";
import useUserStore from "~/hooks/useUserStore";
import usePlayModal from "~/hooks/usePlayModal";

import Assets from "~/helpers/assets";
import joinGameLogic from "~/helpers/joinGameLogic";
import { useSession } from "next-auth/react";
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
  const user = useUserStore();
  const play = usePlayModal();
  const session = useSession();
  function getGameType(timeControl) {
    // Split the string by the "+" sign
    const [minutes, increment] = timeControl.split("+").map(Number);

    if (minutes < 3) {
      return "Bullet";
    } else if (minutes < 10) {
      return "Blitz";
    } else {
      return "Rapid";
    }
  }
  const time = getGameType(play.minutes + " + " + play.increment);
  return (
    <div
      className={`flex h-12 w-full items-center justify-between  ${
        type === "opponent" ? "rounded-t-lg" : "rounded-b-lg"
      }  p-3`}
    >
      <div className="flex items-center gap-3">
        {type === "me" && <BiSolidCircle color="green" />}
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
        {type === "me" && (
          <h1>{extractFirstAndLast5Characters(session.data.user.name)}</h1>
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
        {time === "Bullet" && type === "me" && (
          <h1>{user.user.bulletRating}</h1>
        )}
        {time === "Blitz" && type === "me" && <h1>{user.user.blitzRating}</h1>}
        {time === "Rapid" && type === "me" && <h1>{user.user.rapidRating}</h1>}
      </div>
      <Timer type={type} />
    </div>
  );
};

export default RatingContainer;
