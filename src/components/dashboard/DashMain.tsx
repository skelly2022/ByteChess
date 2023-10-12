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
  const totalItems = 150; // This can come from your API or database
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(startItem + itemsPerPage - 1, totalItems);
  const addLike = api.mint.addLike.useMutation({
    onSuccess(data) {
      if (selectedNft !== null) {
        setSelectedNft((prevNft) => ({
          ...prevNft,
          isLiked: !prevNft.isLiked,
        }));
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
    onError(error) {
      console.log(error);
    },
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const handlePrevious = () => {
    const nftsList = isShowingMyNfts ? myNfts : allNfts;
    const currentIndex = nftsList.findIndex((nft) => nft.id === selectedNft.id);
    setSelectedNft(nftsList[1]);
  };

  const handleNext = () => {
    const nftsList = isShowingMyNfts ? myNfts : allNfts;
    const currentIndex = nftsList.findIndex((nft) => nft.id === selectedNft.id);
    if (currentIndex < nftsList.length - 1) {
      setSelectedNft(nftsList[0]);
    }
  };

  const handleClickLike = (id: string) => {
    if (session.status === "authenticated") {
      addLike.mutateAsync({ address: session.data.user.name, img: id });
    } else {
      toast.error("Must be Signed In");
    }
  };
  const handleClick = (id: string) => {
    if (session.status === "authenticated") {
      addLike.mutateAsync({ address: session.data.user.name, img: id });
    } else {
      toast.error("Must be Signed In");
    }
  };
  const nfts = api.mint.getAllNfts.useMutation({
    onSuccess(data) {
      setAllNfts(data);
    },
    onError(error) {
      console.log(error);
    },
  });
  const nftsMe = api.mint.getAllNftsProfile.useMutation({
    onSuccess(data) {
      setMyNfts(data);
    },
    onError(error) {
      console.log(error);
    },
  });
  const handleNftViewToggle = (shouldShowMyNfts) => {
    setIsShowingMyNfts(shouldShowMyNfts);
    setSelectedNft(null);
  };
  const handleNftClick = (nftData) => {
    setSelectedNft(nftData);
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
          </button>{" "}
        </div>

        {selectedNft === null ? ( // Check if selectedNft is null
          <>
            <AllNfts
              nfts={isShowingMyNfts ? myNfts : allNfts}
              onNftClick={handleNftClick}
              handleLike={handleClick}
            />
          </>
        ) : (
          <DashBoard
            selectedGame={selectedNft}
            onHandleBack={handleBackClick}
            onPrevious={handlePrevious} // Pass the function as a prop
            onNext={handleNext} //
            handleLike={handleClickLike}
          />
        )}
      </div>
    </div>
  );
};

export default DashMain;
