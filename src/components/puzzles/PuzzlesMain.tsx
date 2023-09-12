// @ts-nocheck
import useUserStore from "src/hooks/useUserStore";
import ChessPuzzle from "./ChessPuzzle";
import ChessPuzzleDash from "./ChessPuzzleDash";
import { api } from "src/utils/api";
import usePuzzleStore from "src/hooks/usePuzzleStore";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-hot-toast";
import { getAssets } from "~/hooks/useAssetsStore";
import { program } from "~/anchor/setup";

const PuzzlesMain = () => {
  const puzzle = usePuzzleStore();
  const user = useUserStore();
  const { publicKey } = useWallet();
  const [puzzleData, setPuzzleData] = useState(null);
  const [loading, setLoading] = useState(puzzle.loading);
  const [moveArray, setMoveArray] = useState<string[]>([]);
  const getPuzzle = api.puzzles.getRandomPuzzle.useMutation({
    async onSuccess(result) {
      setPuzzleData(result);
      setLoading(true);
      const solutionMoves = result?.Moves.split(" ");
      setMoveArray(solutionMoves);
    },
    async onError(result) {
      console.log(result);
    },
  });

  const onFalse = api.puzzles.onFail.useMutation({
    async onSuccess(data) {
      puzzle.setPuzzleMoves([]);
      puzzle.setPuzzleFens([]);
      user.setUser(data);
      getPuzzle.mutateAsync({ address: publicKey.toBase58(), id: "" });
    },
  });
  const onCorrect = api.puzzles.onSuccess.useMutation({
    async onSuccess(data) {
      console.log(data);
      puzzle.setPuzzleMoves([]);
      puzzle.setPuzzleFens([]);
      user.setUser(data);
      getPuzzle.mutateAsync({ address: publicKey.toBase58(), id: "" });
    },
  });

  const correct = async () => {
    if (user.user.puzzleCount === 5 && puzzle.ranked === true) {
      toast.error("Must submit rating to chain!");
      puzzle.setSign("show");
    } else {
      onCorrect.mutateAsync({
        address: publicKey.toBase58(),
        puzzleRating: puzzleData?.Rating,
        puzzleID: puzzleData?.PuzzleId,
        ranked: puzzle.ranked,
      });
    }
  };

  const inCorrect = () => {
    console.log(puzzle.ran);
    if (user.user.puzzleCount === 5 && puzzle.ranked === true) {
      toast.error("Must submit rating to chain!");
      puzzle.setSign("show");
    } else {
      onFalse.mutateAsync({
        address: publicKey.toBase58(),
        puzzleRating: puzzleData?.Rating,
        puzzleID: puzzleData?.PuzzleId,
        ranked: puzzle?.ranked,
      });
    }
  };
  const changeMode = () => {
    getPuzzle.mutateAsync({
      address: publicKey.toBase58(),
      id: puzzleData?.PuzzleId,
    });
  };
  useEffect(() => {
    // const data = { address: publicKey.toBase58() };
    console.log(publicKey);
    if (publicKey !== null) {
      getPuzzle.mutateAsync({
        address: publicKey.toBase58(),
        id: "",
      });
    }
  }, [publicKey]);

  return (
    <div className="flex h-[calc(100vh-130px)] w-screen flex-wrap justify-center gap-2 overflow-hidden pl-4 pr-4">
      {loading ? (
        <>
          <div className="h-auto w-auto md:h-full ">
            <ChessPuzzle
              fen={puzzleData?.FEN}
              solution={moveArray}
              correct={correct}
              inCorrect={inCorrect}
            />
          </div>
          <div className="h-auto w-full md:h-full md:w-1/4 ">
            <ChessPuzzleDash
              rating={puzzleData?.Rating}
              fen={puzzleData?.FEN}
              solution={moveArray}
              changeMode={changeMode}
            />
          </div>
        </>
      ) : (
        <div className="text-center">
          <div
            role="status"
            className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
          >
            <svg
              aria-hidden="true"
              className="fill-blue-600 mr-2 inline h-16 w-16 animate-spin text-gray-200 dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PuzzlesMain;
