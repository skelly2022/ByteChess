import { io } from "socket.io-client"; // import connection function

// const socket = io("https://socketplayserver-b7f41e773cfa.herokuapp.com/"); // initialize websocket connection
const socket = io("localhost:8080"); // initialize websocket connection
export default socket;
