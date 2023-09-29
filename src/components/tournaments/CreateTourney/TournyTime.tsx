import { DayPicker } from "react-day-picker";
import React, { useEffect, useState } from "react";
import "react-day-picker/dist/style.css";
import "../../styles/Animations.module.css";
import useTournamentModal from "~/hooks/useTournamentModal";
import { format } from "date-fns";

const TourneyTime = () => {
  const race = ["30 Minutes", "60 Minutes", "90 Minutes", "120 Minutes"];
  const tournament = useTournamentModal();
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [haveText, setHaveText] = useState("");
  const [isOpenTime, setIsOpenTime] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const getTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour <= 11; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return options;
  };
  const timeOptions = getTimeOptions();
  const modifiers = {
    thursdays: { daysOfWeek: [4] },
    birthday: selected,
  };
  const modifiersStyles = {
    birthday: {
      color: "white",
      backgroundColor: "#ffc107",
    },
    thursdays: {
      color: "#ffc107",
      backgroundColor: "#fffdee",
    },
  };
  useEffect(() => {
    tournament.setDate(format(selected, "PP"));
  }, [selected]);
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    tournament.setStartTime(time);

    setIsOpenTime(!isOpenTime);
  };

  const handleClickTime = () => {
    setIsOpenTime(!isOpenTime);
  };

  const handleText = (item) => {
    setHaveText(item);
    tournament.setDuration(item);
    setIsOpen(false);
  };
  return (
    <div className="h-full w-full flex-col items-center justify-center space-y-4 text-white">
      <h1 className="flex w-full items-center justify-center text-center">
        Date & Time
      </h1>
      <div className="flex w-full items-center justify-evenly">
        {" "}
        <div className="flex  ">
          <div className="relative inline-block text-left">
            <div>
              <button
                type="button"
                onClick={handleClickTime}
                className={`${
                  isOpen
                    ? "bg-gray-700 text-white"
                    : "bg-gray-500 text-gray-100"
                } w-64 rounded-md px-4 py-2`}
              >
                {!selectedTime ? "Choose Time" : selectedTime}
              </button>
            </div>
            {isOpenTime && (
              <div
                className="no-scrollbar absolute right-0 mt-2 h-[168px] w-64 origin-top-right overflow-scroll rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <div className="py-1" role="none">
                  {timeOptions.map((time) => (
                    <div
                      onClick={() => handleTimeSelect(time)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      key={time}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="relative inline-block text-left">
          <div>
            <button
              type="button"
              onClick={handleClick}
              className={`${
                isOpen ? "bg-gray-700 text-white" : "bg-gray-500 text-gray-100"
              } w-64 rounded-md px-4 py-2`}
            >
              {!haveText ? "Select Duration" : haveText}
            </button>
          </div>
          {isOpen && (
            <div
              className="absolute right-0 mt-2 w-64 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <div className="py-1" role="none">
                {race.map((item) => (
                  <div
                    onClick={() => handleText(item)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    key={item.toString()}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-5 space-y-2">
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={setSelected}
          className="bg-yellow flex justify-center rounded-lg px-2 py-3 shadow"
          // No need for onChange in DayPicker

          styles={{
            head_cell: {
              width: "60px",
            },
            table: {
              maxWidth: "none",
            },
            day: {
              margin: "auto",
            },
          }}
        />
      </div>
    </div>
  );
};

export default TourneyTime;
