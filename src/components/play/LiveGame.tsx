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
  connected: boolean;
}
const breakpoints = {
  small: 576,
  medium: 768,
  large: 992,
  extraLarge: 1200,
};
const LiveGame: React.FC<LiveGameProps> = ({ boardOrientation, connected }) => {
  const play = usePlayModal();
  const router = useRouter();
  const { playID } = router.query;
  const [turn, setTurn] = useState("");
  const [windowWidth, setWindowWidth] = useState(null);
  const [boardWrapper, setBoardWrapper] = useState({
    width: `80.33vh`,
  });
  const [game, setGame] = useState(new Chess());
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

      const newGame = new Chess(moveMade.fen);
      setGame(newGame);
      const moves = play.moves;
      play.setMoves([...moves, moveMade.fullMove.san]);
      socket.emit("makeMove", { roomId: playID, fen: moveMade });
      if (newGame.moveNumber() !== 1) {
        play.setOpponentTimer(true);
      }
      play.setMyTimer(false);
    } else {
      return false;
    }
  }
  useEffect(() => {
    setGame(new Chess(play.fens[play.index]));
  }, [play.index]);
  useEffect(() => {
    socket.on("moveMade", (data) => {
      const fens = play.fens;
      const moves = play.moves;
      play.setMoves([...moves, data.fullMove.san]);
      play.setFens([...fens, data.fen]);
      const newGame = new Chess(data.fen);
      setGame(new Chess(data.fen));
      if (newGame.moveNumber() !== 1) {
        play.setMyTimer(true);
        play.setOpponentTimer(false);
      }
    });
  }, [play.fens]);

  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateWindowWidth);
      setWindowWidth(window.innerWidth);
      return () => {
        window.removeEventListener("resize", updateWindowWidth);
      };
    }
  }, []);
  useEffect(() => {
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
        showBoardNotation={true}
        boardOrientation={boardOrientation}
        isDraggablePiece={({ piece }) => piece[0] === boardOrientation[0]}
        onPieceDrop={onDrop}
        position={game.fen()}
      />
    </div>
  );
};

export default LiveGame;
