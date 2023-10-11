//@ts-nocheck

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useTournamentModal from "~/hooks/useTournamentModal";
import assets from "~/helpers/assets";
import Image from "next/image";
import useUserModal from "~/hooks/useUserStore";
import { AiTwotoneEdit } from "react-icons/ai";
import { api } from "~/utils/api";
import Draggable from "../Drag";
import Loading from "~/components/Loading";

const { extractFirstAndLast5Characters } = assets;

const dataOptions = [
  { dataId: "1+0", clock: "1+0", perf: "Bullet" },
  { dataId: "3+2", clock: "3+2", perf: "Blitz" },
  { dataId: "15+10", clock: "15+10", perf: "Rapid" },
  { dataId: "∞", clock: "∞", perf: "Unlimited" },
];

const GameType = () => {
  const session = useSession();
  const user = useUserModal();
  const tournament = useTournamentModal();
  const [myImages, setMyImages] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedImage, setSelectedImage] = useState(user.user.avatar);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const data = api.example.getAllNfts.useMutation({
    async onSuccess(data) {
      setMyImages(data);
      setTimeout(() => {
        setImagesLoaded(true);
      }, 5000);
    },
    onError(error) {
      console.log(error);
    },
  });

  const openEditPopup = () => {
    if (myImages.length === 0) {
      data.mutateAsync({ address: session.data.user.name });
    } else {
    }
    setIsEditPopupOpen(true);
  };

  const closeEditPopup = () => {
    setIsEditPopupOpen(false);
  };

  const selectImage = (image: any) => {
    setSelectedImage(image);
    setIsEditPopupOpen(false);
  };

  useEffect(() => {
    setSelectedGame(tournament.type);
  }, [tournament.type]);

  useEffect(() => {
    tournament.setTournamentImage(selectedImage);
  }, [selectedImage]);

  // Calculate the number of columns for the image grid
  const numImages = myImages.length;
  const numColumns = Math.ceil(numImages / 2); // 2 rows

  // CSS for the grid container
  const gridContainerStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${numColumns}, 1fr)`, // Dynamic number of columns
    gridTemplateRows: "repeat(3, 1fr)", // 2 rows
    gap: "10px", // Adjust as needed
    overflow: "auto", // Enable horizontal overflow
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-evenly gap-2 text-black">
      <div className="flex h-1/3 w-full items-center">
        <div className="flex h-full w-1/2 items-center justify-center">
          <div
            className="relative cursor-pointer rounded md:block"
            style={{
              backgroundImage: `url(${selectedImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "200px",
              height: "200px",
            }}
          >
            <div className="absolute right-3 top-3">
              <AiTwotoneEdit
                size={30}
                className="transform rounded-full border border-black px-1 transition-transform hover:scale-105 hover:bg-green active:scale-90"
                onClick={openEditPopup} // Open the edit popup on click
              />
            </div>
          </div>
          {isEditPopupOpen && (
            <div className="absolute left-1/2 top-1/2 h-full w-5/6 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-green p-4 shadow-lg">
              {!imagesLoaded ? (
                <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-gray-200">
                  <Loading />
                </div>
              ) : (
                <div className="relative flex h-full w-full flex-col items-center">
                  <h1 className="pb-5 text-3xl">Choose Image</h1>
                  <div className="flex h-full w-[90%] justify-center">
                    <Draggable>
                      <div
                        className="no-scrollbar h-full"
                        style={gridContainerStyle}
                      >
                        {myImages.map((imageObj, index) => (
                          <div
                            key={index}
                            className="relative h-[100px] w-[100px]"
                          >
                            <img
                              src={imageObj.image}
                              alt={`Tournament Image ${index + 1}`}
                              className="h-full w-full rounded-lg object-cover"
                              onClick={() => {
                                selectImage(imageObj.image);
                              }}
                              onError={() => {
                                // Remove the broken image from the list
                                const updatedImages = [...myImages];
                                updatedImages.splice(index, 1);
                                setMyImages(updatedImages);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </Draggable>
                  </div>
                </div>
              )}
              <button
                className="absolute right-3 top-2 text-2xl"
                onClick={closeEditPopup}
              >
                X
              </button>
            </div>
          )}
        </div>
        <div className="flex w-1/2 flex-col gap-6">
          <div className="flex w-full flex-col items-center justify-center ">
            <input
              type="text"
              className="form-control ml-[20px] mt-[10px] w-5/6 rounded-xl p-5 py-4"
              placeholder="Enter Tournament Name Here..."
              onChange={(e) => tournament.setName(e.target.value)}
              value={tournament.name}
            />
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-4 ">
            <h1 className="text-white">Tournament Organizer:</h1>
            <h1 className="text-white">
              {extractFirstAndLast5Characters(session.data.user.name)}
            </h1>
          </div>
        </div>
      </div>
      <div className="w-full">
        <h1 className="flex w-full items-center justify-center text-center text-white">
          Game Type
        </h1>
        <div className="grid max-h-[220px] grid-cols-2 gap-2 overflow-x-auto p-3">
          {dataOptions.map((item) => (
            <div
              key={item.dataId}
              data-id={item.dataId}
              className={`flex flex-col items-center justify-center rounded-sm ${
                selectedGame === item.perf
                  ? "border border-yellow bg-green"
                  : "bg-yellow"
              }`}
              onClick={() => {
                tournament.setType(item.perf);
              }}
            >
              <div className="clock">{item.clock}</div>
              <div className="perf">{item.perf}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameType;
