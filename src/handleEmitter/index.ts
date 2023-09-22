import  {io}  from "..";
import logger from "../logger";

 class Event {
  sendToSocket(socketId: string, data: any) {
    try {
      logger.info( `sendToSocket : RESPONSE EVENT NAME :${data.eventName} RESPONSE DATA : ${JSON.stringify(data)}`)
      io.to(socketId).emit(data.eventName, data);
    } catch (error) {
      logger.error("CATCH_ERROR IN sendToSocket : ", error);
    }
  }

  sendToRoom(tableId: string, data: any) {
    try {
      logger.info( `sendToRoom : RESPONSE EVENT NAME :${data.eventName} RESPONSE DATA : ${JSON.stringify(data)}`)
      io.to(tableId).emit(data.eventName, data);
    } catch (error) {
      logger.error(`CATCH_ERROR IN sendToRoom : ${error}`);
    }
  }
}
export =new Event();