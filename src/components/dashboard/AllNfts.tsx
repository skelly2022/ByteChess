import { Chess } from "chess.js";
import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { AiFillHeart } from "react-icons/ai";
import Assets from "../../helpers/assets";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

function extractFirstAndLast5Characters(inputString) {
  const first5 = inputString.substring(0, 3);
  const last5 = inputString.substring(inputString.length - 3);
  return `${first5}..${last5}`;
}
interface AllNftsProps {
  nfts: any;
  onNftClick: any;
  handleLike: any;
}
const breakpoints = {
  small: 576,
  medium: 768,
  large: 992,
  extraLarge: 1200,
};
const AllNfts: React.FC<AllNftsProps> = ({ nfts, onNftClick, handleLike }) => {
  const [windowWidth, setWindowWidth] = useState(null);
  const [boardWrapper, setBoardWrapper] = useState({
    width: `80.33vh`,
  });
  const [localNfts, setLocalNfts] = useState(nfts);
  console.log(nfts);
  const getPgnFinalFen = (pgnString) => {
    try {
      const tempGame = new Chess();
      tempGame.loadPgn(pgnString);

      let side;
      if (tempGame.isCheckmate()) {
        side = tempGame.turn() === "w" ? "black" : "white";
      } else {
        side = "white"; // Default to white if the game isn't finished or ended differently
      }

      const fen = tempGame.fen();

      return { fen: fen, side: side };
    } catch (error) {
      console.error("Error parsing PGN: ", error);
      return null;
    }
  };

  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateWindowWidth);
      setWindowWidth(window.innerWidth);
      return () => {
        window.removeEventListener("resize", updateWindowWidth);
      };
    }
  }, []);
  useEffect(() => {
    if (windowWidth !== null) {
      if (windowWidth < breakpoints.medium) {
        setBoardWrapper({ width: `80.7vw` });
      } else if (windowWidth < breakpoints.large) {
        setBoardWrapper({ width: `32.33vh` });
      } else {
        setBoardWrapper({ width: `32.33vh` });
      }
    }
  }, [windowWidth]);
  useEffect(() => {
    const sortedNfts = [...nfts].sort((a, b) => b.likes - a.likes);
    setLocalNfts(sortedNfts);
  }, [nfts]);
  return (
    <div className=" flex h-auto w-full grow flex-col items-center gap-5 p-3 md:flex-row  md:flex-wrap md:items-start md:gap-8">
      {localNfts.map((nft, index) => {
        const finalFen = getPgnFinalFen(nft.attributes[0].value);

        if (finalFen) {
          return (
            <div
              style={boardWrapper}
              className=" flex flex-col gap-6"
              key={index}
            >
              <div
                className="flex h-full w-full flex-col"
                onClick={() => {
                  onNftClick(nft);
                }}
              >
                <Chessboard
                  position={finalFen.fen}
                  boardOrientation={finalFen.side}
                  customBoardStyle={{
                    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5 ",
                  }}
                  customDropSquareStyle={{
                    boxShadow: "inset 0 0 1px 6px rgba(255,255,255,0.75)",
                  }}
                  customDarkSquareStyle={{
                    backgroundColor: "#1D5951",
                    border: "1px solid black",
                  }}
                  customLightSquareStyle={{
                    backgroundColor: "#FFDC26",
                    border: "1px solid black",
                  }}
                />
              </div>
              <div className="relative flex  w-full flex-col items-center justify-center md:w-[34.33vh] ">
                <div className="flex flex-row items-center gap-3 md:flex-row md:gap-0">
                  {finalFen.side === "white" && (
                    <>
                      <h1 className=" font-bold text-black">
                        {" "}
                        {extractFirstAndLast5Characters(
                          nft.attributes[2].value,
                        )}
                      </h1>
                      <span className="px-2 font-bold text-yellow">vs</span>
                      <h1 className=" font-bold text-white">
                        {" "}
                        {extractFirstAndLast5Characters(
                          nft.attributes[1].value,
                        )}
                      </h1>
                    </>
                  )}
                  {finalFen.side === "black" && (
                    <>
                      <h1 className=" font-bold text-white">
                        {" "}
                        {extractFirstAndLast5Characters(
                          nft.attributes[1].value,
                        )}
                      </h1>
                      <span className="px-2 font-bold text-yellow">vs</span>
                      <h1 className=" font-bold text-black">
                        {" "}
                        {extractFirstAndLast5Characters(
                          nft.attributes[2].value,
                        )}
                      </h1>
                    </>
                  )}
                </div>
                <div className="flex w-screen justify-center gap-2 pt-2 md:w-auto">
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                    onClick={() => {
                      handleLike(nft.image);
                    }}
                    className=" left-0 flex cursor-pointer items-center justify-center bg-yellow transition-transform hover:scale-105 active:scale-90"
                  >
                    <AiFillHeart color={nft.isLiked ? "red" : ""} />

                    <h4>{nft.likes}</h4>
                  </div>
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                    onClick={() => {
                      handleLike(nft.image);
                    }}
                    className=" right-0 flex cursor-pointer flex-col items-center justify-center bg-yellow text-[0.8em] font-bold transition-transform hover:scale-105 active:scale-90"
                  >
                    <h1 className="text-md">Rank</h1>

                    <h4>{nft.attributes[3].value}</h4>
                  </div>
                </div>
              </div>
            </div>
          );
        } else {
          return null; // or some error message or fallback component
        }
      })}
    </div>
  );
};

export default AllNfts;
