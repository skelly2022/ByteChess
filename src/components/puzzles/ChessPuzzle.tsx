//@ts-nocheck
import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import {
  getMoveOnClick,
  getPossibleMoves,
  getSideToPlayFromFen,
  validateMoveOnClick,
} from "~/utils/chessPuzzle/chessTactics";
import usePuzzleStore from "src/hooks/usePuzzleStore";

interface PuzzleProps {
  fen?: string;
  solution?: Array;
  correct: () => void;
  inCorrect: () => void;
}

const Board: React.FC<PuzzleProps> = ({
  fen,
  solution,
  correct,
  inCorrect,
}) => {
  const puzzle = usePuzzleStore();
  const [game, setGame] = useState(new Chess(fen));
  const [solutionMoves, setSolution] = useState();
  const [sideToPlay, setSideToPlay] = useState();
  const [pieceSquare, setPieceSquare] = useState("");
  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});
  const [windowWidth, setWindowWidth] = useState(null);
  const [boardWrapper, setBoardWrapper] = useState({
    width: `80.33vh`,
  });

  const breakpoints = {
    small: 576,
    medium: 768,
    large: 992,
    extraLarge: 1200,
  };
  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  function onSquareClick(targetSquare: any) {
    let moves = game.moves({
      square: targetSquare,
      verbose: true,
    });
    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[targetSquare] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);

    if (pieceSquare === "") {
      setPieceSquare(targetSquare);
      return;
    } else {
      let data = {
        from: pieceSquare,
        to: targetSquare,
        promotion: "q",
      };
      const next = validateMoveOnClick(game.fen(), data, solutionMoves);
      if (next) {
        setGame(new Chess(next.fen));
        setSolution(next.solution);

        const move = {
          moveNumber: next.lastMoveNumber,
          color: next.lastMoveColor,
          move: next.lastMove,
        };
        if (next.solution.length > 0) {
          // onCorrect();
          const autoNext = validateMoveOnClick(
            next.fen,
            next.solution[0],
            next.solution,
          );
          if (autoNext) {
            setTimeout(() => {
              setGame(new Chess(autoNext.fen));
              puzzleFens.push(autoNext.fen);
              puzzle.setPuzzleFens(puzzleFens);
              setSolution(autoNext.solution);
              const movesMade = puzzle.moves;
              const move = {
                moveNumber: autoNext.lastMoveNumber,
                color: autoNext.lastMoveColor,
                move: autoNext.lastMove,
              };
              puzzle.setMoves([...puzzle.moves, move.move]);
            }, 500);
          }
        } else {
        }
      } else {
      }

      setPieceSquare("");
      return true;
    }
  }
  function onSquareDrop(square, targetSquare) {
    let data = {
      from: square,
      to: targetSquare,
      promotion: "q",
    };
    const next = validateMoveOnClick(game.fen(), data, solutionMoves);
    if (next) {
      setGame(new Chess(next.fen));
      setSolution(next.solution);
      const move = {
        moveNumber: next.lastMoveNumber,
        color: next.lastMoveColor,
        move: next.lastMove,
      };
      const moves = puzzle.moves;
      puzzle.setMoves([...moves, next.lastMove.san]);
      moves.push(next.lastMove.san);

      if (next.solution.length > 0) {
        const autoNext = validateMoveOnClick(
          next.fen,
          next.solution[0],
          next.solution,
        );
        if (autoNext) {
          setTimeout(() => {
            setGame(new Chess(autoNext.fen));
            setSolution(autoNext.solution);
            puzzle.setMoves([...moves, autoNext.lastMove.san]);

            // movesMade.push(move);
            // puzzle.setMoves(movesMade);
          }, 500);
        }
      } else {
        correct();
      }
    } else {
      inCorrect();
    }
  }

  useEffect(() => {
    setGame(new Chess(puzzle.puzzleFen));
  }, [puzzle.puzzleFen]);

  useEffect(() => {
    if (fen !== undefined && solution !== undefined) {
      const puzzleFens = puzzle.puzzleFens;
      puzzleFens.push(fen);
      setGame(new Chess(fen));
      puzzle.setLoading(true);
      const solutionString = solution[0];
      const fromSolutionString = solutionString.substring(0, 2);
      const toSolutionString = solutionString.substring(2, 4);
      let data = {
        from: fromSolutionString,
        to: toSolutionString,
        promotion: "q",
      };
      setTimeout(() => {
        const next = validateMoveOnClick(fen, data, solution);
        if (next) {
          setGame(new Chess(next.fen));
          setSolution(next.solution);
          const movesMade = puzzle.moves;
          const move = {
            moveNumber: next.lastMoveNumber,
            color: next.lastMoveColor,
            move: next.lastMove,
          };
          puzzleFens.push(next.fen);
          const side = getSideToPlayFromFen(next.fen);
          puzzle.setSide(side);
          puzzle.setPuzzle(next.fen);
          const moves = puzzle.moves;

          puzzle.setMoves([...moves, next.lastMove.san]);
        }
      }, 700);
    }
  }, [fen]);
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
        setBoardWrapper({ width: `97vw` });
      } else {
        setBoardWrapper({ width: `80.33vh` });
      }
    }
  }, [windowWidth]);
  useEffect(() => {
    console.log(sideToPlay);
    if (getSideToPlayFromFen(fen) === "w") {
      setSideToPlay("w");
    } else {
      setSideToPlay("b");
    }
  }, []);
  return (
    <div style={boardWrapper}>
      <Chessboard
        position={game.fen()}
        boardOrientation={getSideToPlayFromFen(fen) === "w" ? "black" : "white"}
        onPieceDrop={onSquareDrop}
        // onPieceDragBegin={onSquareClick}
        // onSquareClick={onSquareClick}
        // onMouseOverSquare={onMouseOverSquare}
        // onMouseOutSquare={onMouseOutSquare}
        isDraggablePiece={({ piece }) => piece[0] === sideToPlay}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
        }}
        customSquareStyles={{
          ...optionSquares,
          ...rightClickedSquares,
        }}
      />
    </div>
  );
};

export default Board;
