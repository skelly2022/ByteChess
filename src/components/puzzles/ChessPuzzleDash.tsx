//@ts-nocheck

import * as Switch from "@radix-ui/react-switch";
import { useEffect, useState } from "react";
import usePuzzleStore from "~/hooks/usePuzzleStore";
import useUserStore from "~/hooks/useUserStore";
import dynamic from "next/dynamic";
import AnimatedNumber from "../animated/AnimatedNumber";
import Assets from "../../helpers/assets";

const { whiteStyle, blackStyle } = Assets;

const AnimatedNumbers = dynamic(() => import("react-animated-numbers"), {
  ssr: false,
});
interface PuzzleDashProps {
  rating?: string;
  fen?: string;
  solution?: Array<String>;
}

const ChessPuzzleDash: React.FC<PuzzleDashProps> = ({
  rating,
  solution,
  fen,
}) => {
  const puzzle = usePuzzleStore();
  const user = useUserStore();

  const [currentMove, setCurrentMove] = useState();
  const [movesNow, setMoves] = useState([]);

  // Iterate through puzzle.puzzleMoves to populate moveArray
  useEffect(() => {
    const moveArray = [];
    puzzle.puzzleMoves.forEach((move) => {
      const { moveNumber, color, move: moveText } = move;
      // Find or create a move entry for the current moveNumber
      let moveEntry = moveArray.find(
        (entry) => entry.moveNumber === moveNumber,
      );
      if (!moveEntry) {
        moveEntry = { moveNumber, w: "", b: "" };
        moveArray.push(moveEntry);
      }

      // Populate the move entry based on the color
      if (color === "w") {
        moveEntry.w = moveText;
      } else if (color === "b") {
        moveEntry.b = moveText;
      }
      if (moveArray[moveArray.length - 1].b !== "") {
        const nextMoveNumber = parseInt(moveNumber) + 1;
        setCurrentMove(nextMoveNumber.toString());
        moveArray.push({ moveNumber: nextMoveNumber.toString(), w: "", b: "" });
      } else {
        setCurrentMove(moveNumber.toString());
      }
      setMoves(moveArray);
    });
  }, [puzzle]);

  useEffect(() => {
    const puzzleFens = puzzle.puzzleFens;
    const currentFen = puzzle.puzzleFen;
    //@ts-ignore
    const length = puzzleFens.length;
    const index = puzzleFens.indexOf(currentFen);

    const downHandler = ({ key }: { key: string }) => {
      if (key === "ArrowLeft") {
        if (index > 0) {
          console.log(index);
          puzzle.setPuzzle(puzzleFens[index - 1]);
        }
      }
      if (key === "ArrowRight") {
        if (index + 1 < length) {
          puzzle.setPuzzle(puzzleFens[index + 1]);
        }
      }
    };
    window.addEventListener("keydown", downHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, [puzzle.puzzleFen, puzzle.puzzleFens]);
  return (
    <div className="flex h-full w-full gap-2 md:flex-col">
      <div className=" flex h-32 w-full flex-col bg-white shadow ">
        <div className=" flex h-full w-full transform flex-col items-center justify-center">
          <h1>Current Rating</h1>
          <AnimatedNumber number={user.user.puzzleRating} />
        </div>
      </div>
      <div className=" h-32 w-full bg-white shadow md:h-auto">
        <div className=" flex h-full w-full flex-col items-center justify-center ">
          <h1> Puzzle Rating: {rating}</h1>
          <div className="flex items-center">
            {puzzle.side == "w" && <div style={whiteStyle}></div>}
            {puzzle.side == "b" && <div style={blackStyle}></div>}
            <div className="flex flex-col">
              {" "}
              <h1>Your turn</h1>
              {/* <h1>Find the best move for {currentMoveColor}</h1> */}
            </div>
          </div>
        </div>
        <table className="hidden w-full border bg-white md:block">
          <tbody>
            {Array.from(movesNow.entries()).map(([moveEntry, moves], index) => (
              <tr key={moves.b}>
                <td className="w-[50px] bg-gray-200 px-2 py-2 text-center">
                  {moves.moveNumber}
                </td>
                <td
                  className={`w-[100px] px-2 py-2 ${
                    puzzle.side === "white" && currentMove === moves.moveNumber
                      ? ""
                      : ""
                  } `}
                >
                  {moves.w}
                </td>
                <td
                  className={`w-[100px] px-2 py-2 ${
                    moves.b === "1" ? "bg-black" : ""
                  }`}
                >
                  {moves.b}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChessPuzzleDash;
