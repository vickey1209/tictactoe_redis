"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../../constants");
const logger_1 = __importDefault(require("../../logger"));
const moveValidation = (data) => {
    const schema = joi_1.default.object().keys({
        eventName: joi_1.default.string().valid(constants_1.EVENT_NAME.MOVE).required(),
        data: joi_1.default.object().keys({ board: joi_1.default.array().allow(null).length(9).required() })
    });
    const { error, value } = schema.validate(data);
    if (error) {
        logger_1.default.error("res move validation error : ", error);
    }
    else {
        return value;
    }
};
exports.default = moveValidation;
