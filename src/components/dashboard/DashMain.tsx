import { useEffect, useState } from "react";
import DashBoard from "./DashBoard";
import { api } from "~/utils/api";
import AllNfts from "./AllNfts";
import { useSession } from "next-auth/react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import toast from "react-hot-toast";

const DashMain = () => {
  const session = useSession();
  const [allNfts, setAllNfts] = useState([]);
  const [myNfts, setMyNfts] = useState([]);
  const [isShowingMyNfts, setIsShowingMyNfts] = useState(false); // <-- New state
  const [selectedNft, setSelectedNft] = useState(null);
  const addLike = api.mint.addLike.useMutation({
    onSuccess(data) {
      console.log(data);
      if (selectedNft !== null) {
        const copy = selectedNft;
        selectedNft.isLiked = !selectedNft.isLiked;
      }
      const updatedNfts = allNfts.map((nft) => {
        if (nft.image === data.img) {
          const isLikedByUser = data.usersLiked.includes(
            session.data.user.name,
          );
          return {
            ...nft,
            likes: data.likes,
            isLiked: isLikedByUser,
          };
        }
        return nft;
      });
      const updatedNftsMe = myNfts.map((nft) => {
        if (nft.image === data.img) {
          const isLikedByUser = data.usersLiked.includes(
            session.data.user.name,
          );
          return {
            ...nft,
            likes: data.likes,
            isLiked: isLikedByUser,
          };
        }
        return nft;
      });
      setMyNfts(updatedNftsMe);

      setAllNfts(updatedNfts);
    },
  });

  const handleClickLike = (id: string) => {
    if (session.status === "authenticated") {
      console.log("hey");
      addLike.mutateAsync({ address: session.data.user.name, img: id });
    } else {
      toast.error("Must be Signed In");
    }
  };
  const handleClick = (id: string) => {
    console.log(id);
    if (session.status === "authenticated") {
      console.log("hey");
      addLike.mutateAsync({ address: session.data.user.name, img: id });
    } else {
      toast.error("Must be Signed In");
    }
  };
  const nfts = api.mint.getAllNfts.useMutation({
    onSuccess(data) {
      console.log(data);
      setAllNfts(data);
    },
  });
  const nftsMe = api.mint.getAllNftsProfile.useMutation({
    onSuccess(data) {
      console.log(data);
      setMyNfts(data);
    },
  });
  const handleNftViewToggle = (shouldShowMyNfts) => {
    setIsShowingMyNfts(shouldShowMyNfts);
    setSelectedNft(null);
  };
  const handleNftClick = (nftData) => {
    setSelectedNft(nftData);
    console.log(nftData);
  };

  const handleBackClick = () => {
    setSelectedNft(null);
  };
  useEffect(() => {
    nfts.mutateAsync({ address: session.data.user.name });
    nftsMe.mutateAsync({ address: session.data.user.name });
  }, []);
  return (
    <div className="no-scrollbar relative flex h-full w-full justify-center overflow-scroll">
      <div className="m-3 flex h-full w-full flex-col  ">
        <div className="flex h-auto w-full items-center justify-center gap-3 ">
          <button
            className={`rounded-lg px-3 py-2 text-black ${
              isShowingMyNfts ? "border shadow-xl" : "bg-yellow"
            }`}
            onClick={() => handleNftViewToggle(false)}
          >
            Popular Nfts
          </button>
          <button
            className={`rounded-lg px-3 py-2 text-black ${
              isShowingMyNfts ? "bg-yellow" : "border shadow-xl"
            }`}
            onClick={() => handleNftViewToggle(true)}
          >
            My Games
          </button>
        </div>
        {/* Ternary operator to decide which set of NFTs to render */}
        {selectedNft === null && (
          <AllNfts
            nfts={isShowingMyNfts ? myNfts : allNfts}
            onNftClick={handleNftClick}
            handleLike={handleClick}
          />
        )}
        {selectedNft !== null && (
          <>
            <DashBoard
              selectedGame={selectedNft}
              onHandleBack={handleBackClick}
              handleLike={handleClickLike}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default DashMain;
