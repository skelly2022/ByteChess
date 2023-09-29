import React, { useRef, useState } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import Draggable from "./Drag";
import useTournamentModal from "~/hooks/useTournamentModal";

const EventCalendar = () => {
  const tournament = useTournamentModal();
  const [currentDate, setCurrentDate] = useState(new Date()); // Initialize with the current date
  const now = new Date(); // Get the current time

  // Calculate the start time based on the current date
  const startTime = new Date(currentDate);
  startTime.setHours(0, 0, 0, 0); // Set to 00:00:00

  // Calculate the end time based on the current date
  const endTime = new Date(currentDate);
  endTime.setHours(23, 59, 59, 999); // Set to 23:59:59.999

  // Generate an array of time slots for the day
  const timeSlots = [];
  let currentTime = startTime;

  while (currentTime <= endTime) {
    timeSlots.push(currentTime);
    currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000); // Add 30 minutes
  }

  // Define some sample events
  const [events, setEvents] = useState([
    {
      title: "Event 1",
      start: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        23,
        0,
      ),
      end: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        24,
        0,
      ),
    },
    // Add more events as needed
  ]);

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
  };

  return (
    <div className="no-scrollbar h-[calc(100vh-150px)] w-full  items-center justify-center overflow-x-auto  px-2 py-3">
      <div className="mb-4 flex w-full items-center justify-center">
        <div className=" relative flex w-full items-center justify-center space-x-2">
          <button
            onClick={() =>
              handleDateChange(new Date(currentDate.getTime() - 86400000))
            }
          >
            <AiOutlineArrowLeft size={30} />
          </button>
          <h2 className="text-2xl font-semibold">
            {currentDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h2>
          <button
            onClick={() =>
              handleDateChange(new Date(currentDate.getTime() + 86400000))
            }
          >
            <AiOutlineArrowRight size={30} />
          </button>
          <button
            onClick={tournament.onOpen}
            className="absolute right-0 cursor-pointer rounded bg-yellow px-3 py-2 shadow transition-transform active:scale-y-75"
          >
            Create Tournament{" "}
          </button>
        </div>
      </div>
      <Draggable>
        <div className="no-scrollbar relative m-3 flex h-[90%] w-full overflow-auto rounded-xl bg-yellow shadow">
          {timeSlots.map((time, index) => {
            const timeSlotDate = new Date(time);

            if (timeSlotDate < now) {
              // Don't display times that have already occurred
              return null;
            }

            // Find any events that overlap with this time slot
            const eventForTimeSlot = events.find((event) => {
              const eventStart = event.start;
              const eventEnd = event.end;

              return (
                eventStart.getHours() === timeSlotDate.getHours() &&
                eventStart.getMinutes() === timeSlotDate.getMinutes()
              );
            });

            // Calculate the duration of the event in minutes
            let eventDurationMinutes = 0; // Default value for when there's no matching event

            if (eventForTimeSlot) {
              eventDurationMinutes =
                (eventForTimeSlot.end.getTime() -
                  eventForTimeSlot.start.getTime()) /
                (1000 * 60);
            }

            // Determine the minimum width class based on the duration
            let eventMinWidthClass = "min-w-[200px]"; // Default value for events less than an hour
            if (eventDurationMinutes >= 60) {
              // For events that are at least 1 hour long
              eventMinWidthClass = "min-w-[400px]";
            }
            if (eventDurationMinutes >= 90) {
              // For events that are at least 1.5 hours long
              eventMinWidthClass = "min-w-[600px]";
            }

            // Calculate z-index for events
            const zIndex = eventForTimeSlot ? 1 : 0;
            return (
              <div
                key={timeSlotDate.toISOString()}
                className="flex h-full w-[200px] min-w-[200px] flex-col  py-2 text-center font-semibold"
              >
                <div className="h-12" style={{ maxWidth: "200px" }}>
                  {timeSlotDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                {/* Render the event header row separately */}
                {eventForTimeSlot && (
                  <div
                    className={`bg-white ${eventMinWidthClass}`}
                    style={{ zIndex: "999" }}
                  >
                    {eventForTimeSlot.title}
                  </div>
                )}
              </div>
            );
            // Render the time slot
          })}
          {/* Center-align content when fewer columns than available width */}
          <div className="mx-auto flex-grow justify-center"></div>
        </div>
      </Draggable>
    </div>
  );
};

export default EventCalendar;
