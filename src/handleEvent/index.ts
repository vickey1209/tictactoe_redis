import { EVENT_NAME } from "../constants";
import { Socket } from "socket.io";
import logger from "../logger";
import {  joinGame, move } from "../playing";

const eventHandle = (socket: Socket) => {
  try {
    socket.onAny((eventName: string, data: any) => {
      logger.info(`REQUEST EVENT NAME :${eventName}  : REQUEST DATA : ${JSON.stringify(data.data)}`)
      switch (eventName) {
        case EVENT_NAME.JOIN_GAME:
          joinGame(data, socket);
        break;
        case EVENT_NAME.MOVE:
            move(data,socket);
        break;
      }
    });
  } catch (error) {
    
    logger.error("CATCH_ERROR IN  eventHandle : ", error);
  }
};

export default eventHandle;
