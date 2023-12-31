//@ts-nocheck
import { useState, useEffect } from "react";
import Bullet from "./Bullet";
import { api } from "~/utils/api";

import useUserModal from "~/hooks/useUserStore";

import { useRouter } from "next/router";
const defaultUser = {
  avatar: "path_to_default_avatar.jpg",
  name: "John Doe",
  discord: "John#1234",
  twitter: "@johndoe",
  walletAddress: "DefaultWalletAddress1234567890",
  trophies: 0,
  bulletRating: 1200,
  blitzRating: 1200,
  rapidRating: 1200,
  puzzleRatingChain: 1500,
  completedPuzzles: [],
};
const LBContainer = () => {
  const [page, setPage] = useState("1v1");
  const user = useUserModal();
  const router = useRouter();
  const [searchFocus, setSearchFocus] = useState(false);
  const [bulletData, setBulletData] = useState([]);
  const [rapidData, setRapidData] = useState([]);
  const [blitzData, setBlitzData] = useState([]);
  const [puzzleData, setPuzzleData] = useState([]);
  const currentUser = user?.user || defaultUser; // Use user data if it exists, otherwise use hardcoded data
  console.log(currentUser.avatar);

  const data = api.leaderboard.getRatings.useMutation({
    async onSuccess(data) {
      console.log(data);
      setBulletData(data.bullet);
      setBlitzData(data.blitz);
      setPuzzleData(data.puzzle);
      setRapidData(data.rapid);
    },
  });
  function extractFirstAndLast5Characters(inputString) {
    const first5 = inputString.substring(0, 5);
    const last5 = inputString.substring(inputString.length - 5);
    return `${first5}..${last5}`;
  }
  console.log(user);
  useEffect(() => {
    data.mutateAsync();
  }, []);
  return (
    <div className="flex h-[calc(100vh-112px)] w-full flex-col items-center justify-center gap-4 p-4 ">
      <div className="flex h-auto w-full gap-4 rounded-xl bg-yellow">
        <div className="flex h-16 w-full items-center justify-between  bg-yellow px-3">
          <div className="">
            {extractFirstAndLast5Characters(currentUser.walletAddress)}
          </div>

          {!searchFocus && (
            <div className="flex cursor-pointer gap-3 bg-green px-1 py-2">
              <h1
                onClick={() => setPage("1v1")}
                className={`  rounded-xl px-2 py-1 ${
                  page === "1v1" ? "bg-yellow" : ""
                } `}
              >
                1v1{" "}
              </h1>
              <h1
                onClick={() => setPage("Puzzles")}
                className={`  rounded-xl px-2 py-1 ${
                  page === "Puzzles" ? "bg-yellow" : ""
                } `}
              >
                Puzzles{" "}
              </h1>
              <h1
                onClick={() => router.push("/dashboard")}
                className={`  rounded-xl px-2 py-1 ${
                  page === "Nfts" ? "bg-yellow" : ""
                } `}
              >
                NFTs
              </h1>
            </div>
          )}
        </div>
      </div>
      <div className="flex h-auto w-full grow flex-col items-center justify-center gap-3 md:flex-row-reverse">
        {page === "1v1" && (
          <>
            {" "}
            <div className="flex h-auto w-full grow flex-col items-center	 justify-between gap-3  py-4">
              <div className=" flex  w-full grow flex-row rounded-xl bg-yellow md:flex md:flex-col">
                {/* Profile Picture */}
                <div className="z-10 flex items-center justify-center p-4">
                  <img
                    src="https://ipfs.io/ipfs/QmQ5TWTtXoKeupMucMUuss8pCbt3ZyyfV3frCKPjzzJXQf/3597.png"
                    alt="Profile"
                    className="h-32 w-32 rounded-full "
                  />
                </div>

                {/* 1v1 Ratings */}
                <div className="flex flex-col  p-4">
                  <h2 className="mb-3 text-xl font-bold">1v1 Ratings</h2>
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between">
                      <span>Bullet:</span>
                      <span>{user.user.bulletRating}</span>{" "}
                    </div>
                    <div className="flex justify-between">
                      <span>Blitz:</span>
                      <span>{user.user.blitzRating}</span>{" "}
                    </div>
                    <div className="flex justify-between">
                      <span>Rapid:</span>
                      <span>{user.user.rapidRating}</span>{" "}
                    </div>
                  </div>
                </div>

                <div className="w-1/3 p-4 md:w-full">
                  <h2 className="mb-3 text-xl font-bold">Trophies</h2>
                </div>
              </div>
            </div>
            <div className="no-scrollbar flex h-full w-auto flex-wrap gap-3   border-b md:flex-nowrap ">
              <Bullet players={bulletData} title="Bullet" />
              <Bullet players={blitzData} title="Blitz" />
              <Bullet players={rapidData} title="Rapid" />
            </div>
          </>
        )}
        {page === "Puzzles" && (
          <>
            {" "}
            <div className="flex w-full gap-3  py-0  md:w-1/2">
              <div className="flex h-auto w-full md:max-w-fit flex-col	justify-start gap-3   py-4">
                <div className=" flex h-auto w-auto  items-center justify-center flex-row rounded-xl bg-yellow md:flex md:flex-col">
                  <div className="z-10 flex items-center justify-center p-4">
                    <img
                      src="https://ipfs.io/ipfs/QmQ5TWTtXoKeupMucMUuss8pCbt3ZyyfV3frCKPjzzJXQf/3597.png"
                      alt="Profile"
                      className="h-32 w-32 rounded-full "
                    />
                  </div>

                  <div className="flex flex-col items-center justify-center p-4">
                    <h2 className="mb-3 text-xl font-bold">Rating: 1200</h2>
                    <h2 className="mb-3 text-xl font-bold">Played: 453</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="no-scrollbar flex h-full w-full flex-wrap justify-end  gap-3 md:w-1/2 ">
              <Bullet players={puzzleData} title="Puzzles" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LBContainer;
