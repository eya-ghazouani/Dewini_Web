import io from "socket.io-client";
const sockets = io("http://localhost:4000");
export default sockets;
