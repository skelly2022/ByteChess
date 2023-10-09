import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { AiFillHeart, AiOutlineArrowRight } from "react-icons/ai";
import Assets from "../../helpers/assets";
const { whiteStyle, blackStyle, extractFirstAndLast5Characters } = Assets;
import usePlayModal from "~/hooks/usePlayModal";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

interface DashBoardProps {
  selectedGame: any;
  onHandleBack: any;
  handleLike: any;
}

const DashBoard: React.FC<DashBoardProps> = ({
  selectedGame,
  onHandleBack,
  handleLike,
}) => {
  console.log(selectedGame);

  const moveString = selectedGame.attributes[0].value;
  const splitMoves = moveString.split(" ");
  const [game, setGame] = useState(new Chess());
  const [windowWidth, setWindowWidth] = useState(null);
  const [pgn, setPgn] = useState("");
  const [stack, setStack] = useState([]);
  const [boardWrapper, setBoardWrapper] = useState({
    width: `80.33vh`,
  });
  const [saves, setsaves] = useState([]);
  const getLikes = api.mint.getLikes.useMutation({
    onSuccess(data) {
      console.log(data);
    },
  });

  const moves = moveString.split(" ").filter((_, index) => index % 3 !== 0);

  const breakpoints = {
    small: 576,
    medium: 768,
    large: 992,
    extraLarge: 1200,
  };
  const allMoves = splitMoves.reduce((acc, move, index) => {
    if (index % 2 === 0) {
      // This is a white move
      acc.push({ moveNumber: index / 2 + 1, whiteMove: move, blackMove: "" });
    } else {
      // This is a black move
      acc[acc.length - 1].blackMove = move;
    }
    return acc;
  }, []);

  const stepForward = () => {
    // Add back the last removed move
    if (stack.length > 0) {
      const lastMove = stack.pop();
      setStack([...stack]); // Update the stack state
      const newPgn = `${pgn} ${lastMove.join(" ")}`;
      setPgn(newPgn);

      const newGame = new Chess(); // create a new instance
      newGame.loadPgn(newPgn);
      setGame(newGame); // Update game state
    }
  };

  const stepBackward = () => {
    // Remove the last move
    const moves = pgn.split(" ");
    if (moves.length > 0) {
      const removedMove = moves.splice(-2, 2); // Remove last two moves (one for each side)
      setStack((prevStack) => [...prevStack, removedMove]);
      setPgn(moves.join(" "));
      const newGame = new Chess(); // create a new instance
      newGame.loadPgn(moves.join(" "));
      setGame(newGame); // Update game state
    }
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        // Remove the last move
        stepBackward();
      } else if (e.key === "ArrowRight") {
        // Add back the last removed move
        stepForward();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pgn, stack, game]);

  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  function convertToPGN(moveString) {
    const moves = moveString.split(" ");
    let pgn = "";
    let moveNumber = 1;

    for (let i = 0; i < moves.length; i += 2) {
      pgn += `${moveNumber}. ${moves[i]} `; // White's move
      if (i + 1 < moves.length) {
        pgn += `${moves[i + 1]} `; // Black's move
      }
      moveNumber++;
    }

    return pgn.trim();
  }

  useEffect(() => {
    // Check if window is defined (to avoid SSR issues)
    if (typeof window !== "undefined") {
      // Add event listener only on the client side
      window.addEventListener("resize", updateWindowWidth);

      // Initial width setup
      setWindowWidth(window.innerWidth);

      // Clean up the event listener when the component unmounts
      return () => {
        window.removeEventListener("resize", updateWindowWidth);
      };
    }
  }, []);
  useEffect(() => {
    if (windowWidth !== null) {
      if (windowWidth < breakpoints.medium) {
        setBoardWrapper({ width: `80.7vw` });
      } else if (windowWidth < breakpoints.large) {
        setBoardWrapper({ width: `60.33vh` });
      } else {
        setBoardWrapper({ width: `60.33vh` });
      }
    }
  }, [windowWidth]);
  useEffect(() => {
    const newGame = game;
    newGame.loadPgn(convertToPGN(moveString));
    setGame(newGame);
    setPgn(convertToPGN(moveString));
  }, []);

  return (
    <div className="flex h-auto  w-full grow flex-col items-center justify-center gap-3  p-3 md:flex-row">
      <div className="flex h-auto w-auto  justify-center ">
        <div style={boardWrapper} className="z-10">
          <Chessboard
            position={game.fen()}
            customBoardStyle={{
              boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
            }}
            showBoardNotation={true}
            areArrowsAllowed={true}
            snapToCursor={true}
          />
        </div>
      </div>

      <div className="flex h-[40.33vh] w-full flex-col items-center  border p-3 md:h-[60.33vh] md:w-auto">
        <div className="relative flex w-full">
          <div
            className=" z-100 absolute left-0 top-[22%] flex  h-8 w-8 rotate-180 transform cursor-pointer select-none items-center justify-center rounded-full border-2 border-white p-1.5 text-lg leading-6 text-white hover:bg-white hover:bg-opacity-50 active:right-2"
            onClick={() => {
              onHandleBack();
            }}
          >
            <AiOutlineArrowRight />
          </div>
          <h1 className="flex w-full justify-center py-3 text-xl text-white">
            ByteChess cNFTs
          </h1>
        </div>
        <div className="flex w-full  items-center justify-center gap-4 py-4">
          <div className="flex items-center  text-xl">
            {extractFirstAndLast5Characters(selectedGame.attributes[1].value)}{" "}
            <div style={whiteStyle}></div>
          </div>
          <div className="flex items-center gap-2 text-xl">
            {extractFirstAndLast5Characters(selectedGame.attributes[2].value)}{" "}
            <div style={blackStyle}></div>
          </div>
        </div>
        <div className="flex w-full justify-evenly py-2">
          <div
            className="flex items-center gap-2 rounded-xl bg-yellow px-3 py-1"
            onClick={() => {
              handleLike(selectedGame.image);
            }}
          >
            Like this Game{" "}
            <AiFillHeart color={selectedGame.isLiked ? "red" : ""} />
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-slate-500 px-3 py-1">
            Analyze this game
          </div>
        </div>
        <div className="no-scrollbar h-auto w-full grow overflow-scroll">
          <table className=" w-full border-collapse border bg-yellow">
            <thead>
              <tr>
                <th className="border border-black p-2">Move No.</th>
                <th className=" border border-black p-2">White</th>
                <th className=" border border-black p-2">Black</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.ceil(moves.length / 2) }).map(
                (_, index) => (
                  <tr key={index}>
                    <td className=" border border-black p-2">{index + 1}</td>
                    <td className=" border border-black p-2">
                      {moves[2 * index] || ""}
                    </td>
                    <td className=" border border-black p-2">
                      {moves[2 * index + 1] || ""}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
