
import express, { Request, Response } from "express";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import dotenv from 'dotenv';

import logger from "./logger";
import socketConnection from "./connection/socketConnection";
dotenv.config({path:'./.env'});

const app = express();
const httpServer = http.createServer(app);
const io: Server = new Server(httpServer, {
  cors:
  { origin: "*" },
  transports: ["polling", "websocket"],
  pingInterval: 2000,
  pingTimeout: 2500,
});
socketConnection(); 

app.use(express.static(path.join(__dirname, "./views")));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "./views/game.html"));
});

let port=process.env.PORT || 8009;
// let port=process.argv[2];
httpServer.listen(port, () => {
  logger.info("server is running on port : ",port)
});


export  {io}
