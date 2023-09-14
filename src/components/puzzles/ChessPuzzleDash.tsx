//@ts-nocheck

import * as Switch from "@radix-ui/react-switch";
import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import usePuzzleStore from "~/hooks/usePuzzleStore";
import useUserStore from "~/hooks/useUserStore";
import dynamic from "next/dynamic";
import AnimatedNumber from "../animated/AnimatedNumber";
import Assets from "../../helpers/assets";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { program, connection } from "../../anchor/setup";
import { deserialize } from "v8";
import { api } from "src/utils/api";
import { BN } from "@coral-xyz/anchor";

const { whiteStyle, blackStyle } = Assets;

const AnimatedNumbers = dynamic(() => import("react-animated-numbers"), {
  ssr: false,
});
interface PuzzleDashProps {
  rating?: string;
  fen?: string;
  solution?: Array<String>;
  changeMode: () => void;
}

const ChessPuzzleDash: React.FC<PuzzleDashProps> = ({
  rating,
  solution,
  fen,
  changeMode,
}) => {
  const { publicKey, sendTransaction, signMessage } = useWallet();

  const puzzle = usePuzzleStore();
  const user = useUserStore();

  const [currentMove, setCurrentMove] = useState();
  const [movesNow, setMoves] = useState([]);

  const updateChainRating = api.puzzles.updateRatingChain.useMutation({
    async onSuccess(result) {
      user.setUser(result);
    },
  });

  const updateRating = api.puzzles.updateRating.useMutation({
    async onSuccess(result) {
      user.setUser(result);
      const [globalLevel1GameDataAccount, bump] =
        PublicKey.findProgramAddressSync(
          [Buffer.from("level1", "utf8"), publicKey.toBuffer()],
          program.programId,
        );
      const data = new BN(result.puzzleRating);

      const transaction = await program.methods
        .updateRating(data)
        .accounts({
          newAccount: globalLevel1GameDataAccount,
        })
        .transaction();
      try {
        const txSig = await sendTransaction(transaction, connection);
        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash();
        const x = await connection.confirmTransaction({
          blockhash,
          lastValidBlockHeight,
          signature: txSig,
        });
        updateChainRating.mutateAsync({
          address: publicKey.toBase58(),
          rating: result.puzzleRatingChain,
        });
      } catch (error) {}
    },
    async onError(result) {},
  });

  useEffect(() => {}, [puzzle.moves]);

  useEffect(() => {
    const puzzleFens = puzzle.puzzleFens;
    const currentFen = puzzle.puzzleFen;
    //@ts-ignore
    const length = puzzleFens.length;
    const index = puzzleFens.indexOf(currentFen);
    const downHandler = ({ key }: { key: string }) => {
      if (key === "ArrowLeft") {
        if (index > 0) {
          puzzle.setPuzzle(puzzleFens[index - 1]);
        }
      }
      if (key === "ArrowRight") {
        if (index + 1 < length) {
          puzzle.setPuzzle(puzzleFens[index + 1]);
        }
      }
    };
    window.addEventListener("keydown", downHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, [puzzle.puzzleFen, puzzle.puzzleFens]);
  useEffect(() => {
    if (puzzle.sign === "show") {
      handleClickInitialize();
    }
    puzzle.setSign("");
  }, [puzzle.sign]);
  async function handleClickInitialize() {
    updateRating.mutateAsync({ address: publicKey.toBase58() });
  }
  return (
    <div className="flex h-full w-full flex-col ">
      <div className="md: flex h-auto flex-wrap  justify-center gap-3 md:flex-col  md:flex-nowrap md:justify-between">
        <div className=" flex h-auto w-full flex-col bg-white shadow ">
          <div className=" flex h-full w-full transform flex-col items-center justify-center">
            {!puzzle.ranked && (
              <>
                <h1>Current Rating</h1>
                <AnimatedNumber number={user.user.puzzleRating} />
              </>
            )}
            {puzzle.ranked && (
              <>
                <h1>Current Rating</h1>
                <AnimatedNumber number={user.user.puzzleRatingChain} />
              </>
            )}
          </div>
        </div>
        <div className="flex h-20 w-[45%] items-center justify-evenly rounded-sm  bg-white shadow md:w-full">
          <div className="flex items-center">
            <label
              className="pr-[15px] text-[15px]  text-black"
              htmlFor="airplane-mode"
            >
              Ranked
            </label>
            <Switch.Root
              className="relative h-[25px] w-[42px]
             cursor-default rounded-full text-black shadow-[0_2px_10px] outline-none 
             data-[state=checked]:bg-success"
              id="airplane-mode"
              onClick={() => {
                puzzle.setRanked(!puzzle.ranked);
                changeMode();
              }}
            >
              <Switch.Thumb
                className="shadow-blackA7 block h-[21px] w-[21px] 
            translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] transition-transform
             duration-100 will-change-transform data-[state=checked]:translate-x-[19px]"
              />
            </Switch.Root>
          </div>
          {puzzle.ranked && <div className="">{user.user.puzzleCount}/5</div>}
          <button
            className="bg-success "
            onClick={() => {
              handleClickInitialize();
            }}
          >
            UR
          </button>
        </div>
        <div className=" h-20 w-[45%] bg-white shadow md:h-1/2 md:w-full">
          <div className=" flex h-full w-full flex-col items-center justify-center ">
            <h1> Puzzle Rating: {rating}</h1>
            <div className="flex items-center">
              {puzzle.side == "w" && <div style={whiteStyle}></div>}
              {puzzle.side == "b" && <div style={blackStyle}></div>}
              <div className="flex flex-col">
                {" "}
                <h1>Your turn</h1>
              </div>
            </div>
          </div>
          <table className="hidden w-full border bg-white md:block">
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChessPuzzleDash;
