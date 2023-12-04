import { Server } from 'socket.io';
import { handleConnection  } from './connection';
import http from 'http';
require('dotenv').config();

const server = http.createServer();

export const initialize = () => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  const port: number = 4242;

  console.log("initialize socket on port: " + port)

  io.on('connection', handleConnection);
  server.listen(port);
}