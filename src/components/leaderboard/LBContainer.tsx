import { useState, useEffect } from "react";
import Bullet from "./Bullet";
import { api } from "~/utils/api";
import Blitz from "./Blitz";
import Rapid from "./Rapid";
import Puzzle from "./Puzzle";
import Loading from "../Loading";
import useUserModal from "~/hooks/useUserStore";
import { Session } from "inspector";
const LBContainer = () => {
  //   const { data } = api.leaderboard.getBullet.useQuery();
  //   console.log(data);
  const user = useUserModal();
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
  const [dataBullet, setDataBullet] = useState(undefined);

  const [dataPuzzle, setData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [dataBlitz, setDataBlitz] = useState(undefined);
  const [dataRapid, setDataRapid] = useState(undefined);
  const dataRapidRank = api.leaderboard.getRapid.useMutation({
    onSuccess(dataRapidRank) {
      setDataRapid(dataRapidRank);
      setLoading(false);
    },
  });
  const dataBlitzRank = api.leaderboard.getBlitz.useMutation({
    onSuccess(dataBlitzRank) {
      console.log(dataBlitzRank);
      setDataBlitz(dataBlitzRank);
      setLoading(false);
    },
  });
  const data = api.leaderboard.getPuzzle.useMutation({
    onSuccess(data) {
      setData(data);
      setLoading(false);
    },
  });
  const dataBulletRank = api.leaderboard.getBullet.useMutation({
    onSuccess(dataBulletRank) {
      setDataBullet(dataBulletRank);
      setLoading(false);
    },
  });
  useEffect(() => {
    data.mutateAsync();
    dataBulletRank.mutateAsync();
    dataBlitzRank.mutateAsync();
    dataRapidRank.mutateAsync();
  }, []);
  const [page, setPage] = useState("Bullet");
  return (
    <div className=" flex h-[calc(100vh-112px)] w-full flex-col gap-4  ">
      <div className="flex h-auto w-full flex-wrap items-center justify-center gap-4  ">
        <div
          className=" item-center flex h-[4rem] w-[40%] flex-col items-center justify-center rounded-sm bg-yellow md:h-[6rem]  md:w-[20%] "
          style={{
            boxShadow: "0px 3px 3px 4px rgb(0 0 0 / 65%)",
          }}
        >
          <h1>TOTAL PLAYED</h1>
          <h1>1000</h1>
        </div>
        <div
          className=" item-center flex h-[4rem] w-[40%] flex-col items-center justify-center rounded-sm bg-yellow md:h-[6rem]  md:w-[20%] "
          style={{
            boxShadow: "0px 3px 3px 4px rgb(0 0 0 / 65%)",
          }}
        >
          <h1>TOTAL PLAYED</h1>
          <h1>1000</h1>
        </div>
        <div
          className=" item-center flex h-[4rem] w-[40%] flex-col items-center justify-center rounded-sm bg-yellow md:h-[6rem]  md:w-[20%] "
          style={{
            boxShadow: "0px 3px 3px 4px rgb(0 0 0 / 65%)",
          }}
        >
          <h1>TOTAL PLAYED</h1>
          <h1>1000</h1>
        </div>
        <div
          className=" item-center flex h-[4rem] w-[40%] flex-col items-center justify-center rounded-sm bg-yellow md:h-[6rem]  md:w-[20%] "
          style={{
            boxShadow: "0px 3px 3px 4px rgb(0 0 0 / 65%)",
          }}
        >
          <h1>TOTAL PLAYED</h1>
          <h1>1000</h1>
        </div>
      </div>
      <div className="flex h-3/4 w-full  gap-3   md:h-5/6">
        <div className="flex h-full w-full flex-wrap items-center justify-center gap-2 ">
          <div className="no-scrollbar h-[85%] w-[48%] border-b  border-yellow  sm:w-auto">
            <Bullet />{" "}
          </div>
          <div className="no-scrollbar h-[85%] w-[48%] border-b  border-yellow  sm:w-auto">
            <Blitz />
          </div>
          <div className="no-scrollbar h-[85%] w-[48%] border-b  border-yellow  sm:w-auto">
            <Rapid />
          </div>
          <div className="no-scrollbar h-[85%] w-[48%] border-b  border-yellow  sm:w-auto">
            <Puzzle />
          </div>
        </div>
        {/* <div className="grid h-2/3 justify-center rounded-[60px] bg-yellow text-xl font-bold">
          <img
            src="https://ipfs.io/ipfs/QmQ5TWTtXoKeupMucMUuss8pCbt3ZyyfV3frCKPjzzJXQf/3597.png"
            className="grid w-[150px] justify-center justify-items-center rounded-full pt-4 align-middle"
          ></img>
          <h1>
            games Played:{" "}
            <span
              className="text-2xl font-black text-green"
              style={{ textShadow: "0px 0px 4px rgba(0, 0, 0, 0.20) " }}
            >
              5
            </span>
          </h1>
          <h1>
            Puzzles Played:{" "}
            <span
              className="text-2xl font-black text-green"
              style={{ textShadow: "0px 0px 4px rgba(0, 0, 0, 0.20) " }}
            >
              5
            </span>
          </h1>
          <h1>
            Puzzles Finished:{" "}
            <span
              className="text-2xl font-black text-green"
              style={{ textShadow: "0px 0px 4px rgba(0, 0, 0, 0.20) " }}
            >
              5
            </span>
          </h1>
          <h1>
            Games Won:{" "}
            <span
              className="text-2xl font-black text-green"
              style={{ textShadow: "0px 0px 4px rgba(0, 0, 0, 0.20) " }}
            >
              5
            </span>
          </h1>
          <h1>
            Games Lost:{" "}
            <span
              className="text-2xl font-black text-green"
              style={{ textShadow: "0px 0px 4px rgba(0, 0, 0, 0.20) " }}
            >
              5
            </span>
          </h1>
        </div> */}
      </div>
    </div>
  );
};

export default LBContainer;
