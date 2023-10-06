"use client";
import usePlayModal from "src/hooks/usePlayModal";
import Container from "../Container";
import PlayVsPlay from "./PlayVsPlay";
import { useEffect } from "react";
import BlockChain from "./BlockChain";

const LandingPage = () => {
  return (
    <div className=" relative flex h-full w-full  flex-col text-white">
      <div className="flex h-auto w-full flex-col ">
        <div className="  flex h-auto w-full items-center justify-center ">
          <div
            style={{
              fontFamily: "",
              fontWeight: 800,
              wordWrap: "break-word",
            }}
            className="  absolute top-0 pl-4 text-[100px] text-black md:text-[150px]"
          >
            CHESS
          </div>
          <div
            style={{
              fontFamily: "",
              fontWeight: 800,
              wordWrap: "break-word",
            }}
            className="absolute top-0  text-[100px] text-yellow md:text-[150px]"
          >
            CHESS
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
