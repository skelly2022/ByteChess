import { DayPicker } from "react-day-picker";
import React, { useEffect, useState } from "react";
import "react-day-picker/dist/style.css";
import "../../styles/Animations.module.css";
import useTournamentModal from "~/hooks/useTournamentModal";
import { format } from "date-fns";
const offsetToTimezone = {
  "-720": "UTC+12:00",
  "-660": "UTC+11:00",
  "-600": "UTC+10:00",
  "-570": "UTC+09:30",
  "-540": "UTC+09:00",
  "-525": "UTC+08:45",
  "-510": "UTC+08:30",
  "-480": "UTC+08:00",
  "-450": "UTC+07:30",
  "-420": "UTC+07:00",
  "-390": "UTC+06:30",
  "-360": "UTC+06:00",
  "-345": "UTC+05:45",
  "-330": "UTC+05:30",
  "-300": "UTC+05:00",
  "-270": "UTC+04:30",
  "-240": "UTC+04:00",
  "-210": "UTC+03:30",
  "-180": "UTC+03:00",
  "-120": "UTC+02:00",
  "-60": "UTC+01:00",
  "0": "UTC",
  "60": "UTC-01:00",
  "120": "UTC-02:00",
  "180": "UTC-03:00",
  "210": "UTC-03:30",
  "240": "UTC-04:00",
  "270": "UTC-04:30",
  "300": "UTC-05:00",
  "330": "UTC-05:30",
  "345": "UTC-05:45",
  "360": "UTC-06:00",
  "390": "UTC-06:30",
  "420": "UTC-07:00",
  "450": "UTC-07:30",
  "480": "UTC-08:00",
  "510": "UTC-08:30",
  "525": "UTC-08:45",
  "540": "UTC-09:00",
  "570": "UTC-09:30",
  "600": "UTC-10:00",
  "660": "UTC-11:00",
  "720": "UTC-12:00",
};
const TourneyTime = () => {
  const race = ["30 Minutes", "60 Minutes", "90 Minutes", "120 Minutes"];
  const tournament = useTournamentModal();
  const [selected, setSelected] = useState(tournament.date);
  const [isOpen, setIsOpen] = useState(false);
  const [haveText, setHaveText] = useState(tournament.duration);
  const [isOpenTime, setIsOpenTime] = useState(false);
  const [selectedTime, setSelectedTime] = useState(tournament.startTime);
  const getTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return options;
  };
  const timeOptions = getTimeOptions();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleTimeSelect = (time) => {
    const offset = new Date().getTimezoneOffset();
    const userTimezone = offsetToTimezone[offset] || "UTC"; // Default to "UTC" if no match is found
    console.log(userTimezone);
    setSelectedTime(`${time}`);
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
  useEffect(() => {
    tournament.setDate(selected);
  }, [selected]);
  return (
    <div className="h-full w-full flex-col items-center justify-center space-y-4 text-white">
      <h1 className="flex w-full items-center justify-center text-center">
        Date & Time
      </h1>
      <div className="flex w-full items-center justify-center gap-3 text-black">
        {" "}
        <div className="flex  ">
          <div className="relative inline-block text-left">
            <div>
              <button
                type="button"
                onClick={handleClickTime}
                className={`w-40 rounded-md bg-yellow px-4 py-2 `}
              >
                {!selectedTime ? "Choose Time" : tournament.startTime}
              </button>
            </div>
            {isOpenTime && (
              <div
                className="no-scrollbar absolute right-0 z-40 mt-2 h-[168px] w-40 origin-top-right overflow-scroll rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
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
              className={`w-40 rounded-md bg-yellow px-4 py-2 `}
            >
              {!haveText ? "Select Duration" : tournament.duration}
            </button>
          </div>
          {isOpen && (
            <div
              className="absolute right-0 z-40 mt-2 w-40 origin-top-right justify-start rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
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
          selected={tournament.date}
          onSelect={setSelected}
          className="flex justify-center rounded-lg bg-yellow px-2 py-3 shadow"
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
