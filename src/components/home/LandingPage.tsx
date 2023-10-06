"use client";
import usePlayModal from "src/hooks/usePlayModal";
import Container from "../Container";
import PlayVsPlay from "./PlayVsPlay";
import { useEffect } from "react";
import BlockChain from "./BlockChain";

const LandingPage = () => {
  return (
    <div className="  flex h-full w-full  flex-col text-white">
      <div className=" flex h-1/5 w-full flex-col ">
        <div className=" flex h-full w-full items-center justify-center ">
          <h1
            className=" text-[100px] font-extrabold text-yellow"
            style={{
              textShadow: `
                3px 3px 0px #000,
                6px 6px 0px rgba(0, 0, 0, 0.7),
                9px 9px 0px rgba(0, 0, 0, 0.5),
                12px 12px 15px rgba(0, 0, 0, 0.3)
              `,
            }}
          >
            {" "}
            CHESS
          </h1>
        </div>
      </div>
      <div className="flex h-auto w-full items-center justify-center">
        <div className="h-16 w-16 ">
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "#1D5951",
              borderRadius: "50%",
              border: "2px black solid",
            }}
            className=" flex items-center justify-center"
          >
            <div
              style={{
                width: "25%",
                height: "25%",
                borderRadius: "50%",
                border: "2px black solid",
              }}
              className=" bg-black"
            />
          </div>
        </div>
        <div className="l h-[2px] w-16 bg-black"></div>
        <div className=" flex h-16 w-auto items-center justify-center rounded-2xl bg-black px-4 text-yellow">
          {" "}
          <h1
            style={{
              fontSize: "40px",
              fontFamily: "",
              fontWeight: 800,
              wordWrap: "break-word",
            }}
          >
            Chain
          </h1>
        </div>
      </div>
      <div className="flex h-auto w-full grow items-center justify-center ">
        <PlayVsPlay />
      </div>
    </div>
  );
};

export default LandingPage;
