import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import Loading from "../Loading";

const Rapid = () => {
  const [dataRapid, setData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const data = api.leaderboard.getRapid.useMutation({
    onSuccess(data) {
      setData(data);
      setLoading(false);
    },
    onError(error) {
      console.log(error);
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
    <table className=" h-full text-white ">
      <thead className="  ">
        <tr className=" flex h-10 w-full items-center bg-yellow py-6 text-xl font-bold text-black  ">
          <td className="flex w-full items-center justify-center text-2xl font-black">
            Rapid
          </td>
        </tr>
      </thead>
      <tbody className="no-scrollbar flex h-full flex-col overflow-scroll">
        {loading ? (
          <Loading />
        ) : (
          <>
            {dataRapid.map((player, index) => (
              <tr
                className="flex h-16 w-full cursor-pointer border border-yellow  p-2 text-black
         "
                key={player.walletAddress}
              >
                <td className="flex items-center justify-center p-2 text-lg font-black">
                  #{index + 1}
                </td>
                <td className="flex items-center justify-center p-2 text-lg font-black">
                  <img
                    className="w-[45px] rounded-full"
                    src={player.avatar}
                    alt={player.user}
                  ></img>
                </td>
                <td className="grid items-center justify-items-center  ">
                  {shortenString(player.walletAddress)}
                  <span className="font-black text-yellow">
                    {" "}
                    {player.puzzleRating}
                  </span>
                </td>
              </tr>
            ))}
          </>
        )}
      </tbody>
      <tfoot>
        <tr
          className="flex h-16 w-full cursor-pointer border border-yellow bg-black p-2 text-green"
          key="ss"
        >
          <td className="flex items-center justify-center p-2 text-lg font-black">
            #3
          </td>
          <td className="flex items-center justify-center p-2 text-lg font-black">
            <img
              className="w-[45px] rounded-full"
              src="https://ipfs.io/ipfs/QmQ5TWTtXoKeupMucMUuss8pCbt3ZyyfV3frCKPjzzJXQf/3597.png"
              alt="{player.user}"
            ></img>
          </td>
          <td className="grid items-center justify-items-center">
            grkas.aYkas
            <span className="font-black text-yellow">6969</span>
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

export default Rapid;
