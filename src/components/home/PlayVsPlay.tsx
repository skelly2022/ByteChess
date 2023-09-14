import * as Tabs from "@radix-ui/react-tabs";
import { useRouter } from "next/navigation";
import { BiColor, BiSolidCircle } from "react-icons/bi";
import usePlayModal from "~/hooks/usePlayModal";
import useUserStore from "~/hooks/useUserStore";
import { api } from "~/utils/api";

const dataOptions = [
  { dataId: "1+0", clock: "1+0", perf: "Bullet" },
  { dataId: "2+1", clock: "2+1", perf: "Bullet" },
  { dataId: "3+0", clock: "3+0", perf: "Blitz" },
  { dataId: "3+2", clock: "3+2", perf: "Blitz" },
  { dataId: "5+0", clock: "5+0", perf: "Blitz" },
  { dataId: "5+3", clock: "5+3", perf: "Blitz" },
  { dataId: "10+0", clock: "10+0", perf: "Rapid" },
  { dataId: "10+5", clock: "10+5", perf: "Rapid" },
  { dataId: "15+10", clock: "15+10", perf: "Rapid" },
  { dataId: "30+0", clock: "30+0", perf: "Classical" },
  { dataId: "30+20", clock: "30+20", perf: "Classical" },
  { dataId: "custom", clock: "Custom", perf: null },
];

const PlayVsPlay = () => {
  const play = usePlayModal();
  const { data } = api.games.getAllGames.useQuery();
  const router = useRouter();
  return (
    <div>
      <Tabs.Root
        className="flex h-full w-full flex-col text-black "
        defaultValue="tab1"
      >
        <Tabs.List className="flex border-b">
          <Tabs.Trigger
            className=" flex h-[45px] flex-1
            cursor-default select-none items-center justify-center px-5 text-[15px] leading-none
             text-white outline-none first:rounded-tl-md last:rounded-tr-md
              data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative "
            value="tab1"
          >
            Quick Pairing
          </Tabs.Trigger>
          <Tabs.Trigger
            className="flex h-[45px] flex-1 cursor-default select-none items-center  justify-center
            px-5 text-[15px] leading-none text-white outline-none
            first:rounded-tl-md last:rounded-tr-md data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0]
            data-[state=active]:shadow-current data-[state=active]:focus:relative"
            value="tab2"
          >
            Lobby
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content
          className="h-[calc(100vh-157px)] grow outline-none "
          value="tab1"
        >
          <div className="grid h-[90%] w-full grid-cols-3 gap-2  p-3">
            {dataOptions.map((item) => (
              <div
                key={item.dataId}
                data-id={item.dataId}
                className=" flex flex-col items-center justify-center rounded-sm
                  bg-background hover:bg-foreground hover:text-white"
              >
                <div className="clock">{item.clock}</div>
                <div className="perf">{item.perf}</div>
              </div>
            ))}
          </div>
          <div className="flex h-[10%] w-full grow flex-row justify-center gap-2 ">
            <button className="h-10 w-48 rounded  bg-white px-2 py-1 font-bold text-black ">
              Play with a friend
            </button>
            <button
              className="h-10 w-48 rounded  bg-white px-2 py-1 font-bold text-black "
              onClick={() => {
                play.onOpen();
              }}
            >
              Create a game
            </button>
          </div>
        </Tabs.Content>
        <Tabs.Content
          className=" h-[calc(100vh-157px)] grow outline-none "
          value="tab2"
        >
          <div className="no-scrollbar grid h-[90%] w-auto overflow-scroll p-3">
            <table className=" text-white ">
              <thead className="  ">
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
              <tbody>
                {data !== undefined && (
                  <>
                    {data.map((game) => (
                      <tr
                        className="mt-2 flex h-8 w-full cursor-pointer bg-slate-200 text-black
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
              </tbody>
            </table>
          </div>
          <div className="flex h-[10%] w-full grow flex-row justify-center gap-2 ">
            <button className="h-10 w-48 rounded  bg-white px-2 py-1 font-bold text-black ">
              Play with a friend
            </button>
            <button
              className="h-10 w-48 rounded  bg-white px-2 py-1 font-bold text-black "
              onClick={() => {
                play.onOpen();
              }}
            >
              Create a game
            </button>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default PlayVsPlay;
