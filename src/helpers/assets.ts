const blackStyle = {
  backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMi41IDExLjYzVjYiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz48cGF0aCBkPSJNMjIuNSAyNXM0LjUtNy41IDMtMTAuNWMwIDAtMS0yLjUtMy0yLjVzLTMgMi41LTMgMi41Yy0xLjUgMyAzIDEwLjUgMyAxMC41IiBmaWxsPSIjMDAwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIvPjxwYXRoIGQ9Ik0xMS41IDM3YzUuNSAzLjUgMTUuNSAzLjUgMjEgMHYtN3M5LTQuNSA2LTEwLjVjLTQtNi41LTEzLjUtMy41LTE2IDRWMjd2LTMuNWMtMy41LTcuNS0xMy0xMC41LTE2LTQtMyA2IDUgMTAgNSAxMFYzN3oiIGZpbGw9IiMwMDAiLz48cGF0aCBkPSJNMjAgOGg1IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PHBhdGggZD0iTTMyIDI5LjVzOC41LTQgNi4wMy05LjY1QzM0LjE1IDE0IDI1IDE4IDIyLjUgMjQuNWwuMDEgMi4xLS4wMS0yLjFDMjAgMTggOS45MDYgMTQgNi45OTcgMTkuODVjLTIuNDk3IDUuNjUgNC44NTMgOSA0Ljg1MyA5IiBzdHJva2U9IiNlY2VjZWMiLz48cGF0aCBkPSJNMTEuNSAzMGM1LjUtMyAxNS41LTMgMjEgMG0tMjEgMy41YzUuNS0zIDE1LjUtMyAyMSAwbS0yMSAzLjVjNS41LTMgMTUuNS0zIDIxIDAiIHN0cm9rZT0iI2VjZWNlYyIvPjwvZz48L3N2Zz4=')`,
  width: "45px", // Set your desired width and height here
  height: "45px",
};
const whiteStyle = {
  backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMi41IDExLjYzVjZNMjAgOGg1IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PHBhdGggZD0iTTIyLjUgMjVzNC41LTcuNSAzLTEwLjVjMCAwLTEtMi41LTMtMi41cy0zIDIuNS0zIDIuNWMtMS41IDMgMyAxMC41IDMgMTAuNSIgZmlsbD0iI2ZmZiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz48cGF0aCBkPSJNMTEuNSAzN2M1LjUgMy41IDE1LjUgMy41IDIxIDB2LTdzOS00LjUgNi0xMC41Yy00LTYuNS0xMy41LTMuNS0xNiA0VjI3di0zLjVjLTMuNS03LjUtMTMtMTAuNS0xNi00LTMgNiA1IDEwIDUgMTBWMzd6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTExLjUgMzBjNS41LTMgMTUuNS0zIDIxIDBtLTIxIDMuNWM1LjUtMyAxNS41LTMgMjEgMG0tMjEgMy41YzUuNS0zIDE1LjUtMyAyMSAwIi8+PC9nPjwvc3ZnPg==')`,
  width: "45px", // Set your desired width and height here
  height: "45px",
};

const half = {
  backgroundImage: `url('https://lichess1.org/assets/_VCyzdj/images/wbK.svg')`,
  backgroundSize: "65px 65px",
  width: "65px",
  height: "65px",
};

function extractFirstAndLast5Characters(inputString) {
  if (typeof inputString !== "string" || inputString.length < 10) {
    return null; // Return null for invalid input
  }

  const first5 = inputString.substring(0, 5);
  const last5 = inputString.substring(inputString.length - 5);

  return `${first5}..${last5}`;
}
function formatTimeDifference(startDate) {
  // Get the current time in milliseconds since the epoch
  const currentTime = new Date().getTime();

  // Calculate the time difference in milliseconds
  const timeDifference = startDate - currentTime;

  // Check if the countdown has reached zero or negative
  if (timeDifference <= 0) {
    return "00:00:00"; // Return zero when the countdown is over
  }

  // Convert the time difference to seconds
  const timeDifferenceInSeconds = Math.floor(timeDifference / 1000);

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(timeDifferenceInSeconds / 3600);
  const minutes = Math.floor((timeDifferenceInSeconds % 3600) / 60);
  const seconds = timeDifferenceInSeconds % 60;

  // Format the time difference as "hh:mm:ss"
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )}:${String(seconds).padStart(2, "0")}`;
}
function getRandomColor(preferredColor: string) {
  if (preferredColor === "white") {
    return "white";
  } else if (preferredColor === "black") {
    return "black";
  } else if (preferredColor === "wb" || !preferredColor) {
    // Generate a random number between 0 and 1
    const randomValue = Math.random();

    // Use the random number to determine the color
    if (randomValue < 0.5) {
      return "white";
    } else {
      return "black";
    }
  } else {
    throw new Error("Invalid color option");
  }
}
function getTimeControlFromString(input) {
  switch (input.toLowerCase()) {
    case "bullet":
      return "1 + 0";
    case "blitz":
      return "3 + 2";
    case "rapid":
      return "15 + 10";
    default:
      return "Unknown time control";
  }
}
export default {
  whiteStyle,
  blackStyle,
  getRandomColor,
  getTimeControlFromString,
  extractFirstAndLast5Characters,
  formatTimeDifference,
  half,
};
