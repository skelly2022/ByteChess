import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import socket from "~/helpers/socket";
import usePlayModal from "~/hooks/usePlayModal";

const Timer = ({ type }: { type: string }) => {
  const play = usePlayModal();
  const router = useRouter();
  const { playID } = router.query;

  const [timeInSeconds, setTimeInSeconds] = useState<number>(0);
  const [opponentTimeInSeconds, setOpponentTimeInSeconds] = useState<number>(0);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isORunning, setIsORunning] = useState<boolean>(false);

  useEffect(() => {
    const initialTimeInSeconds = play.minutes * 60;
    setTimeInSeconds(initialTimeInSeconds);
    setOpponentTimeInSeconds(initialTimeInSeconds);
  }, [play.minutes]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const updateTimer = () => {
      setTimeInSeconds((prevTime) => {
        const newTime = prevTime - 0.01;
        return newTime > 0 ? newTime : 0;
      });
    };

    if (isRunning && timeInSeconds > 0) {
      timer = setInterval(updateTimer, 10);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isRunning, timeInSeconds]);

  useEffect(() => {
    let opponentTimer: NodeJS.Timeout;

    const updateOpponentTimer = () => {
      setOpponentTimeInSeconds((prevTime) => {
        const newTime = prevTime - 0.01;
        return newTime > 0 ? newTime : 0;
      });
    };

    if (isORunning && opponentTimeInSeconds > 0) {
      opponentTimer = setInterval(updateOpponentTimer, 10);
    }

    return () => {
      clearInterval(opponentTimer);
    };
  }, [isORunning, opponentTimeInSeconds]);
  useEffect(() => {
    if (play.opponentTime !== "") {
      setOpponentTimeInSeconds(play.opponentTime);
    }
  }, [play.opponentTime]);
  useEffect(() => {
    if (play.time !== "") {
      setTimeInSeconds(play.time);
    }
  }, [play.time]);
  useEffect(() => {
    setIsRunning(play.myTimer);
  }, [play.myTimer]);

  useEffect(() => {
    if (play.opponentTimer === true && timeInSeconds !== 0) {
      const data = { time: timeInSeconds, roomId: playID };
      socket.emit("time", data);
    }
    setIsORunning(play.opponentTimer);
  }, [play.opponentTimer]);

  useEffect(() => {
    socket.on("updateTime", (data) => {
      setOpponentTimeInSeconds(data);
    });
    socket.on("gameStarted", (roomData) => {
      console.log(roomData);
    });
  }, [socket]);

  const formatTime = (time: number): string => {
    if (time < 60) {
      const seconds = Math.floor(time);
      const milliseconds = Math.floor((time - seconds) * 100);
      return `${seconds}.${milliseconds.toString().padStart(2, "0")}`;
    } else {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
  };

  return (
    <div className="text-2xl font-bold">
      {type === "me" && formatTime(timeInSeconds)}
      {type === "opponent" && formatTime(opponentTimeInSeconds)}
    </div>
  );
};

export default Timer;
