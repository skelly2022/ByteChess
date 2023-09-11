//@ts-nocheck

import { useState, useMemo, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useRouter } from "next/router";

import {
  getMoveOnClick,
  makeMove,
  getPossibleMoves,
  getSideToPlayFromFen,
  validateMoveOnClick,
} from "~/utils/chessPuzzle/chessTactics";
import usePlayModal from "~/hooks/usePlayModal";
import socket from "~/helpers/socket";

interface LiveGameProps {
  boardOrientation: any;
}
const breakpoints = {
  small: 576,
  medium: 768,
  large: 992,
  extraLarge: 1200,
};
const LiveGame: React.FC<LiveGameProps> = ({ boardOrientation }) => {
  const play = usePlayModal();
  const router = useRouter();
  const { playID } = router.query;

  const [turn, setTurn] = useState("");
  const [windowWidth, setWindowWidth] = useState(null);
  const [boardWrapper, setBoardWrapper] = useState({
    width: `80.33vh`,
  });
  const [game, setGame] = useState(new Chess(play.fens[0]));
  function onDrop(sourceSquare: string, targetSquare: string) {
    let data = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    };
    const moveMade = makeMove(game.fen(), data);
    if (moveMade) {
      const fens = play.fens;
      play.setFens([...fens, moveMade.fen]);
      setGame(new Chess(moveMade.fen));
      socket.emit("makeMove", { roomId: playID, fen: moveMade });
      play.setOpponentTimer(true);
      play.setMyTimer(false);
    } else {
      return false;
    }
  }
  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };
  useEffect(() => {
    socket.on("moveMade", (data) => {
      console.log(data);
      play.setMyTimer(true);
      play.setOpponentTimer(false);
      const fens = play.fens;
      play.setFens([...fens, data.fen]);
      setGame(new Chess(data.fen));
    });
  }, [play.time]);

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
    // Update boardWrapper based on the windowWidth
    if (windowWidth !== null) {
      if (windowWidth < breakpoints.medium) {
        setBoardWrapper({ width: `100vw` });
      } else {
        setBoardWrapper({ width: `80.33vh` });
      }
    }
  }, [windowWidth]);

  return (
    <div style={boardWrapper}>
      <Chessboard
        id="BasicBoard"
        boardOrientation={boardOrientation}
        isDraggablePiece={({ piece }) => piece[0] === boardOrientation[0]}
        onPieceDrop={onDrop}
        position={game.fen()}
      />
    </div>
  );
};

export default LiveGame;
