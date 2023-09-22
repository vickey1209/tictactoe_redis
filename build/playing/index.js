"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.move = exports.disconnect = exports.joinGame = void 0;
const disconnnect_1 = __importDefault(require("./disconnnect"));
exports.disconnect = disconnnect_1.default;
const joinGame_1 = __importDefault(require("./joinGame"));
exports.joinGame = joinGame_1.default;
const move_1 = __importDefault(require("./move"));
exports.move = move_1.default;
