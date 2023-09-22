import { io } from "..";
import { createAdapter } from "socket.io-redis";
import { redisPub, redisSub } from "./redisConnection";
import { Socket } from "socket.io";
import eventHandle from "../handleEvent";
import { disconnect } from "../playing";

const socketConnection = () => {
  io.adapter(createAdapter(redisPub, redisSub));

  io.on("connection",async (socket: Socket) => {

    await eventHandle(socket)
    
    socket.on("disconnect", () => {
      disconnect(socket);
    });
  });
};

export default socketConnection;