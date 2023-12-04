import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const getConnectedClient = (io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    return Object.keys(io.sockets.sockets);
}