"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const logger_1 = __importDefault(require("../logger"));
const playing_1 = require("../playing");
const eventHandle = (socket) => {
    try {
        socket.onAny((eventName, data) => {
            logger_1.default.info(`REQUEST EVENT NAME :${eventName}  : REQUEST DATA : ${JSON.stringify(data.data)}`);
            switch (eventName) {
                case constants_1.EVENT_NAME.JOIN_GAME:
                    (0, playing_1.joinGame)(data, socket);
                    break;
                case constants_1.EVENT_NAME.MOVE:
                    (0, playing_1.move)(data, socket);
                    break;
            }
        });
    }
    catch (error) {
        logger_1.default.error("CATCH_ERROR IN  eventHandle : ", error);
    }
};
exports.default = eventHandle;
