//@ts-nocheck
import { useState, useRef, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useRouter } from "next/router";
import Sound from "react-sound"; // Update the import statement
import moveSound from "public/static/media/move.mp3"; // Update the path as needed
import moveCheckSound from "public/static/media/move-check.mp3"; // Update the path as needed
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
import useWinModal from "~/hooks/InGameModals/useWinModal";
import useLossModal from "~/hooks/InGameModals/useLossModal";
import useTournamentModal from "~/hooks/useTournamentModal";
import { useSession } from "next-auth/react";
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
  const WinModal = useWinModal();
  const LossModal = useLossModal();
  const tournament = useTournamentModal();
  const chessboardRef = useRef();
  const session = useSession();
  const playID = Array.isArray(router.query.playID)
    ? router.query.playID[0]
    : router.query.playID;
  const [playMoveSound, setPlayMoveSound] = useState(false);
  const [playCheckSound, setPlayCheckSound] = useState(false);

  // Game Logic
  const [game, setGame] = useState(new Chess(play.fen));
  const [preMoveSquares, setPreMoveSquares] = useState({});
  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [moveSquares, setMoveSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});

  const [windowWidth, setWindowWidth] = useState(null);
  const [boardWrapper, setBoardWrapper] = useState({
    width: `80.33vh`,
  });

  // const updateGame = api.games.updateGameFen.useMutation({
  //   async onSuccess(result) {},
  //   async onError(result) {
  //     console.log(result);
  //   },
  // });
  const updateTournamentGame = api.tournament.updateTournamentWin.useMutation({
    async onSuccess(result) {},
    async onError(error) {
      console.log(error);
    },
  });
  const updateWin = api.games.updateGameWin.useMutation({
    async onSuccess(result) {
      user.setUser(result.rating);
      play.setOpponent(result.loserRating);
      WinModal.onOpen();
      if (tournament.tournamentID !== "") {
        updateTournamentGame.mutateAsync({ id: tournament.myID });
      }
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

  /// move option logic
  function onSquareClick(square) {
    setPreMoveSquares({});
  }
  function getMoveOptions(square) {
    const moves = game.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to).color !== game.get(square).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
    return true;
  }

  function onMouseOverSquare(square) {
    getMoveOptions(square);
  }
  function onMouseOutSquare() {
    if (Object.keys(optionSquares).length !== 0) setOptionSquares({});
  }
  function onDrop(sourceSquare: string, targetSquare: string, turn?: any) {
    if (
      game.turn() !== boardOrientation[0] &&
      preMoveSquares !==
        {
          [sourceSquare]: { backgroundColor: "rgba(186, 41, 41, 0.8)" },
          [targetSquare]: { backgroundColor: "rgba(186, 41, 41, 0.8)" },
        }
    ) {
      setPreMoveSquares({
        [sourceSquare]: { backgroundColor: "rgba(186, 41, 41, 0.8)" },
        [targetSquare]: { backgroundColor: "rgba(186, 41, 41, 0.8)" },
      });
      console.log("hey");
      return;
    }
    let data = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    };
    const moveMade = makeMove(game.pgn(), data);
    if (moveMade) {
      setMoveSquares({
        [sourceSquare]: { backgroundColor: "rgba(161, 160, 166, 0.8)" },
        [targetSquare]: { backgroundColor: "rgba(161, 160, 166, 0.8)" },
      });
      console.log(moveMade.pgn);
      const fens = play.fens;
      const moves = play.moves;
      play.setFens([...fens, moveMade.fen]);
      const newGame = new Chess();
      newGame.loadPgn(moveMade.pgn);
      setGame(newGame);
      play.setMoves([...moves, moveMade.fullMove.san]);
      // updateGame.mutateAsync({ id: playID, fen: moveMade.fen });
      setPreMoveSquares({});
      if (new Chess(moveMade.fen).isCheckmate() === true) {
        console.log("checkmate");
        console.log(moveMade.pgn);
        play.setCurrentFen(moveMade.fen);
        updateWin.mutateAsync({
          wAddress: session.data.user.name,
          lAddress: play.opponent.walletAddress,
          id: playID,
        });
        socket.emit("makeMove", {
          roomId: playID,
          fen: moveMade,
          userId: session.data.user.name,
          checkmate: true,
        });
        play.setOpponentTimer(false);
        play.setMyTimer(false);
        return;
      } else {
        socket.emit("makeMove", {
          roomId: playID,
          fen: moveMade,
          userId: session.data.user.name,
          checkmate: false,
        });
      }
      if (newGame.moveNumber() !== 1) {
        play.setOpponentTimer(true);
      }
      play.setMyTimer(false);
      setPlayMoveSound(true);
    } else {
      console.log("falsemove");
      return false;
    }
  }
  useEffect(() => {
    setPreMoveSquares({});
  }, []);

  useEffect(() => {
    socket.on("moveMade", (data) => {
      setMoveSquares({
        [data.fullMove.from]: { backgroundColor: "rgba(161, 160, 166, 0.8)" },
        [data.fullMove.to]: { backgroundColor: "rgba(161, 160, 166, 0.8)" },
      });
      const fens = play.fens;
      const moves = play.moves;
      play.setMoves([...moves, data.fullMove.san]);
      play.setFens([...fens, data.fen]);
      const newGame = new Chess();
      newGame.loadPgn(data.pgn);
      setGame(newGame);

      if (newGame.moveNumber() !== 1) {
        play.setMyTimer(true);
        play.setOpponentTimer(false);
      }
      if (new Chess(data.fen).isCheckmate() === true) {
        play.setMyTimer(false);
        play.setOpponentTimer(false);
        console.log("checkmated");
        LossModal.onClose();
        // Delay execution by 1 second
      }
      if (preMoveSquares != {}) {
        console.log(preMoveSquares);

        const keys = Object.keys(preMoveSquares);
        const sourceSquare = keys[0];
        const targetSquare = keys[1];
        let data = {
          from: sourceSquare,
          to: targetSquare,
          promotion: "q",
        };
        const moveMade = makeMove(newGame.pgn(), data);
        if (moveMade) {
          setMoveSquares({
            [sourceSquare]: { backgroundColor: "rgba(161, 160, 166, 0.8)" },
            [targetSquare]: { backgroundColor: "rgba(161, 160, 166, 0.8)" },
          });
          const fens = play.fens;
          const moves = play.moves;
          play.setFens([...fens, moveMade.fen]);
          const newGamePre = new Chess();
          newGamePre.loadPgn(moveMade.pgn);
          setGame(newGamePre);
          play.setMoves([...moves, moveMade.fullMove.san]);
          // updateGame.mutateAsync({ id: playID, fen: moveMade.fen });
          setPreMoveSquares({});
          if (new Chess(moveMade.fen).isCheckmate() === true) {
            console.log("checkmate");
            updateWin.mutateAsync({
              wAddress: session.data.user.name,
              lAddress: play.opponent.walletAddress,
              id: playID,
            });
            socket.emit("makeMove", {
              roomId: playID,
              fen: moveMade,
              userId: session.data.user.name,
              checkmate: true,
            });
            play.setOpponentTimer(false);
            play.setMyTimer(false);
            return;
          } else {
            socket.emit("makeMove", {
              roomId: playID,
              fen: moveMade,
              userId: session.data.user.name,
              checkmate: false,
            });
          }
          if (newGame.moveNumber() !== 1) {
            play.setOpponentTimer(true);
          }
          play.setMyTimer(false);
          setPlayMoveSound(true);
        } else {
          console.log("falsemove");
          setPreMoveSquares({});

          return false;
        }
      }
    });
    return () => {
      socket.off("moveMade");
    };
  }, [preMoveSquares]);
  useEffect(() => {
    setGame(new Chess(play.fens[play.index]));
  }, [play.index]);
  useEffect(() => {
    setGame(new Chess(play.fen));
  }, [play.fen]);

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
        setBoardWrapper({ width: `94.7vw` });
      } else if (windowWidth < breakpoints.large) {
        setBoardWrapper({ width: `75.33vh` });
      } else {
        setBoardWrapper({ width: `75.33vh` });
      }
    }
  }, [windowWidth]);
  useEffect(() => {
    socket.on("timeUp", (data) => {
      console.log(data);
      if (data.winner === session.data.user.name) {
        updateWin.mutateAsync({
          wAddress: session.data.user.name,
          lAddress: play.opponent.walletAddress,
          id: playID,
        });
      }
    });

    return () => {
      socket.off("timeUp");
    };
  }, []);
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
        customDropSquareStyle={{
          boxShadow: "inset 0 0 1px 6px rgba(255,255,255,0.75)",
        }}
        customDarkSquareStyle={{
          backgroundColor: "#1D5951",
          border: "1.5px solid black",
        }}
        customLightSquareStyle={{
          backgroundColor: "#FFDC26",
          border: "1.85px solid black",
        }}
        customSquareStyles={{
          ...moveSquares,
          ...optionSquares,
          ...rightClickedSquares,
          ...preMoveSquares,
        }}
        isDraggablePiece={({ piece }) => piece[0] === boardOrientation[0]}
        onSquareClick={onSquareClick}
        onMouseOverSquare={onMouseOverSquare}
        onMouseOutSquare={onMouseOutSquare}
        onPieceDrop={onDrop}
        arePremovesAllowed={true}
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
