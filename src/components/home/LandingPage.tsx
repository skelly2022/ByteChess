"use client";
import usePlayModal from "src/hooks/usePlayModal";
import Container from "../Container";
import PlayVsPlay from "./PlayVsPlay";
import { useEffect } from "react";
import BlockChain from "./BlockChain";

const LandingPage = () => {
  const play = usePlayModal();
  useEffect(() => {
    play.setOpponent({
      id: "",
      walletAddress: "",
      puzzleRating: 1200,
      bulletRating: 1200,
      blitzRating: 1200,
      rapidRating: 1200,
      createdAt: "",
      completedPuzzles: [],
    });
  }, []);
  return (
    <div className=" flex h-screen pt-28 text-white ">
      <div className=" flex w-screen flex-row ">
        <div className="hidden w-1/4 lg:flex "></div>
        <div className="flex h-full w-full flex-col md:w-1/2 ">
          <PlayVsPlay />
        </div>
        <div className="hidden h-full w-full flex-col md:flex md:w-1/2 ">
          <BlockChain />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
