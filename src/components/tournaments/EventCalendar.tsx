import React, { useEffect, useRef, useState } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import Draggable from "./Drag";
import useTournamentModal from "~/hooks/useTournamentModal";

const EventCalendar = () => {
  const tournament = useTournamentModal();
  const [currentDate, setCurrentDate] = useState(new Date()); // Initialize with the current date
  const now = new Date(); // Get the current time

  // EXAMPLE OF DATE OBJECT
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
  const [events, setEvents] = useState([]);
  useEffect(() => {
    setEvents(tournament.tournaments);
  }, [tournament.tournaments]);

  const handleDateChange = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 1); // Previous day
    } else if (direction === "next") {
      newDate.setDate(newDate.getDate() + 1); // Next day
    }
    setCurrentDate(newDate);
  };

  const getMinWidth = (duration) => {
    switch (duration) {
      case "30 Minutes":
        return 200;
      case "60 Minutes":
        return 400;
      case "90 Minutes":
        return 600;
      case "120 Minutes":
        return 800;
      default:
        return 200; // Default to 200px if the duration doesn't match any of the cases
    }
  };

  return (
    <div className="no-scrollbar h-[calc(100vh-150px)] w-full items-center justify-center overflow-x-auto px-2 py-3">
      <div className="mb-4 flex w-full items-center justify-center">
        <div className="relative flex w-full items-center justify-center space-x-2">
          <button onClick={() => handleDateChange("prev")}>
            <AiOutlineArrowLeft size={30} />
          </button>
          <h2 className="text-2xl font-semibold">
            {currentDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h2>
          <button onClick={() => handleDateChange("next")}>
            <AiOutlineArrowRight size={30} />
          </button>
          <button
            onClick={tournament.onOpen}
            className="absolute right-0 cursor-pointer rounded bg-yellow px-3 py-2 shadow transition-transform active:scale-y-75"
          >
            Create Tournament
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

            // Filter events for this time slot
            const eventsForTimeSlot = events.filter((event) => {
              const eventStartTime = new Date(event.date);
              eventStartTime.setSeconds(0); // Set seconds to 0 for precise comparison

              // Check if the time slot falls within the event's start time
              return (
                timeSlotDate.getFullYear() === eventStartTime.getFullYear() &&
                timeSlotDate.getMonth() === eventStartTime.getMonth() &&
                timeSlotDate.getDate() === eventStartTime.getDate() &&
                timeSlotDate.getHours() === eventStartTime.getHours() &&
                timeSlotDate.getMinutes() === eventStartTime.getMinutes()
              );
            });

            return (
              <div
                key={timeSlotDate.toISOString()}
                className="flex h-full w-[200px] min-w-[200px] flex-col py-2 text-center font-semibold"
              >
                <div className="h-12" style={{ maxWidth: "200px" }}>
                  {timeSlotDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                {/* Render the events for this time slot */}
                {eventsForTimeSlot.length > 0 && (
                  <div className="flex flex-col">
                    {eventsForTimeSlot.map((event) => (
                      <div
                        key={event.id}
                        className={`min-w-[${getMinWidth(
                          event.duration, // Use the duration of each individual event
                        )}px] bg-white`}
                      >
                        {event.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {/* Center-align content when fewer columns than available width */}
          <div className="mx-auto flex-grow justify-center"></div>
        </div>
      </Draggable>
    </div>
  );
};

export default EventCalendar;
