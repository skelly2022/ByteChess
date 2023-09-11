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
    console.log(moves);
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
      console.log(data);
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
              const movesMade = puzzle.puzzleMoves;
              const move = {
                moveNumber: autoNext.lastMoveNumber,
                color: autoNext.lastMoveColor,
                move: autoNext.lastMove,
              };
              movesMade.push(move);
              puzzle.setPuzzleMoves(movesMade);
            }, 500);
          }
        } else {
          console.log("puzzle done");
        }
      } else {
        console.log(false);
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
      const movesMade = puzzle.puzzleMoves;
      const move = {
        moveNumber: next.lastMoveNumber,
        color: next.lastMoveColor,
        move: next.lastMove,
      };
      movesMade.push(move);
      puzzle.setPuzzleMoves(movesMade);
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
            const move = {
              moveNumber: autoNext.lastMoveNumber,
              color: autoNext.lastMoveColor,
              move: autoNext.lastMove,
            };
            movesMade.push(move);
            puzzle.setPuzzleMoves(movesMade);
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
          const movesMade = puzzle.puzzleMoves;
          const move = {
            moveNumber: next.lastMoveNumber,
            color: next.lastMoveColor,
            move: next.lastMove,
          };
          movesMade.push(move);
          puzzleFens.push(next.fen);
          const side = getSideToPlayFromFen(next.fen);
          puzzle.setSide(side);
          console.log(side);
          puzzle.setPuzzle(next.fen);
          puzzle.setPuzzleMoves(movesMade);
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
      if (windowWidth < breakpoints.large) {
        setBoardWrapper({ width: `60.33vh` });
      } else {
        setBoardWrapper({ width: `80.33vh` });
      }
    }
  }, [windowWidth]);
  return (
    <div style={boardWrapper}>
      <Chessboard
        position={game.fen()}
        boardOrientation={getSideToPlayFromFen(fen) === "w" ? "black" : "white"}
        onPieceDrop={onSquareDrop}
        onPieceDragBegin={onSquareClick}
        onSquareClick={onSquareClick}
        // onMouseOverSquare={onMouseOverSquare}
        // onMouseOutSquare={onMouseOutSquare}
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
