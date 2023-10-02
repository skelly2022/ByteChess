//@ts-nocheck

import { Chess } from "chess.js";

export function getPossibleMoves(fen, square) {
  const chess = new Chess(fen);
  let moves = chess.moves({
    square: square,
    verbose: true,
  });

  return moves;
}

export function playerInCheck(fen) {
  const chess = new Chess(fen);
  let inCheck = chess.in_check();

  return inCheck;
}

export function getMoveOnClick(fen, data) {
  const next = moveOnCLick(fen, data);

  return next ? next.moves.san : null;
}

export function getSideToPlayFromFen(fen) {
  const chess = new Chess(fen);
  return chess.turn();
}

export function moveOnCLick(fen, move) {
  const chess = new Chess(fen);
  try {
    let moves = chess.move(move);
    return moves ? { moves, fen: chess.fen() } : null;
  } catch (error) {
    return null;
  }
}

export function makeMove(pgn, move) {
  const chess = new Chess();
  chess.loadPgn(pgn);
  try {
    const fullMove = chess.move(move);
    return fullMove ? { fullMove, fen: chess.fen(), pgn: chess.pgn() } : null;
  } catch (error) {
    return false;
  }
}

export function validateMoveOnClick(fen, move, solution) {
  const chess = new Chess(fen);

  if (solution.length === 0) {
    return null;
  }
  const next = moveOnCLick(fen, move);
  const solutionString = solution[0];
  const fromSolutionString = solutionString.substring(0, 2);
  const toSolutionString = solutionString.substring(2, 4);

  if (
    next &&
    next.moves.from === fromSolutionString &&
    next.moves.to === toSolutionString
  ) {
    const fenParts = next.moves.before.split(" ");
    const moveNumber = fenParts[5];
    const fullMove = chess.move(move);

    return {
      fen: next.fen,
      solution: solution.slice(1),
      lastMove: fullMove,
      lastMoveNumber: moveNumber,
      lastMoveColor: next.moves.color,
    };
  } else {
    return null;
  }
}

export function validateMove(fen, move, solution) {
  if (solution.length === 0) {
    return null;
  }

  const next = makeMove(fen, move);

  if (next && next.fullMove.san === solution[0]) {
    return {
      fen: next.fen,
      solution: solution.slice(1),
    };
  }

  return null;
}
