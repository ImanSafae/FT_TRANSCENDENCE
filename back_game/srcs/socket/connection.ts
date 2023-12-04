import { Socket } from "socket.io";
import { Client } from "../models/client.model"
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export const handleConnection = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    console.log("new Client !");

    const client:Client = new Client(socket);

    //bind to avoid loose context
    socket.on('message', client.receiveMessage.bind(client));
    socket.on('disconnect', client.disconnect.bind(client));
}