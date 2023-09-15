"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import ClientOnly from "src/components/ClientOnly";
import Navbar from "src/components/navbar/Navbar";
import PuzzlesMain from "src/components/puzzles/PuzzlesMain";
import ToasterProvider from "src/providers/ToasterProvider";
import usePuzzleStore from "~/hooks/usePuzzleStore";

type Page = {
  Page: string;
};

const Home: React.FC<Page> = ({ Page }) => {
  const { publicKey } = useWallet();
  const puzzle = usePuzzleStore();
  const router = useRouter();

  useEffect(() => {
    puzzle.setPuzzleFens([]);
    puzzle.setMoves([]);
    puzzle.setRanked(false);
  }, []);
  // useEffect(() => {
  //   if (publicKey === null) {
  //     router.push("/");
  //     toast.error("Please connect wallet");
  //   }
  // }, []);
  return (
    <>
      <ClientOnly>
        <ToasterProvider />
        <Navbar />
      </ClientOnly>
      <main className="fixed min-h-screen bg-gray-900  pt-28 ">
        <PuzzlesMain />
      </main>
    </>
  );
};

export default Home;
