import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import Loading from "../Loading";

const Puzzle = () => {
  const [dataPuzzle, setData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const data = api.leaderboard.getPuzzle.useMutation({
    onSuccess(data) {
      setData(data);
      setLoading(false);
    },
  });
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

  useEffect(() => {
    data.mutateAsync();
  }, []);

  return (
    <div className="no-scrollbar grid h-5/6 w-full overflow-auto  p-3">
      <table className=" text-white ">
        <thead className="  ">
          <tr className="bg-yellow text-green my-2 flex h-10 w-full items-center py-10 text-xl font-bold ">
            <td className="flex w-1/3 items-center justify-center">Rank</td>
            <td className="flex w-1/3 items-center justify-center">User</td>
            <td className="flex w-1/3 items-center justify-center">Rating</td>
          </tr>
        </thead>
        <tbody className="">
          {loading ? (
            <Loading />
          ) : (
            <>
              {dataPuzzle.map((player, index) => (
                <tr
                  className="border-yellow flex h-16 w-full cursor-pointer border  text-black
        "
                  key={player.walletAddress}
                >
                  <td className="flex w-1/3 items-center justify-center">
                    #{index + 1}
                  </td>
                  <td className="flex w-1/3 items-center justify-center">
                    {shortenString(player.walletAddress)}
                  </td>
                  <td className="flex w-1/3 items-center justify-center">
                    {player.puzzleRating}
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Puzzle;
