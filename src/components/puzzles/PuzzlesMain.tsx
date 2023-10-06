// @ts-nocheck
import useUserStore from "src/hooks/useUserStore";
import ChessPuzzle from "./ChessPuzzle";
import ChessPuzzleDash from "./ChessPuzzleDash";
import { api } from "src/utils/api";
import usePuzzleStore from "src/hooks/usePuzzleStore";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { AccountInfo, PublicKey, SystemProgram } from "@solana/web3.js";
import { toast } from "react-hot-toast";
import { program, connection } from "../../anchor/setup";
import { getSideToPlayFromFen } from "~/utils/chessPuzzle/chessTactics";
import { BN } from "@coral-xyz/anchor";

const PuzzlesMain = () => {
  const puzzle = usePuzzleStore();
  const user = useUserStore();
  const { publicKey, sendTransaction } = useWallet();
  const [puzzleData, setPuzzleData] = useState(null);
  const [loading, setLoading] = useState(puzzle.loading);
  const [sideToPlay, setSideToPlay] = useState("");

  const [moveArray, setMoveArray] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const updateUser = api.example.updateUser.useMutation({
    onSuccess(data, variables, context) {},
  });
  const getPuzzle = api.puzzles.getRandomPuzzle.useMutation({
    async onSuccess(result) {
      setPuzzleData(result);
      if (getSideToPlayFromFen(result.FEN) === "w") {
        setSideToPlay("b");
      } else {
        setSideToPlay("w");
      }
      setLoading(true);
      const solutionMoves = result?.Moves.split(" ");
      setMoveArray(solutionMoves);
    },
    async onError(result) {},
  });

  const onFalse = api.puzzles.onFail.useMutation({
    async onSuccess(data) {
      puzzle.setMoves([]);
      puzzle.setPuzzleFens([]);
      user.setUser(data);
      getPuzzle.mutateAsync({ address: publicKey.toBase58(), id: "" });
    },
  });
  const onCorrect = api.puzzles.onSuccess.useMutation({
    async onSuccess(data) {
      puzzle.setMoves([]);
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
  const changeMode = async () => {
    if (user.user.ratedAccount) {
      puzzle.setMoves([]);
      puzzle.setRanked(!puzzle.ranked);
      setChecked(!checked);
      getPuzzle.mutateAsync({
        address: publicKey.toBase58(),
        id: puzzleData?.PuzzleId,
      });
    } else {
      if (publicKey) {
        try {
          const data = new BN(1200);
          setChecked(false);

          const [globalLevel1GameDataAccount, bump] =
            PublicKey.findProgramAddressSync(
              [Buffer.from("level1", "utf8"), publicKey.toBuffer()],
              program.programId,
            );
          const transaction = await program.methods
            .initialize(data)
            .accounts({
              newAccount: globalLevel1GameDataAccount,
              signer: publicKey,
              systemProgram: SystemProgram.programId,
            })
            .transaction();
          const txSig = await sendTransaction(transaction, connection);

          const { blockhash, lastValidBlockHeight } =
            await connection.getLatestBlockhash();

          const x = await connection.confirmTransaction({
            blockhash,
            lastValidBlockHeight,
            signature: txSig,
          });
          updateUser.mutateAsync({ address: publicKey.toBase58() });
        } catch (error) {
          toast.error("Must create on chain account");
        }
      } else {
      }
    }
  };
  useEffect(() => {
    // const data = { address: publicKey.toBase58() };
    if (publicKey !== null) {
      getPuzzle.mutateAsync({
        address: publicKey.toBase58(),
        id: "",
      });
    }
  }, [publicKey]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center  md:flex-row  md:gap-3">
      {loading ? (
        <>
          <div className="flex h-auto w-full  justify-center  md:h-full md:w-auto">
            <ChessPuzzle
              fen={puzzleData?.FEN}
              solution={moveArray}
              correct={correct}
              inCorrect={inCorrect}
              sideToPlay={sideToPlay}
            />
          </div>
          <div className="  flex h-auto w-full grow  items-center md:h-full md:w-1/3  md:grow-0">
            <ChessPuzzleDash
              rating={puzzleData?.Rating}
              fen={puzzleData?.FEN}
              solution={moveArray}
              changeMode={changeMode}
              checked={checked}
            />
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default PuzzlesMain;
