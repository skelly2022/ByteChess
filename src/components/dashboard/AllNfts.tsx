import { Chess } from "chess.js";
import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { AiFillHeart } from "react-icons/ai";
import Assets from "../../helpers/assets";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
const { extractFirstAndLast5Characters } = Assets;
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
    <div className=" flex h-auto w-full grow flex-col items-center gap-3 p-3 md:flex-row  md:flex-wrap md:items-start md:gap-5">
      {localNfts.map((nft, index) => {
        const finalFen = getPgnFinalFen(nft.attributes[0].value);

        if (finalFen) {
          return (
            <div
              style={boardWrapper}
              className="relative flex flex-col"
              key={index}
            >
              <div
                className="absolute left-0 top-0 z-[100]   transform text-2xl font-bold text-gray-500"
                style={{
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
                }}
              >
                <span className="text-gray-500 opacity-80">#</span>
                {index + 1}
              </div>
              <div
                className="h-full w-full"
                onClick={() => {
                  onNftClick(nft);
                }}
              >
                <Chessboard
                  position={finalFen.fen}
                  boardOrientation={finalFen.side}
                />
              </div>
              <div className="relative flex h-[45px] w-full items-center justify-center pt-1 md:h-auto">
                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                  }}
                  onClick={() => {
                    handleLike(nft.image);
                  }}
                  className="absolute left-0 flex items-center justify-center bg-yellow"
                >
                  <AiFillHeart color={nft.isLiked ? "red" : ""} />

                  <h4>{nft.likes}</h4>
                </div>
                <div className="flex flex-row items-center gap-3 md:flex-col md:gap-0">
                  {finalFen.side === "white" && (
                    <>
                      {extractFirstAndLast5Characters(nft.attributes[2].value)}
                      <span>vs</span>
                      {extractFirstAndLast5Characters(nft.attributes[1].value)}
                    </>
                  )}
                  {finalFen.side === "black" && (
                    <>
                      {extractFirstAndLast5Characters(nft.attributes[1].value)}
                      <span>vs</span>
                      {extractFirstAndLast5Characters(nft.attributes[2].value)}
                    </>
                  )}
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
