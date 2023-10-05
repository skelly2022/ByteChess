"use client";
import usePlayModal from "src/hooks/usePlayModal";
import Container from "../Container";
import PlayVsPlay from "./PlayVsPlay";
import { useEffect } from "react";
import BlockChain from "./BlockChain";

const LandingPage = () => {
  return (
    <div className=" flex h-[calc(100vh-96px)] w-full text-white ">
      <div className=" flex h-full w-full flex-row justify-evenly ">
        <div className="flex h-full w-full flex-col gap-5">
          <div className="flex h-[40%] w-full flex-col">
            <div className=" relative flex h-auto w-full items-center justify-center">
              <div
                style={{
                  fontFamily: "",
                  fontWeight: 800,
                  wordWrap: "break-word",
                }}
                className="  top-0 pl-8 text-[130px] text-black md:text-[150px]"
              >
                CHESS
              </div>
              <div
                style={{
                  fontFamily: "",
                  fontWeight: 800,
                  wordWrap: "break-word",
                }}
                className="absolute top-0  text-[130px] text-yellow md:text-[150px]"
              >
                CHESS
              </div>
            </div>
            <div className="z-10 flex h-auto w-full items-center justify-center">
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
              <div className="h-[2px] w-16 bg-black"></div>
              <div className=" flex h-16 w-auto items-center justify-center rounded-2xl bg-black px-2 text-yellow">
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
          </div>
          <div className="flex h-[60%] w-full items-center justify-center md:pt-4">
            <PlayVsPlay />
          </div>
        </div>
        {/* <div className="hidden md:flex md:w-1/3 ">
          <BlockChain />
        </div> */}
      </div>
    </div>
  );
};

export default LandingPage;
