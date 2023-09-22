import ClientOnly from "src/components/ClientOnly";
import Navbar from "src/components/navbar/Navbar";
import ToasterProvider from "src/providers/ToasterProvider";
import LoginModal from "src/modals/LoginModal";
import LandingPage from "src/components/home/LandingPage";
import PlayFriend from "src/modals/PlayFriend";
import { useEffect, useRef, useState } from "react";
import usePlayModal from "~/hooks/usePlayModal";
import LeaderboardContainer from "~/components/leaderboard/LeaderBoardContainer";
import { Chess } from "chess.js";
import { Chessboard, ClearPremoves } from "react-chessboard";
const boardWrapper = {
  width: `70vw`,
  maxWidth: "70vh",
  margin: "3rem auto",
};
export default function Home() {
  const [game, setGame] = useState(new Chess());
  const [currentTimeout, setCurrentTimeout] = useState<NodeJS.Timeout>();
  const chessboardRef = useRef<ClearPremoves>(null);

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }
  const pgnString = `
  1. e4 e6
  2. d3
  `;
  function makeRandomMove() {
    // const possibleMoves = game.moves();
    // // exit if the game is over
    // if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0)
    //   return;
    // const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    // safeGameMutate((game) => {
    //   game.move(possibleMoves[randomIndex]);
    // });
  }
  useEffect(() => {
    // Create a new Chess instance and load it with the PGN string
    const newGame = new Chess();
    newGame.loadPgn(pgnString);

    // Set the game state to the new Chess instance
    setGame(newGame);

    // Reset the chessboard and clear premove queue if needed
    chessboardRef.current?.clearPremoves();
  }, [pgnString]);

  function onDrop(sourceSquare, targetSquare, piece) {
    const gameCopy = game;
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() ?? "q",
    });
    console.log(gameCopy.pgn());

    setGame(gameCopy);

    // illegal move
    if (move === null) return false;

    // store timeout so it can be cleared on undo/reset so computer doesn't execute move
    const newTimeout = setTimeout(makeRandomMove, 2000);
    setCurrentTimeout(newTimeout);
    return true;
  }

  const play = usePlayModal();

  useEffect(() => {
    play.resetState();
  }, []);
  return (
    <>
      <ClientOnly>
        <ToasterProvider />
        <LoginModal />
        <PlayFriend />
        <Navbar />
      </ClientOnly>
      <main className="no-scrollbar bg-lightblue flex min-h-screen flex-col items-center overflow-auto">
        {/* <LeaderboardContainer /> */}
        <div style={boardWrapper}>
          <Chessboard
            id="PremovesEnabled"
            arePremovesAllowed={true}
            position={game.fen()}
            onPieceDrop={onDrop}
            customBoardStyle={{
              borderRadius: "4px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            }}
            ref={chessboardRef}
          />
          <button
            onClick={() => {
              safeGameMutate((game) => {
                game.reset();
              });
              // clear premove queue
              chessboardRef.current?.clearPremoves();
              // stop any current timeouts
              clearTimeout(currentTimeout);
            }}
          >
            reset
          </button>
          <button
            onClick={() => {
              // undo twice to undo computer move too
              safeGameMutate((game) => {
                game.undo();
                game.undo();
              });
              // clear premove queue
              chessboardRef.current?.clearPremoves();
              // stop any current timeouts
              clearTimeout(currentTimeout);
            }}
          >
            undo
          </button>
        </div>
      </main>
    </>
  );
}
