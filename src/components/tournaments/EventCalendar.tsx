import React, { useEffect, useRef, useState } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import Draggable from "./Drag";
import useTournamentModal from "~/hooks/useTournamentModal";
import { useRouter } from "next/router";

const EventCalendar = () => {
  const tournament = useTournamentModal();
  const [currentDate, setCurrentDate] = useState(new Date()); // Initialize with the current date
  const now = new Date(); // Get the current time
  const router = useRouter();
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
    const initialEvents = tournament.tournaments;
    const events = initialEvents.map((event) => {
      const eventStartTime = new Date(event.date);
      const durationInMinutes = parseInt(event.duration.split(" ")[0]);
      const eventEndTime = new Date(
        eventStartTime.getTime() + durationInMinutes * 60 * 1000,
      );
      return { ...event, startTime: eventStartTime, endTime: eventEndTime };
    });
    console.log(events);
    setEvents(events);

    console.log(tournament.tournaments);
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
        return "min-w-[400px]";
      case "60 Minutes":
        return "min-w-[400px]";
      case "90 Minutes":
        return "min-w-[600px]";
      case "120 Minutes":
        return "min-w-[800px]";
      default:
        return "min-w-[200px]";
    }
  };
  const [usedEvents, setUsedEvents] = useState([]);

  const renderEvent = (event) => {
    const isEventUsed = usedEvents.includes(event.id);
    console.log(isEventUsed);
    // Add the event's ID to the usedEvents array
    return isEventUsed ? (
      <div
        className={`w-200
      z-10 flex items-center justify-center bg-green p-2 `}
        key={event.id}
      >
        <div className="flex items-center gap-3">
          <div
            className="relative cursor-pointer rounded pr-4 md:block
            "
            style={{
              backgroundImage: `url(${event.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "50px",
              height: "50px",
            }}
          ></div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold"> {event.name}</h1>
            <h1> {event.type} Event</h1>
          </div>
        </div>
      </div>
    ) : (
      <div
        className={`w-200}
        z-10 flex items-center justify-center bg-green p-2 `}
        key={event.id}
      >
        <div className="flex items-center gap-3">
          <div
            className="relative cursor-pointer rounded pr-4 md:block"
            style={{
              backgroundImage: `url(${event.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "50px",
              height: "50px",
            }}
          ></div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold"> {event.name}</h1>
            <h1> {event.type} Event</h1>
          </div>
        </div>
      </div>
    );
  };

  // Update the usedEvents state when the component mounts
  useEffect(() => {
    const newUsedEvents = [];
    events.forEach((event) => {
      if (!usedEvents.includes(event.id)) {
        newUsedEvents.push(event.id);
      }
    });
    setUsedEvents((prevUsedEvents) => [...prevUsedEvents, ...newUsedEvents]);
  }, []);

  return (
    <div className="no-scrollbar h-[calc(100vh-150px)] w-full items-center justify-center overflow-x-auto px-2 py-3">
      <div className="mb-4 flex w-full flex-col items-center justify-center">
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
            className="absolute right-0 hidden cursor-pointer rounded bg-yellow px-3 py-2 shadow transition-transform active:scale-y-75 sm:block"
          >
            Create Tournament
          </button>
        </div>
        <button
          onClick={tournament.onOpen}
          className="right-0 flex cursor-pointer rounded bg-yellow px-3 py-2 shadow transition-transform active:scale-y-75 sm:hidden"
        >
          Create Tournament
        </button>
      </div>
      <Draggable>
        <div className="no-scrollbar relative m-3 flex h-[90%] w-full overflow-auto rounded-xl bg-yellow shadow">
          {timeSlots.map((time, index) => {
            const timeSlotDate = new Date(time);

            if (timeSlotDate < now) {
              // Don't display times that have already occurred
              return null;
            }

            let eventsToRender = [];

            // Filter events for this time slot
            events.forEach((event) => {
              const eventStartTime = new Date(event.startTime);
              const eventEndTime = new Date(event.endTime);

              // Check if the time slot falls within the event's duration
              if (
                timeSlotDate >= eventStartTime &&
                timeSlotDate < eventEndTime
              ) {
                eventsToRender.push(event);
              }
            });

            return (
              <div
                key={timeSlotDate.toISOString()}
                className={`flex h-full w-[200px] min-w-[200px] flex-col  py-2 text-center font-semibold`}
              >
                <div className="h-12" style={{ maxWidth: "200px" }}>
                  {timeSlotDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                {/* Render the events for this time slot */}
                {eventsToRender.length > 0 && (
                  <div className="flex flex-col ">
                    {eventsToRender.map((event) => (
                      <div
                        onClick={() => {
                          router.push(`/tournaments/${event.id}`);
                        }}
                      >
                        {renderEvent(event)}
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
