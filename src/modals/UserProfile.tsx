// pages/UserProfile.tsx
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
import Modal from "~/modals/Modal";
import useProfileModal from "~/hooks/useProfileModal";
import { Console } from "console";
import { AiTwotoneEdit } from "react-icons/ai";
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

  const handleChangeName = () => {
    // Call the API to update the user's name with the new name
    getName.mutateAsync({ address: session.data.user.name, Name: newName });
  };
  useEffect(() => {
    console.log(searchResult);
  }, [searchResult]);

  const getUser = api.example.getUser.useMutation({
    onSuccess(data) {
      console.log("SOLT4NE2:", data);
      setSearchResult(data);
      setShowUserDetailsModal(true);
      setLoading2(false);
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

  const response = api.example.getAllNfts.useMutation({
    onSuccess(data) {
      console.log("nfts:", data);
      setNftData(data);
      setLoading(false);
    },
  });

  useEffect(() => {
    console.log(publicKey);
    console.log("MODAL", ProfileModal.isOpen);
    if (ProfileModal.isOpen) {
      response.mutateAsync({ address: publicKey.toBase58() });
    } else {
      setLoading(true);
    }
  }, [ProfileModal.isOpen]);

  const getAllUsers = api.example.getAllUsers.useMutation({
    onSuccess(data) {
      console.log("USERS:", data);
      user.setUser(data);
      setLoading(false);
    },
  });
  console.log(getAllUsers);

  const handleSearch = async () => {
    if (!searchValue) {
      // Don't search if the input is empty
      return;
    }

    try {
      setIsLoading(true);
      getUser.mutateAsync({ address: searchValue });

      console.log(`SEARCHEDADDY`, searchValue);
    } catch (error) {
      console.error("Error searching for users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseUserDetailsModal = () => {
    setShowUserDetailsModal(false);
  };

  const closeEditPopup = () => {
    setIsEditPopupOpen(false);
  };
  const closeEditNamePopup = () => {
    setIsEditNamePopupOpen(false);
  };
  const inviteFriend = () => {
    socket.emit("inviteFriend", searchResult.id);
  };
  const data = api.example.getAllNfts.useMutation({
    async onSuccess(data) {
      console.log(data);
      setMyImages(data);
    },
  });
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
  const numImages = myImages.length;

  const numColumns = Math.ceil(numImages / 2); // 2 rows
  useEffect(() => {
    socket.on("invitedToGame", () => {
      console.log("invited");
    });
  }, []);
  const gridContainerStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${numColumns}, 1fr)`, // Dynamic number of columns
    gridTemplateRows: "repeat(3, 1fr)", // 2 rows
    gap: "10px", // Adjust as needed
    overflowX: "scroll", // Enable horizontal overflow
  };
  const bodyContent = (
    <div className="grid grid-cols-1 gap-8 p-1 md:grid-cols-2">
      <div className="flex flex-col gap-8 p-1">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="font-bold text-white">
            <div>
              <input
                className="focus:border-green-400 rounded-md border border-gray-300 bg-yellow px-5 py-3 font-bold text-green placeholder-gray-500 transition focus:outline-none"
                placeholder="SEARCH A FRIEND"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button
                className="hover:bg-green-dark rounded-md bg-green px-4 py-2 text-white transition"
                onClick={handleSearch}
              >
                SEARCH
              </button>
            </div>

            <div className="flex items-center">
              {" "}
              {/* First Row */}
              <img
                className="w-[150px] rounded-full"
                src={user.user.avatar}
                alt="User Avatar"
              />
              <div className="absolute left-[8.75rem] top-[5.75rem]">
                <AiTwotoneEdit
                  size={30}
                  className="transform rounded-full border border-black px-1 transition-transform hover:scale-105 hover:bg-green active:scale-90"
                  onClick={openEditPopup} // Open the edit popup on click
                />
                {isEditPopupOpen && (
                  <div className="  top-1/2 h-full w-5/6 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-green p-4 shadow-lg">
                    <div className="relative flex h-full w-full flex-col items-center">
                      <h1 className="pb-5 text-3xl">Choose Image</h1>
                      <div className="flex h-full w-[90%] justify-center">
                        <div className=" h-full" style={gridContainerStyle}>
                          {myImages.map((imageObj, index) => (
                            <>
                              {" "}
                              <div
                                key={index}
                                className="relative h-[100px] w-[100px]"
                              >
                                <img
                                  src={imageObj.image}
                                  alt={`Tournament Image ${index + 1}`}
                                  className="h-full w-full rounded-lg object-cover"
                                  onError={() => {
                                    // Remove the broken image from the list
                                    const updatedImages = [...myImages];
                                    updatedImages.splice(index, 1);
                                    setMyImages(updatedImages);
                                  }}
                                />
                              </div>
                              <button
                                className="mt-3 items-end rounded-xl bg-yellow px-3 py-2"
                                onClick={() => {
                                  getAvatar.mutateAsync({
                                    address: session.data.user.name,
                                    Image: `${imageObj.image}`,
                                  });
                                }}
                              >
                                CHOOSE UR PFP
                              </button>{" "}
                            </>
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
              </div>
              <div className="ml-4 block">
                <div className="inline-flex gap-1">
                  {" "}
                  <p className="">Name: {user.user.name}</p>
                  <div className="">
                    <AiTwotoneEdit
                      size={30}
                      className="transform rounded-full border border-black px-1 transition-transform hover:scale-105 hover:bg-green active:scale-90"
                      onClick={openEditNamePopup} // Open the edit popup on click
                    />
                    {isEditNamePopupOpen && (
                      <div className="  top-1/2 h-full  -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-green p-4 shadow-lg">
                        <div className="relative flex h-full w-full flex-col items-center">
                          <h1 className="pb-5 text-3xl">Choose Name</h1>
                          <div className="flex h-full w-[90%] justify-center">
                            <input
                              className="focus:border-green-400 rounded-md border border-gray-300 bg-yellow px-5 py-3 font-bold text-green placeholder-gray-500 transition focus:outline-none"
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
                    )}
                  </div>
                </div>
                <p>Discord: {user.user.name}</p>
                <p>Wallet: {user.user.walletAddress}</p>
              </div>
            </div>

            <div className="flex flex-col">
              {" "}
              {/* Second Row */}
              <p>Puzzle Rating: {user.user.puzzleRating}</p>
              <p>Puzzle puzzleRatingChain: {user.user.puzzleRatingChain}</p>
              <p>Puzzle puzzles Played: {user.user.completedPuzzles.length}</p>
              <p>PLAYR RANK: NOT DONE YET</p>
              <p>PLAYR Matches Played: NOT DONE YET</p>
              <p>PLAYR Matches W/L: NOT DONE YET%</p>
            </div>
          </div>
        )}

        {loading2 ? (
          <></>
        ) : (
          showUserDetailsModal && (
            <Modal
              isOpen={showUserDetailsModal}
              title="User Details"
              onClose={handleCloseUserDetailsModal}
              onSubmit={() => {}}
              body={
                <div>
                  <button
                    className="bg-yellow"
                    onClick={() => {
                      inviteFriend();
                    }}
                  >
                    INVITE DE FRIEND
                  </button>
                  <img
                    className="w-[150px] rounded-full"
                    src={searchResult.avatar}
                    alt="User Avatar"
                  />
                  <p>Name: {searchResult.name}</p>
                  <p>Discord: {searchResult.name}</p>
                  <p>Twitter: {searchResult.walletAddress}</p>

                  {/* Add other user details here */}
                </div>
              }
              footer={<div></div>}
            />
          )
        )}
      </div>

      <div className="grid h-[24rem] max-h-full grid-cols-1 gap-8 overflow-hidden overflow-y-scroll md:grid-cols-2">
        {nftData.map((nft, index) => (
          <div key={index} className="flex flex-col items-center">
            <img
              className="w-[75px] cursor-pointer"
              src={nft.image}
              alt={`NFT ${index}`}
            />
            <p> {nft.name}</p>
          </div>
        ))}
      </div>

      <div>
        {/* <input
        className="bg-yellow py-5 px-4"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="PUT UR NAME"
      />
      <button onClick={handleChangeName}>Change</button> */}
      </div>
    </div>
  );

  const footerContent = <div className=" flex flex-col gap-4"></div>;

  return (
    <Modal
      disabled={isLoading}
      isOpen={ProfileModal.isOpen}
      title="PROFILE"
      actionLabel="Continue"
      onClose={ProfileModal.onClose}
      onSubmit={() => {}}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default UserProfile;
