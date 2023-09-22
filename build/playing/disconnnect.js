"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../logger/index"));
const redisOperations_1 = require("../redisOperations");
const constants_1 = require("../constants");
// on user disconnect : delete user & that user table
const disconnect = (socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // find table
        if (socket.tableId) {
            let queue = yield (0, redisOperations_1.Get)(constants_1.REDIS_KEY.QUEUE);
            queue = JSON.parse(queue);
            queue.tablesId.includes(socket.tableId)
                ? queue.tablesId.splice(queue.tablesId.indexOf(socket.tableId), 1)
                : null;
            yield (0, redisOperations_1.Set)(constants_1.REDIS_KEY.QUEUE, JSON.stringify({ tablesId: queue.tablesId }));
            let data = yield (0, redisOperations_1.Get)(`${constants_1.REDIS_KEY.GAME}:${socket.tableId}`);
            data = JSON.parse(data);
            data.player[0] ? (0, redisOperations_1.Del)(`${constants_1.REDIS_KEY.USER}:${data.player[0]._id}`) : null;
            data.player[1] ? (0, redisOperations_1.Del)(`${constants_1.REDIS_KEY.USER}:${data.player[1]._id}`) : null;
            (0, redisOperations_1.Del)(`${constants_1.REDIS_KEY.GAME}:${socket.tableId}`);
        }
    }
    catch (error) {
        index_1.default.error("CATCH_ERROR IN disconnect : ", error);
    }
});
exports.default = disconnect;
