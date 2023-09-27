//@ts-nocheck
import { useState, useRef, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useRouter } from "next/router";
import Sound from "react-sound"; // Update the import statement

import {
  getMoveOnClick,
  makeMove,
  getPossibleMoves,
  getSideToPlayFromFen,
  validateMoveOnClick,
} from "~/utils/chessPuzzle/chessTactics";
import usePlayModal from "~/hooks/usePlayModal";
import socket from "~/helpers/socket";
import { api } from "~/utils/api";
import useUserStore from "~/hooks/useUserStore";
import moveSound from "public/static/media/move.mp3"; // Update the path as needed
import moveCheckSound from "public/static/media/move-check.mp3"; // Update the path as needed

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
  const user = useUserStore();
  const [playMoveSound, setPlayMoveSound] = useState(false);
  const [playCheckSound, setPlayCheckSound] = useState(false);

  const { playID } = router.query;
  const chessboardRef = useRef();

  const [windowWidth, setWindowWidth] = useState(null);
  const [boardWrapper, setBoardWrapper] = useState({
    width: `80.33vh`,
  });
  const [game, setGame] = useState(new Chess());

  const updateGame = api.games.updateGameFen.useMutation({
    async onSuccess(result) {},
    async onError(result) {
      console.log(result);
    },
  });
  const updateWin = api.games.updateGameWin.useMutation({
    async onSuccess(result) {
      user.setUser(result.rating);
      play.setOpponent(result.loserRating);
      socket.emit("checkmate", {
        roomId: playID,
        loser: result.loserRating,
        winner: result.rating,
      });
    },
    async onError(result) {
      console.log(result);
    },
  });
  const updateLoss = api.games.getUsers.useMutation({
    async onSuccess(result) {
      console.log(result);
      // play.setOpponent(result.rating);
      // user.setUser(result.loserRating);
    },
    async onError(result) {
      console.log(result);
    },
  });

  function onDrop(sourceSquare: string, targetSquare: string) {
    let data = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    };
    const moveMade = makeMove(game.fen(), data);
    if (moveMade) {
      const fens = play.fens;
      const moves = play.moves;
      play.setFens([...fens, moveMade.fen]);
      const newGame = new Chess(moveMade.fen);
      setGame(newGame);
      play.setMoves([...moves, moveMade.fullMove.san]);
      updateGame.mutateAsync({ id: playID, fen: moveMade.fen });
      if (new Chess(moveMade.fen).isCheck() === true) {
        setPlayCheckSound(true);
        console.log(game.isCheck);
      }
      if (new Chess(moveMade.fen).isCheckmate() === true) {
        console.log("checkmate");
        updateWin.mutateAsync({
          winnerAddress: user.user.walletAddress,
          wElo: user.user.bulletRating,
          lElo: play.opponent.bulletRating,
          loserAddress: play.opponent.walletAddress,
        });
        socket.emit("makeMove", {
          roomId: playID,
          fen: moveMade,
          time: Date.now(),
        });
        play.setOpponentTimer(false);
        play.setMyTimer(false);
        return;
      } else {
        socket.emit("makeMove", {
          roomId: playID,
          fen: moveMade,
          time: Date.now(),
        });
      }
      if (newGame.moveNumber() !== 1) {
        play.setOpponentTimer(true);
      }
      setPlayMoveSound(true);

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

      if (new Chess(data.fen).isCheckmate() === true) {
        play.setMyTimer(false);
        play.setOpponentTimer(false);
        console.log("checkmated");

        // Delay execution by 1 second
      }
    });
    socket.on("checkmated", (data) => {
      console.log(data);
      play.setOpponent(data.winner);
      user.setUser(data.loser);
    });
  }, []);

  useEffect(() => {
    setGame(new Chess(play.currentFen));
  }, [play.currentFen]);
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
        setBoardWrapper({ width: `96.7vw` });
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
        customBoardStyle={{
          borderRadius: "5px",
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5 ",
        }}
        customDarkSquareStyle={{ backgroundColor: "#1D5951" }}
        customLightSquareStyle={{ backgroundColor: "#FFDC26" }}
        isDraggablePiece={({ piece }) => piece[0] === boardOrientation[0]}
        onPieceDrop={onDrop}
        position={game.fen()}
        ref={chessboardRef}
      />
      <Sound
        url={moveSound}
        playStatus={playMoveSound ? Sound.status.PLAYING : Sound.status.STOPPED}
        onFinishedPlaying={() => setPlayMoveSound(false)}
      />
      <Sound
        url={moveCheckSound}
        playStatus={
          playCheckSound ? Sound.status.PLAYING : Sound.status.STOPPED
        }
        onFinishedPlaying={() => setPlayCheckSound(false)}
      />
    </div>
  );
};

export default LiveGame;
