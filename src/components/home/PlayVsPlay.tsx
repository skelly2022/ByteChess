import * as Tabs from "@radix-ui/react-tabs";
import { useRouter } from "next/navigation";
import { BiColor, BiSolidCircle } from "react-icons/bi";
import usePlayModal from "~/hooks/usePlayModal";
import useUserStore from "~/hooks/useUserStore";
import { api } from "~/utils/api";

const dataOptions = [
  { dataId: "1+0", clock: "1+0", perf: "Bullet" },
  { dataId: "3+2", clock: "3+2", perf: "Blitz" },
  { dataId: "15+10", clock: "15+10", perf: "Rapid" },
  { dataId: "∞", clock: "∞", perf: "Unlimited" },
];

const PlayVsPlay = () => {
  const play = usePlayModal();
  const { data } = api.games.getAllGames.useQuery();
  const router = useRouter();
  return (
    <div className="flex h-[90%] w-[90%] items-center justify-center rounded-lg bg-green p-3 lg:w-1/2">
      <Tabs.Root
        className=" flex h-full w-full flex-col justify-center text-green"
        defaultValue="tab1"
      >
        <Tabs.List className="flex border-b text-yellow">
          <Tabs.Trigger
            className=" flex h-[45px] flex-1 
            cursor-default select-none items-center justify-center px-5 text-[15px] leading-none
              outline-none first:rounded-tl-md last:rounded-tr-md
              data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative "
            value="tab1"
          >
            Quick Pairing
          </Tabs.Trigger>
          <Tabs.Trigger
            className=" flex h-[45px] flex-1 cursor-default select-none  items-center
            justify-center px-5 text-[15px] leading-none outline-none
            first:rounded-tl-md last:rounded-tr-md data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]
            data-[state=active]:shadow-current data-[state=active]:focus:relative"
            value="tab2"
          >
            Lobby
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className=" h-full grow outline-none " value="tab1">
          <div className="grid h-auto w-full grid-cols-2 gap-2  p-3">
            {dataOptions.map((item) => (
              <div
                key={item.dataId}
                data-id={item.dataId}
                className=" flex h-[115px] flex-col items-center justify-center
                  rounded-sm bg-yellow hover:bg-green hover:text-yellow"
              >
                <div className="clock">{item.clock}</div>
                <div className="perf">{item.perf}</div>
              </div>
            ))}
          </div>
          <div className="flex h-auto w-full grow flex-row justify-center gap-2 ">
            <button className="h-10 w-48 rounded  bg-yellow px-2 py-1 font-bold text-green">
              Play with a friend
            </button>
            <button
              className="h-10 w-48 rounded  bg-yellow px-2 py-1 font-bold text-green "
              onClick={() => {
                play.onOpen();
              }}
            >
              Create a game
            </button>
          </div>
        </Tabs.Content>
        <Tabs.Content className=" h-full grow outline-none " value="tab2">
          <div className="  no-scrollbar grid h-full max-h-[90%] w-full overflow-scroll   ">
            <table className=" h-full w-full  text-white">
              <thead className=" h-1/6 ">
                <tr className="flex h-10 w-full items-center ">
                  <td className="flex w-1/4 items-center justify-center">
                    Color
                  </td>
                  <td className="flex w-1/4 items-center justify-center">
                    Rating
                  </td>
                  <td className="flex w-1/4 items-center justify-center">
                    Time
                  </td>
                  <td className="flex w-1/4 items-center justify-center">
                    Mode
                  </td>
                </tr>
              </thead>
              <div className="no-scrollbar h-full w-full overflow-scroll ">
                {data !== undefined && (
                  <>
                    {data.map((game) => (
                      <tr
                        className=" flex w-full cursor-pointer  text-black
                          hover:bg-slate-100"
                        key={game.id}
                        onClick={() => {
                          router.push(`/play/${game.id}`);
                        }}
                      >
                        <td className="flex w-1/4 items-center justify-center">
                          {game.Color === "white" && (
                            <BiSolidCircle color="black" size={20} />
                          )}
                          {game.Color === "black" && (
                            <BiSolidCircle color="white" size={20} />
                          )}
                        </td>
                        <td className="flex w-1/4 items-center justify-center">
                          {game.Rating}
                        </td>
                        <td className="flex w-1/4 items-center justify-center">
                          {game.Time}
                        </td>
                        <td className="flex w-1/4 items-center justify-center">
                          {game.Mode}
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </div>
            </table>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default PlayVsPlay;
