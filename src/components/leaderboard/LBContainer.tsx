import { useState } from "react";
import Bullet from "./Bullet";

const LBContainer = () => {
  //   const getAllBullets =

  const [page, setPage] = useState("Bullet");
  return (
    <div className="h-full w-full">
      <div className="h-full w-full p-4">
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
        {/* {page === "Bullet" && <Bullet />} */}
        <div className="flex h-auto w-full flex-col justify-center">
          <div className=" no-scrollbar  grid h-[90%] w-full overflow-scroll p-3">
            <table className=" text-white ">
              <thead className="  ">
                <tr className="flex h-10 w-full items-center ">
                  <td className="flex w-1/3 items-center justify-center">
                    Rank
                  </td>
                  <td className="flex w-1/3 items-center justify-center">
                    User
                  </td>
                  <td className="flex w-1/3 items-center justify-center">
                    Time
                  </td>
                </tr>
              </thead>
              <tbody>
                {/* {data !== undefined && (
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
                )} */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LBContainer;
