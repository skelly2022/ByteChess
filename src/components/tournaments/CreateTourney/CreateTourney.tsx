//@ts-nocheck

import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import useTournamentModal from "~/hooks/useTournamentModal";
import { format } from "date-fns";
import useUserModal from "~/hooks/useUserStore";

const breakpoints = {
  small: 576,
  medium: 768,
  large: 992,
  extraLarge: 1200,
};
const CreateTourney = () => {
  const tournament = useTournamentModal();
  const user = useUserModal();
  const [selectedMode, setSelectedMode] = useState(tournament.type); // Mode selection
  const [selectedDate, setSelectedDate] = useState(tournament.date); // Date selection
  const [selectedName, setSelectedName] = useState(tournament.name); // Date selection

  const [selectedTime, setSelectedTime] = useState(tournament.startTime); // Time selection
  const [selectedDuration, setSelectedDuration] = useState(tournament.duration); // Duration selection
  const [boardWrapper, setBoardWrapper] = useState({
    width: `80.33vh`,
  });
  const [windowWidth, setWindowWidth] = useState(null);
  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };
  const formatTimeWithUserTimezone = (timeOption) => {
    const [hour, minute] = timeOption.split(":");
    const date = new Date();
    date.setHours(parseInt(hour, 10));
    date.setMinutes(parseInt(minute, 10));

    const options = {
      hour: "numeric",
      minute: "numeric",
    };

    const formattedTime = date.toLocaleTimeString("en-US", options);
    return formattedTime;
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
        setBoardWrapper({ width: `94.7vw` });
      } else if (windowWidth < breakpoints.large) {
        setBoardWrapper({ width: `60.33vh` });
      } else {
        setBoardWrapper({ width: `60.33vh` });
      }
    }
  }, [windowWidth]);
  const pictureDivStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)", // Center the div horizontally and vertically
    zIndex: 20,
  };
  return (
    <div className="  h-full w-full">
      <div className="flex h-full w-full items-center justify-center">
        <div style={boardWrapper} className="relative">
          <Chessboard />
        </div>
      </div>
      <div
        className="absolute  left-[0%] top-[10%] z-20  flex h-5/6 w-5/6 items-center justify-center rounded-xl bg-white bg-opacity-[.93] text-center font-semibold text-black md:left-[25%]"
        style={pictureDivStyle} // Apply the style here
      >
        <div className="flex h-full w-1/3 items-center justify-center">
          <div
            className="relative cursor-pointer rounded md:block"
            style={{
              backgroundImage: `url(${tournament.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "200px",
              height: "200px",
            }}
          ></div>
        </div>

        <div className="flex h-full w-1/2 flex-col  justify-end p-4 text-black ">
          <div className="mb-4 w-full">
            <div className=" rounded bg-gray-200 px-4 py-2 font-extrabold">
              {selectedName}
            </div>
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Mode:</label>
            <div className=" rounded bg-gray-200 px-4 py-2 font-extrabold">
              {selectedMode}
            </div>
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Date:</label>
            <div className=" rounded bg-gray-200 px-4 py-2 font-extrabold">
              {format(selectedDate, "PP")}
            </div>
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Time:</label>
            <div className=" rounded bg-gray-200 px-4 py-2 font-extrabold">
              {formatTimeWithUserTimezone(selectedTime)}
              {/* Default to UTC */}
            </div>
          </div>
          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium">Duration:</label>
            <div className=" rounded bg-gray-200 px-4 py-2 font-extrabold">
              {selectedDuration}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTourney;
