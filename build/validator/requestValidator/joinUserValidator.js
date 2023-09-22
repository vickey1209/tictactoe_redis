"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const logger_1 = __importDefault(require("../../logger"));
const userValidation = (data) => {
    const schema = joi_1.default.object().keys({
        eventName: joi_1.default.string().required(),
        data: joi_1.default.object().keys({
            name: joi_1.default.string().required()
        })
    });
    let { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
        logger_1.default.error("user joi validation error : ", error);
    }
    else {
        return value;
    }
};
exports.default = userValidation;
