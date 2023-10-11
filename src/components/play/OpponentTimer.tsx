import React, { useEffect } from "react";
import { useTimer } from "react-timer-hook";
import usePlayModal from "~/hooks/usePlayModal";

export default function OpponentTimer({ expiryTimestamp }) {
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called"),
  });

  const play = usePlayModal();
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
    pause();
  }, []);

  useEffect(() => {
    if (play.opponentTimer === true) {
      resume();
    }
    if (play.opponentTimer === false) {
      pause();
    }
  }, [play.opponentTimer]);

  return (
    <div style={{ textAlign: "center" }}>
      {/* <h1>react-timer-hook </h1>
      <p>Timer Demo</p> */}
      <div style={{ fontSize: "20px" }}>
        <span>{formatTime(totalSeconds)}</span>
      </div>
      {/* <p>{isRunning ? "Running" : "Not running"}</p> */}
      {/* <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      <button onClick={resume}>Resume</button> */}
      {/* <button
        onClick={() => {
          // Restarts to 5 minutes timer
          const time = new Date();
          time.setSeconds(time.getSeconds() + 60);
          restart(time);
        }}
      >
        Restart
      </button> */}
    </div>
  );
}
