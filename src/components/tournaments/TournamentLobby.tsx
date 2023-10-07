//@ts-nocheck
import { TournamentPlayer } from "../../types/games";
import assets from "~/helpers/assets";

const { extractFirstAndLast5Characters } = assets;

// Define the TournamentLobbyProps interface
interface TournamentLobbyProps {
  players: TournamentPlayer[]; // Use Tournament type here
}

const TournamentLobby: React.FC<TournamentLobbyProps> = ({ players }) => {
  console.log(players);
  return (
    <div className="h-[60%] w-full  ">
      <div className="h-full w-full  ">
        {players.map((player, index) => (
          <div
            key={index}
            className={`relative flex h-12 w-full items-center justify-start gap-3 pl-4 text-black ${
              index % 2 === 0 ? "bg-slate-50" : "bg-white"
            }`}
          >
            <div className=" flex items-start">
              {" "}
              <h1>{index + 1}.</h1>
              {extractFirstAndLast5Characters(player.walletAddress)}
            </div>
            <div className="absolute right-5">{player.result}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentLobby;
