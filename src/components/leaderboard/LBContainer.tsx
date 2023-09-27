import { useState } from "react";
import Bullet from "./Bullet";
import { api } from "~/utils/api";
import Blitz from "./Blitz";
import Rapid from "./Rapid";
import Puzzle from "./Puzzle";

const LBContainer = () => {
  //   const { data } = api.leaderboard.getBullet.useQuery();
  //   console.log(data);

  function shortenString(str) {
    if (str.length <= 10) {
      // If the string is 10 characters or shorter, return it as is.
      return str;
    } else {
      // If the string is longer than 10 characters, extract the first 5, add '...', and append the last 5 characters.
      const firstFive = str.slice(0, 5);
      const lastFive = str.slice(-5);
      return `${firstFive}...${lastFive}`;
    }
  }

  const [page, setPage] = useState("Bullet");
  return (
    <div className=" h-[calc(100vh-157px)] w-full">
      <div className="flex h-full w-full flex-col justify-evenly p-4">
        <div className="flex h-auto w-full cursor-pointer justify-evenly">
          <div
            className={`text-yellow border-yellow flex items-center  border px-3 py-2 text-2xl lg:px-12  ${
              page === "Bullet" ? "bg-black " : ""
            }`}
            onClick={() => {
              setPage("Bullet");
            }}
          >
            Bullet
          </div>
          <div
            className={`text-yellow border-yellow flex items-center  border px-3 py-2 text-2xl lg:px-12  ${
              page === "Blitz" ? "bg-black " : ""
            }`}
            onClick={() => {
              setPage("Blitz");
            }}
          >
            Blitz
          </div>
          <div
            className={`text-yellow border-yellow flex items-center  border px-3 py-2 text-2xl lg:px-12  ${
              page === "Rapid" ? "bg-black " : ""
            }`}
            onClick={() => {
              setPage("Rapid");
            }}
          >
            Rapid
          </div>
          <div
            className={`text-yellow border-yellow flex items-center  border px-3 py-2 text-2xl lg:px-12  ${
              page === "Puzzle" ? "bg-black " : ""
            }`}
            onClick={() => {
              setPage("Puzzle");
            }}
          >
            Puzzle
          </div>
        </div>
        {page === "Bullet" && <Bullet />}
        {page === "Rapid" && <Rapid />}
        {page === "Blitz" && <Blitz />}
        {page === "Puzzle" && <Puzzle />}
      </div>
    </div>
  );
};

export default LBContainer;
