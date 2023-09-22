"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const logger_1 = __importDefault(require("../../logger"));
const moveReqValidation = (data) => {
    const schema = joi_1.default.object().keys({
        eventName: joi_1.default.string().required(),
        data: joi_1.default.object().keys({
            id: joi_1.default.number().required(),
            userId: joi_1.default.any().required(),
            symbol: joi_1.default.string().required(),
            tableId: joi_1.default.string().required(),
        }),
    });
    const { error, value } = schema.validate(data);
    if (error) {
        logger_1.default.error("move joi validation error : ", error);
    }
    else {
        return value;
    }
};
exports.default = moveReqValidation;
