import React, { useState } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import EventCalendar from "./EventCalendar";

const TournamentContainer = () => {
  return (
    <div className="h-[calc(100vh-112px)] w-full overflow-hidden p-3">
      <EventCalendar />
    </div>
  );
};

export default TournamentContainer;
