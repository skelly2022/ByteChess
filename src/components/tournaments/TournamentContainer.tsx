import React, { useEffect, useState } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import EventCalendar from "./EventCalendar";
import { api } from "~/utils/api";
import useTournamentModal from "~/hooks/useTournamentModal";

const TournamentContainer = () => {
  const tournament = useTournamentModal();
  const tournaments = api.tournament.getAllTournaments.useMutation({
    onSuccess(data, variables, context) {
      tournament.setTournaments(data);
    },
    onError(error) {
      console.log(error);
    },
  });

  useEffect(() => {
    tournaments.mutateAsync();
  }, []);

  return (
    <div className="h-[calc(100vh-112px)] w-full overflow-hidden p-3">
      <EventCalendar />
    </div>
  );
};

export default TournamentContainer;
