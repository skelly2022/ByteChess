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
import { Console } from "console";

import {
  AiTwotoneEdit,
  AiFillCopy,
  AiFillCloseCircle,
  AiOutlineArrowLeft,
} from "react-icons/ai";

import Draggable from "react-draggable";
import socket from "~/helpers/socket";

const UserProfile = () => {
  const ProfileModal = useProfileModal();
  const { publicKey, sendTransaction, signMessage } = useWallet();
  const loginModal = useLoginModal();
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [nftData, setNftData] = useState([]); // Store NFT data in component state
  const user = useUserModal();
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState({});
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false); // State to manage user details modal visibility
  const [selectedUser, setSelectedUser] = useState(null); // State to store the selected user data
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isEditNamePopupOpen, setIsEditNamePopupOpen] = useState(false);
  const [myImages, setMyImages] = useState([]);
  const [search, setSearch] = useState(false);

  const getUser = api.example.getUser.useMutation({
    onSuccess(data) {
      console.log(data);
      // console.log("SOLT4NE2:", data);
      // setSearchResult(data);
      // setShowUserDetailsModal(true);
      // setLoading2(false);
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
  const data = api.example.getAllNfts.useMutation({
    async onSuccess(data) {
      console.log(data);
      setMyImages(data);
    },
  });
  const response = api.example.getAllNfts.useMutation({
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
    // Call the API to update the user's name with the new name
    getName.mutateAsync({ address: session.data.user.name, Name: newName });
  };

  const openEditPopup = () => {
    setIsEditPopupOpen(true);
    if (myImages.length > 0) {
      return;
    } else {
      data.mutateAsync({ address: session.data.user.name });
    }
  };
  const openEditNamePopup = () => {
    setIsEditNamePopupOpen(true);
  };
  useEffect(() => {
    console.log(searchResult);
  }, [searchResult]);
  useEffect(() => {
    console.log(publicKey);
    console.log("MODAL", ProfileModal.isOpen);
    if (ProfileModal.isOpen) {
      response.mutateAsync({ address: publicKey.toBase58() });
    } else {
      setLoading(true);
    }
  }, [ProfileModal.isOpen]);

  function extractFirstAndLast5Characters(inputString) {
    if (typeof inputString !== "string" || inputString.length < 10) {
      return null; // Return null for invalid input
    }

    const first4 = inputString.substring(0, 4);
    const last5 = inputString.substring(inputString.length - 5);

    return `${first4}....${last5}`;
  }
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = () => {
    const walletAddressText = walletAddress; // Get the wallet address
    offBlackigator.clipboard.writeText(walletAddressText).then(
      function () {
        setCopySuccess(true); // Set copy success status to true
      },
      function (err) {
        console.error("Unable to copy to clipboard: ", err);
        setCopySuccess(false); // Set copy success status to false
      },
    );
  };
  const bodyContent = (
    <div className=" over flex h-full   w-full   gap-2  bg-black p-3 ">
      <div
        className="flex h-full w-full flex-col items-center  rounded-xl
       py-3 shadow-xl md:flex-row "
      >
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 md:w-2/3">
          <div className="flex h-auto w-full   gap-2 md:flex-row">
            <div className=" h-full w-1/2 items-center md:w-1/3">
              <AiTwotoneEdit
                size={30}
                className="absolute left-[9.75rem]  z-30 transform rounded-full border border-black bg-green px-1 text-yellow transition-transform hover:scale-105 hover:bg-green active:scale-90"
                onClick={openEditPopup} // Open the edit popup on click
              />
              {!search ? (
                <img
                  className="relative h-48 w-48 rounded-full"
                  src={user.user.avatar}
                  alt="User Avatar"
                ></img>
              ) : (
                <img
                  className="h-48 w-48 rounded-full"
                  src={user.searchedUser.avatar}
                  alt="User Avatar"
                />
              )}
            </div>
            <div className="bg-offBlack flex h-[160px] w-1/2 flex-col justify-center p-3 text-xl md:w-2/3">
              <p className="align-center flex">
                Name: {user.user.name}
                <AiTwotoneEdit
                  size={20}
                  className=" relative left-2 rounded-full border  border-black
               bg-green px-1 text-yellow transition-transform hover:scale-105
               active:scale-90"
                  onClick={openEditNamePopup} // Open the edit popup on click
                />
              </p>

              <p>
                Discord:{" "}
                {!search ? user.user.discord : user.searchedUser.discord}
              </p>
              <p>
                Twitter:{" "}
                {!search ? user.user.twitter : user.searchedUser.twitter}
              </p>
              <p>
                Wallet:{" "}
                {!search
                  ? extractFirstAndLast5Characters(user.user.walletAddress)
                  : extractFirstAndLast5Characters(
                      user.searchedUser.walletAddress,
                    )}
                <button onClick={copyToClipboard}>
                  <AiFillCopy className="text-yellow hover:scale-105" />
                </button>{" "}
              </p>
            </div>
          </div>
          <div className="flex h-auto w-full gap-2">
            <div className="bg-offBlack w-1/2 p-3">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">
                  {" "}
                  Rank: <span className="text-xl text-red-900">BRONZE</span>
                </h1>
                <h1 className="text-2xl font-bold">
                  {" "}
                  Puzzels Rank:{" "}
                  <span className="text-xl text-pink-600">Plat</span>
                </h1>

                <h1 className="text-2xl font-bold">
                  {" "}
                  1v1 Rank:{" "}
                  <span className="text-xl text-[#4AD4FF]">Daimond</span>
                </h1>
              </div>
            </div>
            <div className="bg-offBlack w-1/2 p-3">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">
                  {" "}
                  Bullet Rating:{" "}
                  <span className="text-xl text-yellow">
                    {user.user.bulletRating}
                  </span>
                </h1>
                <h1 className="w-full text-2xl font-bold">
                  {" "}
                  Blitz Rating:{" "}
                  <span className="text-xl text-yellow">
                    {user.user.blitzRating}
                  </span>
                </h1>
                <h1 className="text-2xl font-bold">
                  {" "}
                  Rapid Rating:{" "}
                  <span className="text-xl text-yellow">
                    {user.user.rapidRating}
                  </span>
                </h1>
                <h1 className="text-2xl font-bold">
                  Puzzle Rating:{" "}
                  <span className="text-xl text-yellow">
                    {user.user.puzzleRatingChain}
                  </span>
                </h1>
                <h1 className="text-2xl font-bold">
                  Puzzles Played:{" "}
                  <span className="text-xl text-yellow">
                    {user.user.completedPuzzles.length}
                  </span>
                </h1>
              </div>
            </div>
          </div>

          {/* 
            </div> */}
          {/* {!search ? (
            <input
              className=" w-full rounded-md border border-gray-300 px-5 py-3 font-bold text-black placeholder-gray-500 transition  focus:outline-none"
              placeholder="SEARCH A FRIEND"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center  justify-center gap-2 ">
              <button
                className="rounded-xl bg-yellow px-3 py-4
               text-black transition-transform hover:scale-105 active:scale-90 "
                onClick={() => {
                  setSearch(false);
                }}
              >
                {" "}
                Return to profile
              </button>
              <button
                className="rounded-xl bg-yellow px-3 py-4
                   text-black transition-transform hover:scale-105 active:scale-90 "
              >
                {" "}
                Invite to Game
              </button>
            </div>
          )} */}
        </div>
        <div className="flex h-full w-full flex-col gap-2 p-3 md:w-1/3">
          <div className="no-scrollbar flex h-[300px] w-full flex-col  gap-2 overflow-scroll ">
            <div className="flex h-12 w-full items-center justify-center bg-nav text-2xl font-bold text-yellow">
              {" "}
              Gallery
            </div>
            <div className="bg-offBlack flex h-auto w-full flex-wrap items-center justify-center gap-3 ">
              <img
                className="w-[45%] cursor-pointer"
                src={"images/exampleCNFT.jpg"}
                alt={`NFT `}
              />
              <img
                className="w-[45%] cursor-pointer"
                src={"images/exampleCNFT.jpg"}
                alt={`NFT `}
              />{" "}
              <img
                className="w-[45%] cursor-pointer"
                src={"images/exampleCNFT.jpg"}
                alt={`NFT `}
              />{" "}
              <img
                className="w-[45%] cursor-pointer"
                src={"images/exampleCNFT.jpg"}
                alt={`NFT `}
              />
            </div>
          </div>
          <div className="flex w-full flex-col gap-2">
            <button
              className="w-full rounded-xl bg-green px-3 py-4
               text-black transition-transform hover:scale-105 active:scale-90 "
              onClick={() => {
                setSearch(false);
              }}
            >
              {" "}
              Return to profile
            </button>
            <button
              className="w-full rounded-xl bg-green px-3 py-4
                   text-black transition-transform hover:scale-105 active:scale-90 "
            >
              {" "}
              Invite Player
            </button>
          </div>
        </div>
      </div>
      {/* <div className="flex h-1/2 w-full p-3">
        <div className="flex h-full w-full flex-col ">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">
              {" "}
              Rank: <span className="text-xl text-red-900">BRONZE</span>
            </h1>
            <h1 className="text-2xl font-bold">
              {" "}
              Puzzels Rank: <span className="text-xl text-pink-600">Plat</span>
            </h1>

            <h1 className="text-2xl font-bold">
              {" "}
              1v1 Rank: <span className="text-xl text-[#4AD4FF]">Daimond</span>
            </h1>
            <h1 className="text-2xl font-bold">
              {" "}
              Puzzle Rating:{" "}
              <span className="text-xl text-yellow">
                {user.user.puzzleRating}
              </span>
            </h1>
            <h1 className="text-2xl font-bold">
              Puzzle Rating Chain:{" "}
              <span className="text-xl text-yellow">
                {user.user.puzzleRatingChain}
              </span>
            </h1>
            <h1 className="text-2xl font-bold">
              Puzzles Played:{" "}
              <span className="text-xl text-yellow">
                {user.user.completedPuzzles.length}
              </span>
            </h1>
          </div>
        </div>
     
      </div> */}
      {/* {isEditPopupOpen && (
        <div className=" absolute left-1/2 top-1/2 h-full w-5/6 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-green p-4 shadow-lg">
          <div className="relative flex h-full w-full flex-col items-center">
            <h1 className="pb-5 text-3xl">Choose Image</h1>
            <div className="flex h-full w-[90%] justify-center">
              <div className=" no-scrollbar flex h-3/4 w-full flex-wrap overflow-scroll">
                {nftData.map((nft, index) => (
                  <div key={index} className="flex  p-1">
                    <img
                      className="w-[70px] cursor-pointer"
                      src={nft.image}
                      alt={`NFT ${index}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            className="absolute right-3 top-2 text-2xl"
            onClick={closeEditPopup}
          >
            X
          </button>
        </div>
      )}
      {isEditNamePopupOpen && (
        <div className="absolute  left-1/2 top-1/2 h-auto -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-green p-4 shadow-lg">
          <div className="relative flex h-full w-full flex-col items-center">
            <h1 className="pb-5 text-3xl">Choose Name</h1>
            <div className="flex h-full w-[90%] justify-center">
              <input
                className="focus:border-green-400 rounded-md border border-gray-300  px-5 py-3 font-bold text-green placeholder-gray-500 transition focus:outline-none"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="PUT UR NAME"
              />
              <button
                className="hover:bg-green-dark rounded-md bg-green px-4 py-2 text-white transition"
                onClick={handleChangeName}
              >
                Change
              </button>
            </div>
          </div>
          <button
            className="absolute right-3 top-2 text-2xl"
            onClick={closeEditNamePopup}
          >
            X
          </button>
        </div>
      )} */}
    </div>
  );

  const footerContent = <div className=" flex flex-col gap-4"></div>;

  return (
    <Modal3
      disabled={isLoading}
      isOpen={ProfileModal.isOpen}
      actionLabel="Continue"
      onClose={ProfileModal.onClose}
      onSubmit={() => {}}
      body={bodyContent}
      title={extractFirstAndLast5Characters(user.user.walletAddress)}
      footer={footerContent}
    />
  );
};

export default UserProfile;
