"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../../constants");
const logger_1 = __importDefault(require("../../logger"));
const joinGameValidation = (data) => {
    const schema = joi_1.default.object().keys({
        eventName: joi_1.default.string().valid(constants_1.EVENT_NAME.JOIN_GAME).required(),
        data: joi_1.default.object().keys({
            userData: joi_1.default.array().required(),
            board: joi_1.default.array().allow(null).length(9).required(),
            tableId: joi_1.default.string().required(),
            status: joi_1.default.string().required(),
            userId: joi_1.default.string().required()
        })
    });
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
        logger_1.default.error("res join_game_validation error : ", error);
    }
    else {
        return value;
    }
};
exports.default = joinGameValidation;
