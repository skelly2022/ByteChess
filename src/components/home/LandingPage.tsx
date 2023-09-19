"use client";
import usePlayModal from "src/hooks/usePlayModal";
import Container from "../Container";
import PlayVsPlay from "./PlayVsPlay";
import { useEffect } from "react";
import BlockChain from "./BlockChain";

const LandingPage = () => {
  return (
    <div className=" flex h-screen pt-28 text-white ">
      <div className=" flex w-screen flex-row justify-evenly ">
        <div className="flex h-full w-full flex-col md:w-1/2 ">
          <PlayVsPlay />
        </div>
        {/* <div className="hidden md:flex md:w-1/3 ">
          <BlockChain />
        </div> */}
      </div>
    </div>
  );
};

export default LandingPage;
