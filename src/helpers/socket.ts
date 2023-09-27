import { io } from "socket.io-client"; // import connection function

const socket = io("https://radiant-ravine-53237-f2027613dfda.herokuapp.com/"); // initialize websocket connection
// const socket = io("localhost:8080"); // initialize websocket connection

export default socket;
