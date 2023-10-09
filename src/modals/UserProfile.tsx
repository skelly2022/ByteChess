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
import { HiTrophy } from "react-icons/hi2";

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

  const data = api.example.getAllNfts.useMutation({
    async onSuccess(data) {
      console.log(data);
      setMyImages(data);
    },
  });
  const data1 = api.mint.getAllNftsProfile.useMutation({
    async onSuccess(data1) {
      console.log(data1);
      setNfts(data1);
    },
  });
  console.log(`CNFT`, data1);
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
    getName.mutateAsync({ address: session.data.user.name, Name: newName });
  };

  const openEditPopup = () => {
    setIsEditPopupOpen(true);
    if (myImages.length === 0) {
      data.mutateAsync({ address: session.data.user.name });
    }
  };

  const openEditNamePopup = () => {
    setIsEditNamePopupOpen(true);
  };

  useEffect(() => {
    console.log(publicKey);
    console.log("MODAL", ProfileModal.isOpen);
    if (ProfileModal.isOpen) {
      response.mutateAsync({ address: session.data.user.name });
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

  const bodyContent = (
    <div className="no-scrollbar flex h-full w-full gap-2 overflow-scroll bg-black p-3">
      <div className="flex h-full w-full flex-col items-center rounded-xl py-3 shadow-xl md:flex-row">
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 md:w-2/3">
          <div className="flex h-auto w-full gap-2 md:flex-row">
            <div className="relative h-full w-1/2 items-center md:w-1/3">
              <AiTwotoneEdit
                size={30}
                className="absolute left-[9.75rem] z-30 transform rounded-full border border-black bg-green px-1 text-yellow transition-transform hover:scale-105 hover:bg-green active:scale-90"
                onClick={openEditPopup}
              />
              {!search ? (
                <img
                  className="relative h-48 w-48 rounded-full"
                  src={currentUser.avatar}
                  alt="User Avatar"
                ></img>
              ) : (
                <img
                  className="h-48 w-48 rounded-full"
                  src={currentSearchedUser.avatar}
                  alt="User Avatar"
                />
              )}
            </div>
            <div className="flex h-[160px] w-1/2 flex-col justify-center bg-offBlack p-3 text-xl md:w-2/3">
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
                  <p>Discord: {currentUser.discord}</p>
                  <p>Twitter: {currentUser.twitter}</p>
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
                  <p>Discord: {currentSearchedUser.discord}</p>
                  <p>Twitter: {currentSearchedUser.twitter}</p>
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
              <div className="w-1/2 bg-offBlack p-3">
                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl font-bold">
                    {" "}
                    Rank: <span className="text-xl text-red-900">BRONZE</span>
                  </h1>
                  <h1 className="text-2xl font-bold">
                    {" "}
                    Puzzles Rank:{" "}
                    <span className="text-xl text-pink-600">Plat</span>
                  </h1>

                  <h1 className="text-2xl font-bold">
                    {" "}
                    1v1 Rank:{" "}
                    <span className="text-xl text-[#4AD4FF]">Daimond</span>
                  </h1>
                  <h1 className="align-baseline text-2xl font-bold text-white md:flex">
                    Tournements:{" "}
                    <span className="text-2xl font-bold text-green">
                      <HiTrophy className="m-1" />
                    </span>
                    <span className="align-baseline text-2xl text-yellow">
                      {currentUser.trophies}
                    </span>
                  </h1>
                </div>
              </div>
              <div className="w-1/2 bg-offBlack p-3">
                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl font-bold">
                    {" "}
                    Bullet Rating:{" "}
                    <span className="text-xl text-yellow">
                      {currentUser.bulletRating}
                    </span>
                  </h1>
                  <h1 className="w-full text-2xl font-bold">
                    {" "}
                    Blitz Rating:{" "}
                    <span className="text-xl text-yellow">
                      {currentUser.blitzRating}
                    </span>
                  </h1>
                  <h1 className="text-2xl font-bold">
                    {" "}
                    Rapid Rating:{" "}
                    <span className="text-xl text-yellow">
                      {currentUser.rapidRating}
                    </span>
                  </h1>
                  <h1 className="text-2xl font-bold">
                    Puzzle Rating:{" "}
                    <span className="text-xl text-yellow">
                      {currentUser.puzzleRatingChain}
                    </span>
                  </h1>
                  <h1 className="text-2xl font-bold">
                    Puzzles Played:{" "}
                    <span className="text-xl text-yellow">
                      {currentUser.completedPuzzles.length}
                    </span>
                  </h1>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-auto w-full gap-2">
              <div className="w-1/2 bg-offBlack p-3">
                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl font-bold">
                    {" "}
                    Rank: <span className="text-xl text-red-900">BRONZE</span>
                  </h1>
                  <h1 className="text-2xl font-bold">
                    {" "}
                    Puzzles Rank:{" "}
                    <span className="text-xl text-pink-600">Plat</span>
                  </h1>

                  <h1 className="text-2xl font-bold">
                    {" "}
                    1v1 Rank:{" "}
                    <span className="text-xl text-[#4AD4FF]">Daimond</span>
                  </h1>
                  <h1 className="align-baseline text-2xl font-bold text-white md:flex">
                    Tournements:{" "}
                    <span className="text-2xl font-bold text-green">
                      <HiTrophy className="m-1" />
                    </span>
                    <span className="align-baseline text-2xl text-yellow">
                      {currentSearchedUser.trophies}
                    </span>
                  </h1>
                </div>
              </div>
              <div className="w-1/2 bg-offBlack p-3">
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
            <div className="flex h-auto w-full flex-wrap items-center justify-center gap-3 bg-offBlack ">
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
