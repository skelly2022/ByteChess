import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import Loading from "../Loading";
import { User } from "../../types/games";

interface LeaderboardProps {
  players?: User[];
  title: string;
}
const Bullet: React.FC<LeaderboardProps> = ({ players, title }) => {
  const [dataBullet, setData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  console.log(players);
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

  return (
    <table className=" h-full  w-full text-white md:w-auto lg:min-w-[329px]">
      <thead className="  ">
        <tr className=" flex h-10 w-full items-center bg-yellow py-6 text-xl font-bold text-black  ">
          <td className="flex w-full items-center justify-center text-2xl font-black">
            {title}
          </td>
        </tr>
      </thead>
      <tbody className="no-scrollbar flex h-full flex-col overflow-scroll">
        {players.map((player, index) => (
          <tr
            className="flex h-16 w-full cursor-pointer justify-evenly border  border-yellow p-2 text-black
           "
            key={player.walletAddress}
          >
            <td className="flex items-center justify-center p-2 text-lg font-black">
              #{index + 1}
            </td>
            <td className="flex items-center justify-center p-2 text-lg font-black">
              <img className="w-[45px] rounded-full" src={player.avatar}></img>
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
      </tbody>
    </table>
  );
};

export default Bullet;
