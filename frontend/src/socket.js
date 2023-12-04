import { io } from "socket.io-client";
let hostname;
if (import.meta.env.SSR === false) {
    hostname = location.hostname;
}
const URL = `http://${hostname}:3000`;
const socket = io(URL, { autoConnect: false });
export default socket;
//# sourceMappingURL=socket.js.map