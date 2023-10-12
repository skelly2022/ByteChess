//@ts-nocheck

import { PrismaClient } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import useUserModal from "~/hooks/useUserStore";
import axios from "axios"; // Import the axios library
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import useLoginModal from "~/hooks/useLoginModal";
import Modal3 from "~/modals/Modal3";
import useProfileModal from "~/hooks/useProfileModal";
import socket from "~/helpers/socket";
import { Console } from "console";
import {
  AiTwotoneEdit,
  AiFillCopy,
  AiFillCloseCircle,
  AiOutlineArrowLeft,
} from "react-icons/ai";

import Draggable from "react-draggable";

import bronze from "public/images/1.png";
import plat from "public/images/2.png";
import diamond from "public/images/3.png";

const defaultUser = {
  avatar: "path_to_default_avatar.jpg",
  name: "John Doe",
  discord: "John#1234",
  twitter: "@johndoe",
  walletAddress: "DefaultWalletAddress1234567890",
  trophies: 0,
  bulletRating: 1200,
  blitzRating: 1200,
  rapidRating: 1200,
  puzzleRatingChain: 1500,
  completedPuzzles: [],
};

const UserProfile = () => {
  const ProfileModal = useProfileModal();
  const { publicKey, sendTransaction, signMessage } = useWallet();
  const loginModal = useLoginModal();
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [nftData, setNftData] = useState([]);
  const user = useUserModal();
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState({});
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isEditNamePopupOpen, setIsEditNamePopupOpen] = useState(false);
  const [myImages, setMyImages] = useState([]);
  const [search, setSearch] = useState(false);
  const [nfts, setNfts] = useState([]);
  const currentUser = user?.user || defaultUser; // Use user data if it exists, otherwise use hardcoded data
  const currentSearchedUser = user?.searchedUser || defaultUser;

  const getUser = api.example.getUser.useMutation({
    onSuccess(data) {
      console.log(data);
      user.setSearchedUser(data);
      setSearch(true);
    },
  });

  const getName = api.example.updateName.useMutation({
    onSuccess(data) {
      console.log("Name:", data);
      user.setUser(data);
      setLoading(false);
    },
  });

  const getAvatar = api.example.updateAvatar.useMutation({
    onSuccess(data) {
      console.log("AVATAR:", data);
      user.setUser(data);
      setLoading(false);
    },
  });

  const data1 = api.mint.getAllNftsProfile.useMutation({
    async onSuccess(data1) {
      console.log(data1);
      setNfts(data1);
    },
  });
  console.log(`CNFT`, data1);
  const data = api.mint.getAllNfts.useMutation({
    onSuccess(data) {
      console.log("nfts:", data);
      setNftData(data);
      setLoading(false);
    },
  });

  const closeEditPopup = () => {
    setIsEditPopupOpen(false);
  };

  const closeEditNamePopup = () => {
    setIsEditNamePopupOpen(false);
  };

  const inviteFriend = () => {
    socket.emit("inviteFriend", searchResult.id);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      getUser.mutateAsync({ address: searchValue });
    }
  };

  const handleChangeName = () => {
    getName.mutateAsync({ address: session.data.user.name, Name: newName });
  };

  const openEditPopup = () => {
    setIsEditPopupOpen(true);
    if (myImages.length === 0) {
      data.mutateAsync({ address: publicKey });
    }
  };

  const openEditNamePopup = () => {
    setIsEditNamePopupOpen(true);
  };

  useEffect(() => {
    console.log(publicKey);
    console.log("MODAL", ProfileModal.isOpen);
    if (ProfileModal.isOpen) {
      data1.mutateAsync({ address: session.data.user.name }); // Add this line
    } else {
      setLoading(true);
    }
  }, [ProfileModal.isOpen]);

  const extractFirstAndLast5Characters = (inputString) => {
    if (typeof inputString !== "string" || inputString.length < 10) {
      return null;
    }

    const first4 = inputString.substring(0, 4);
    const last5 = inputString.substring(inputString.length - 5);

    return `${first4}....${last5}`;
  };

  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = () => {
    const walletAddressText = publicKey.toBase58();
    navigator.clipboard.writeText(walletAddressText).then(
      function () {
        setCopySuccess(true);
      },
      function (err) {
        console.error("Unable to copy to clipboard: ", err);
        setCopySuccess(false);
      },
    );
  };
  function getRankImage(rating) {
    if (rating < 1200) {
      return "1";
    } else if (1500 < rating > 1800) {
      return "2";
    } else {
      return "3"; // Corrected the spelling from 'daimond' to 'diamond'
    }
  }

  const bodyContent = (
    <div className="no-scrollbar flex h-full w-full gap-2 overflow-scroll bg-[#262626] p-3">
      <div className="flex h-full w-full flex-col items-center rounded-xl py-3 shadow-xl md:flex-row">
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 md:w-2/3">
          <div className="flex h-auto w-full gap-2 md:flex-row">
            <div className="relative h-full w-auto items-center md:w-auto">
              {!search ? (
                <>
                  <AiTwotoneEdit
                    size={30}
                    className="absolute left-[9.75rem] z-30 transform rounded-full border border-black bg-green px-1 text-yellow transition-transform hover:scale-105 hover:bg-green active:scale-90"
                    onClick={openEditPopup}
                  />
                  <img
                    className="relative h-48 w-48 rounded-full"
                    src={currentUser.avatar}
                    alt="User Avatar"
                  ></img>
                </>
              ) : (
                <img
                  className="h-48 w-48 rounded-full"
                  src={currentSearchedUser.avatar}
                  alt="User Avatar"
                />
              )}
            </div>
            <div className=" flex h-auto w-auto flex-col justify-center p-3 text-xl ">
              {!search ? (
                <>
                  <p className="align-center flex">
                    Name: {currentUser.name}
                    <AiTwotoneEdit
                      size={20}
                      className="relative left-2 rounded-full border  border-black bg-green px-1 text-yellow transition-transform hover:scale-105 active:scale-90"
                      onClick={openEditNamePopup}
                    />
                  </p>

                  <p>
                    Wallet:{" "}
                    {extractFirstAndLast5Characters(currentUser.walletAddress)}
                    <button onClick={copyToClipboard}>
                      <AiFillCopy className="text-yellow hover:scale-105" />
                    </button>{" "}
                  </p>
                </>
              ) : (
                <>
                  <p className="align-center flex">
                    Name: {currentSearchedUser.name}
                  </p>

                  <p>
                    Wallet:{" "}
                    {extractFirstAndLast5Characters(
                      currentSearchedUser.walletAddress,
                    )}
                    <button onClick={copyToClipboard}>
                      <AiFillCopy className="text-yellow hover:scale-105" />
                    </button>{" "}
                  </p>
                </>
              )}
            </div>
          </div>

          {!search ? (
            <div className="flex h-auto w-full gap-2">
              <div className=" w-2/3 min-w-fit p-3">
                <div className="flex flex-col gap-2">
                  <h1 className="flex items-center gap-2 text-2xl font-bold">
                    Bullet Rating:{" "}
                    <span className="text-xl text-yellow">
                      {currentUser.bulletRating}
                    </span>
                    <span className="text-xl text-yellow">
                      <img src={`images/1.png`} className="h-10 w-10"></img>
                    </span>
                  </h1>
                  <h1 className="flex items-center gap-2 text-2xl font-bold">
                    Blitz Rating:{" "}
                    <span className="text-xl text-yellow">
                      {currentUser.blitzRating}
                    </span>
                    <span className="text-xl text-yellow">
                      <img src={`images/1.png`} className="h-10 w-10"></img>
                    </span>
                  </h1>
                  <h1 className="flex items-center gap-2 text-2xl font-bold">
                    Rapid Rating:{" "}
                    <span className="text-xl text-yellow">
                      {currentUser.rapidRating}
                    </span>
                    <span className="text-xl text-yellow">
                      <img src={`images/1.png`} className="h-10 w-10"></img>
                    </span>
                  </h1>
                  <h1 className="flex items-center gap-2 text-2xl font-bold">
                    Puzzle Rating:{" "}
                    <span className="text-xl text-yellow">
                      {currentUser.puzzleRatingChain}
                    </span>
                    <span className="text-xl text-yellow">
                      <img src={`images/1.png`} className="h-10 w-10"></img>
                    </span>
                  </h1>
                </div>
              </div>
              <div className=" flex w-auto p-3">
                <div className="flex w-full flex-col items-center  gap-2">
                  <h1 className="text-xl">Trophies</h1>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-auto w-full gap-2">
              <div className="w-auto p-3">
                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl font-bold"> Puzzles Rank: </h1>
                  <img
                    src={getRankImage(currentSearchedUser.puzzleRatingChain)}
                    alt="rank"
                  />

                  <h1 className="text-2xl font-bold"> 1v1 Rank: </h1>
                  <img
                    src={getRankImage(
                      (currentSearchedUser.bulletRating +
                        currentSearchedUser.blitzRating +
                        currentSearchedUser.rapidRating) /
                        4,
                    )}
                    alt="bronze"
                  ></img>

                  <h1 className="align-baseline text-2xl font-bold text-white md:flex">
                    Tournements:{" "}
                    {/* <span className="text-2xl font-bold text-green">
                      <HiTrophy className="m-1" />
                    </span> */}
                  </h1>
                  <img src={plat} alt="bronze"></img>
                </div>
              </div>
              <div className="bg-grey w-2/3 p-3">
                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl font-bold">
                    {" "}
                    Bullet Rating:{" "}
                    <span className="text-xl text-yellow">
                      {currentSearchedUser.bulletRating}
                    </span>
                  </h1>
                  <h1 className="w-full text-2xl font-bold">
                    {" "}
                    Blitz Rating:{" "}
                    <span className="text-xl text-yellow">
                      {currentSearchedUser.blitzRating}
                    </span>
                  </h1>
                  <h1 className="text-2xl font-bold">
                    {" "}
                    Rapid Rating:{" "}
                    <span className="text-xl text-yellow">
                      {currentSearchedUser.rapidRating}
                    </span>
                  </h1>
                  <h1 className="text-2xl font-bold">
                    Puzzle Rating:{" "}
                    <span className="text-xl text-yellow">
                      {currentSearchedUser.puzzleRatingChain}
                    </span>
                  </h1>
                  <h1 className="text-2xl font-bold">
                    Puzzles Played:{" "}
                    <span className="text-xl text-yellow">
                      {currentSearchedUser.completedPuzzles.length}
                    </span>
                  </h1>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex h-full w-full flex-col gap-2 p-3 md:w-1/3">
          <div className="no-scrollbar flex h-[300px] w-full flex-col gap-2 overflow-scroll">
            <div className="flex h-12 w-full items-center justify-center bg-nav text-2xl font-bold text-yellow">
              {" "}
              Gallery
            </div>
            <div className="bg-grey flex h-auto w-full grow flex-wrap items-center justify-center gap-3 ">
              {nfts.map((nft) => (
                <img
                  key={nft.id}
                  className="w-[45%] cursor-pointer"
                  src={nft.image} // Assuming the structure based on given data
                  alt={`NFT ${nft.id}`}
                />
              ))}
            </div>
          </div>
          <div className="flex w-full flex-col gap-2">
            {!search ? (
              <>
                {" "}
                <input
                  className="w-full rounded-xl bg-yellow px-3 py-4 text-black transition-transform hover:scale-105 active:scale-90"
                  type="text"
                  placeholder="Enter something..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button className="w-full cursor-not-allowed rounded-xl bg-gray-600 px-3 py-4 text-black transition-transform hover:scale-105 active:scale-90">
                  {" "}
                  Invite Player
                </button>
              </>
            ) : (
              <>
                {" "}
                <button
                  className="w-full rounded-xl bg-green px-3 py-4 text-black transition-transform hover:scale-105 active:scale-90"
                  onClick={() => {
                    setSearch(false);
                  }}
                >
                  {" "}
                  Return to profile
                </button>
                <button className="w-full rounded-xl bg-green px-3 py-4 text-black transition-transform hover:scale-105 active:scale-90">
                  {" "}
                  Invite Player
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {isEditNamePopupOpen && (
        <div className="z-9999 fixed left-0 top-0 flex h-full w-full items-center justify-center">
          <div className="w-96 rounded-lg bg-green p-4 shadow-md">
            <div className="flex justify-between">
              <h3 className="text-xl font-bold">Edit Name</h3>
              <button onClick={closeEditNamePopup}>
                <AiFillCloseCircle size={25} />
              </button>
            </div>
            <div className="mt-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-yellow"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="mt-1 w-full rounded-md border p-2 font-semibold text-black"
              />
              <button
                onClick={handleChangeName}
                className="bg-blue-500 mt-4 w-full rounded-md p-2 text-white"
              >
                Update Name
              </button>
            </div>
          </div>
        </div>
      )}
      {isEditPopupOpen && (
        <div className="z-9999 fixed left-0 top-0 flex h-full w-full items-center justify-center">
          <div className="w-96 rounded-lg bg-green p-4 shadow-md">
            <div className="flex justify-between">
              <h3 className="text-xl font-bold">Edit Avatar</h3>
              <button onClick={closeEditPopup}>
                <AiFillCloseCircle size={25} />
              </button>
            </div>
            <div className="mt-4">
              <h1>ISK TRY FIXING THIS ONE</h1>
              {/* {data.map(() => (
                  <div key={data.mintAddress} className="mb-2">
                      <img src={data.image} alt="avatar" className="w-24 h-24 rounded-full" />
                      <button className="ml-2 text-sm">Select</button>
                  </div>
              ))} */}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const footerContent = <div className="flex flex-col gap-4"></div>;

  return (
    <Modal3
      disabled={isLoading}
      isOpen={ProfileModal.isOpen}
      actionLabel="Continue"
      onClose={ProfileModal.onClose}
      onSubmit={() => {}}
      body={bodyContent}
      title={extractFirstAndLast5Characters(currentUser.walletAddress)}
      footer={footerContent}
    />
  );
};

export default UserProfile;
