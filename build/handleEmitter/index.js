"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const __1 = require("..");
const logger_1 = __importDefault(require("../logger"));
class Event {
    sendToSocket(socketId, data) {
        try {
            logger_1.default.info(`sendToSocket : RESPONSE EVENT NAME :${data.eventName} RESPONSE DATA : ${JSON.stringify(data)}`);
            __1.io.to(socketId).emit(data.eventName, data);
        }
        catch (error) {
            logger_1.default.error("CATCH_ERROR IN sendToSocket : ", error);
        }
    }
    sendToRoom(tableId, data) {
        try {
            logger_1.default.info(`sendToRoom : RESPONSE EVENT NAME :${data.eventName} RESPONSE DATA : ${JSON.stringify(data)}`);
            __1.io.to(tableId).emit(data.eventName, data);
        }
        catch (error) {
            logger_1.default.error(`CATCH_ERROR IN sendToRoom : ${error}`);
        }
    }
}
module.exports = new Event();
