"use client";
import useTournamentModal from "~/hooks/useTournamentModal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import GameType from "~/components/tournaments/CreateTourney/GameType";
import TourneyTime from "~/components/tournaments/CreateTourney/TournyTime";
import CreateTourney from "~/components/tournaments/CreateTourney/CreateTourney";
import TourneyOpen from "./TourneyOpen";
import { api } from "~/utils/api";
enum STEPS {
  GAME = 0,
  DATE = 1,
  CREATE = 2,
}
const TournamentModal = () => {
  const tournament = useTournamentModal();
  const [step, setStep] = useState(STEPS.GAME);
  const [title, setTitle] = useState("Create a Tournament");
  const [isLoading, setIsLoading] = useState(false);
  const newTournament = api.tournament.newTournament.useMutation({
    async onSuccess(data) {
      tournament.setTournaments(data);
    },
    onError(error) {
      console.log(error);
    },
  });
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {},
  });

  const onBack = () => {
    setStep((state) => state - 1);
  };

  const onNext = () => {
    setStep((state) => state + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.CREATE) {
      return onNext();
    }
    const selectedDate = tournament.date; // This should be a Date object
    const selectedTime = tournament.startTime; // Example selected time in HH:mm format
    const [hours, minutes] = selectedTime.split(":");
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();

    //@ts-ignore

    const combinedDateTime = new Date(year, month, day, hours, minutes);

    newTournament.mutateAsync({
      date: combinedDateTime,
      name: tournament.name,
      type: tournament.type,
      duration: tournament.duration,
      image: tournament.image,
    });
    tournament.onClose();
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.CREATE) {
      return "Create";
    }

    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.GAME) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = <div className="flex flex-col gap-8 "></div>;

  if (step === STEPS.GAME) {
    bodyContent = (
      <div className="flex  h-full cursor-pointer flex-col gap-8 p-1">
        <GameType />
      </div>
    );
  }
  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex h-full flex-col gap-8 p-1">
        <TourneyTime />
      </div>
    );
  }
  if (step === STEPS.CREATE) {
    bodyContent = (
      <div className="flex h-full flex-col gap-8 p-1">
        <CreateTourney />
      </div>
    );
  }

  return (
    <TourneyOpen
      disabled={isLoading}
      isOpen={tournament.isOpen}
      title={title}
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.GAME ? undefined : onBack}
      onClose={tournament.onClose}
      body={bodyContent}
      // stage={step}
    />
  );
};

export default TournamentModal;
