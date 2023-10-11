import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import socket from "~/helpers/socket";
import usePlayModal from "~/hooks/usePlayModal";

const Timer = ({ type }: { type: string }) => {
  const play = usePlayModal();
  const router = useRouter();
  const { playID } = router.query;
  const [side, setSide] = useState(play.side);
  const [timeInSeconds, setTimeInSeconds] = useState<number>(0);
  const [opponentTimeInSeconds, setOpponentTimeInSeconds] = useState<number>(0);
  const [activeTimer, setActiveTimer] = useState<string | null>(null);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isORunning, setIsORunning] = useState<boolean>(false);
  useEffect(() => {
    const initialTimeInSeconds = play.minutes * 60;
    setTimeInSeconds(initialTimeInSeconds);
    setOpponentTimeInSeconds(initialTimeInSeconds);
  }, [play.minutes]);

  // Note: We need only one effect hook to handle both your timer and opponent timer.
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const updateMyTimer = () => {
      setTimeInSeconds((prevTime) => {
        const newTime = prevTime - 0.01;
        if (newTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return newTime;
      });
    };

    const updateOpponentTimer = () => {
      setOpponentTimeInSeconds((prevTime) => {
        const newTime = prevTime - 0.01;
        if (newTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return newTime;
      });
    };

    // This is where the decision is made for which timer to run.
    if (activeTimer) {
      if (activeTimer === side && timeInSeconds > 0) {
        timer = setInterval(updateMyTimer, 10);
      } else if (activeTimer !== side && opponentTimeInSeconds > 0) {
        timer = setInterval(updateOpponentTimer, 10);
      }
    }

    return () => {
      clearInterval(timer);
    };
  }, [activeTimer, timeInSeconds, opponentTimeInSeconds, side]);

  // Handle the timerUpdate from the server
  useEffect(() => {
    socket.on("timerUpdate", (data) => {
      const myNewTime = side === "white" ? data.whiteTime : data.blackTime;
      const opponentNewTime =
        side === "white" ? data.blackTime : data.whiteTime;

      setTimeInSeconds(myNewTime);
      setOpponentTimeInSeconds(opponentNewTime);

      if (data.activeTimer === side && myNewTime > 0) {
        setIsRunning(true);
        setIsORunning(false);
      } else if (data.activeTimer !== side && opponentNewTime > 0) {
        setIsRunning(false);
        setIsORunning(true);
      } else {
        setIsRunning(false);
        setIsORunning(false);
      }
    });

    return () => {
      socket.off("timerUpdate");
    };
  }, [socket, side]);
  useEffect(() => {
    // Handle the pauseTimers event from the server
    socket.on("pauseTimers", () => {
      setIsRunning(false);
      setIsORunning(false);
    });

    return () => {
      socket.off("pauseTimers");
    };
  }, [socket]);
  useEffect(() => {
    const timerInterval = 10; // 10 milliseconds
    let myTimer: NodeJS.Timeout;
    let opponentTimer: NodeJS.Timeout;

    if (isRunning) {
      myTimer = setInterval(() => {
        setTimeInSeconds((prevTime) => {
          const newTime = prevTime - timerInterval / 1000;
          if (newTime <= 0) {
            clearInterval(myTimer);
            return 0;
          }
          return newTime;
        });
      }, timerInterval);
    }

    if (isORunning) {
      opponentTimer = setInterval(() => {
        setOpponentTimeInSeconds((prevTime) => {
          const newTime = prevTime - timerInterval / 1000;
          if (newTime <= 0) {
            clearInterval(opponentTimer);
            return 0;
          }
          return newTime;
        });
      }, timerInterval);
    }

    return () => {
      clearInterval(myTimer);
      clearInterval(opponentTimer);
    };
  }, [isRunning, isORunning]);

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
  useEffect(() => {
    setSide(play.side);
  }, [play.side]);
  return (
    <div className="text-2xl font-bold">
      {type === "me" && formatTime(timeInSeconds)}
      {type === "opponent" && formatTime(opponentTimeInSeconds)}
    </div>
  );
};

export default Timer;
