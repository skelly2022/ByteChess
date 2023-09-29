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
  const bodyContent = (
    <div className="grid grid-cols-1 gap-8 p-1 md:grid-cols-2">
      <div className="flex flex-col gap-8 p-1">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="font-bold text-white">
            <div>
              <input
                className="bg-yellow px-5 py-3 font-bold text-green"
                placeholder="SEARCH A FRIEND"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button onClick={handleSearch}>SEARCH</button>
            </div>

            <div className="flex items-center">
              {" "}
              {/* First Row */}
              <img
                className="w-[150px] rounded-full"
                src={user.user.avatar}
                alt="User Avatar"
              />
              <div className="ml-4 block">
                <p className="">Name: {user.user.name}</p>
                <p>Discord: {user.user.name}</p>
                <p>Twitter: {user.user.walletAddress}</p>
              </div>
            </div>

            <div className="flex flex-col">
              {" "}
              {/* Second Row */}
              <p>Puzzle Rating: {user.user.puzzleRating}</p>
              <p>Puzzle puzzleRatingChain: {user.user.puzzleRatingChain}</p>
              {/* <p>Puzzle puzzles Played: {user.user.completedPuzzles.length}</p> */}
              <p>PLAYR RANK: ()</p>
            </div>
          </div>
        )}

        {loading2 ? (
          <p>Loading...</p>
        ) : (
          showUserDetailsModal && (
            <Modal
              isOpen={showUserDetailsModal}
              title="User Details"
              onClose={handleCloseUserDetailsModal}
              onSubmit={() => {}}
              body={
                <div>
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
              onClick={() => {
                getAvatar.mutateAsync({
                  address: session.data.user.name,
                  Image: `${nft.image}`,
                });
              }}
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
