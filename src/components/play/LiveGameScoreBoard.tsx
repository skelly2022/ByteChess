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
import { useEffect, useState } from "react";
import ActionContainer from "./ActionContainer";

const { categorizeChessGame, getOppositeColor } = joinGameLogic;
const { extractFirstAndLast5Characters } = Assets;

const LiveGameTimer = () => {
  const user = useUserStore();
  const play = usePlayModal();

  const time = categorizeChessGame(play.minutes + " + " + play.increment);
  const [chessMoves, setChessMoves] = useState([
    {
      moveNumber: 1,
      whiteMove: "",
      blackMove: "",
    },
  ]);

  function addMove(moveString) {
    const index = chessMoves.length - 1;
    if (chessMoves[index].whiteMove === "") {
      chessMoves[index].whiteMove = moveString;
      setChessMoves([...chessMoves]);
    } else {
      chessMoves[index].blackMove = moveString;
      const newRow = {
        moveNumber: chessMoves[index].moveNumber + 1,
        whiteMove: "",
        blackMove: "",
      };
      setChessMoves([...chessMoves, newRow]);
    }
  }
  const stepForward = () => {
    if (play.index + 1 < play.fens.length) {
      play.setIndex(play.index + 1);
    }
  };

  const stepBackward = () => {
    if (play.index > 0) {
      play.setIndex(play.index - 1);
    }
  };

  useEffect(() => {
    const downHandler = ({ key }: { key: string }) => {
      if (key === "ArrowLeft") {
        if (play.index > 0) {
          play.setIndex(play.index - 1);
        }
      }
      if (key === "ArrowRight") {
        if (play.index + 1 < play.fens.length) {
          play.setIndex(play.index + 1);
        }
      }
    };
    window.addEventListener("keydown", downHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, [play.fens, play.index]);

  useEffect(() => {
    const index = play.moves.length;

    if (index !== 0) {
      addMove(play.moves[index - 1]);
    }
  }, [play.moves]);

  return (
    <div className="text-yellow border-yellow relative flex h-full w-full flex-col rounded-lg border">
      <RatingContainer type="opponent" />

      <div
        className="bg-yellow relative flex cursor-pointer items-center
       justify-center gap-3 p-2 text-black shadow"
      >
        <AiFillFastBackward
          size={30}
          onClick={() => {
            play.setIndex(0);
          }}
        />
        <AiFillStepBackward
          size={25}
          onClick={() => {
            stepBackward();
          }}
        />
        <AiFillStepForward
          size={25}
          onClick={() => {
            stepForward();
          }}
        />
        <AiFillFastForward
          size={30}
          onClick={() => {
            play.setIndex(play.fens.length - 1);
          }}
        />
        <div className="absolute right-2 top-2">
          <GiHamburgerMenu size={30} />
        </div>
      </div>
      <div className="flex h-auto items-center justify-center overflow-auto">
        <div className="h-full w-full rounded-lg  p-4 shadow-lg">
          <table className="no-scrollbar w-full overflow-auto text-black shadow-md">
            <tbody>
              {chessMoves.map((turn) => (
                <tr
                  className="text-center"
                  key={turn.moveNumber + turn.whiteMove}
                >
                  <td className="bg-yellow w-4 border border-black px-4 py-2">
                    {turn.moveNumber}
                  </td>
                  <td className="bg-yellow w-4 border border-black px-4 py-2">
                    {turn.whiteMove}
                  </td>
                  <td className="bg-yellow w-4 border border-black px-4 py-2">
                    {turn.blackMove}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="absolute bottom-0 w-full">
        {" "}
        <RatingContainer type="me" />
      </div>
    </div>
  );
};

export default LiveGameTimer;
