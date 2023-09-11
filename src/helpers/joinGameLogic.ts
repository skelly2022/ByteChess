const getOppositeColor = (color: any) => {
  return color === "white" ? "black" : "white";
};

const categorizeChessGame = (timeString) => {
  // Split the time string into minutes and seconds
  const [minutes, seconds] = timeString
    .split("+")
    .map((part) => parseInt(part.trim()));

  // Convert the time to total seconds
  const totalTimeInSeconds = minutes * 60 + seconds;
  if (minutes < 3) {
    return "Bullet";
  } else if (minutes > 3 && minutes < 10) {
    return "Blitz";
  } else {
    return "Rapid";
  }
};

export default { getOppositeColor, categorizeChessGame };
