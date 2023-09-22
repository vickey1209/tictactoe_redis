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
const redlockConnection_1 = require("../connection/redlockConnection");
const redisOperations_1 = require("../redisOperations");
const constants_1 = require("../constants");
const handleEmitter_1 = __importDefault(require("../handleEmitter"));
const requestValidator_1 = require("../validator/requestValidator");
const responceValidator_1 = require("../validator/responceValidator");
const _1 = require(".");
//note move update table board & send new board to user
const move = (data, socket) => __awaiter(void 0, void 0, void 0, function* () {
    data = yield (0, requestValidator_1.moveReqValidation)(data);
    let moveData = data.data;
    let lock = yield redlockConnection_1.RedLock.acquire([moveData.tableId], 5000);
    try {
        // find table
        let updateTable = yield (0, redisOperations_1.Get)(`${constants_1.REDIS_KEY.GAME}:${moveData.tableId}`);
        updateTable = JSON.parse(updateTable);
        if (updateTable) {
            // update table board
            updateTable.board[moveData.id] = moveData.symbol;
            // set new board on data base
            let updateBoard = yield (0, redisOperations_1.Set)(`${constants_1.REDIS_KEY.GAME}:${moveData.tableId}`, JSON.stringify(updateTable));
            if (updateBoard == "OK" && updateTable) {
                // send new data to user
                let moveEventData = {
                    eventName: constants_1.EVENT_NAME.MOVE,
                    data: {
                        board: updateTable.board,
                    }
                };
                let result = updateTable.board;
                let winChance = [
                    result[0] + result[1] + result[2],
                    result[3] + result[4] + result[5],
                    result[6] + result[7] + result[8],
                    result[0] + result[4] + result[8],
                    result[2] + result[4] + result[6],
                    result[0] + result[3] + result[6],
                    result[1] + result[4] + result[7],
                    result[2] + result[5] + result[8],
                ];
                let validateData = yield (0, responceValidator_1.moveValidation)(moveEventData);
                handleEmitter_1.default.sendToRoom(updateTable._id, validateData);
                let tie = 1;
                for (var i = 0; i < result.length; i++) {
                    if (result[i] == null) {
                        tie = 0;
                    }
                }
                winChance.forEach((element) => __awaiter(void 0, void 0, void 0, function* () {
                    if (element == "xxx") {
                        let data = {
                            eventName: constants_1.EVENT_NAME.WIN_GAME,
                            data: {
                                winner: "x",
                                delayTime: 4,
                            },
                        };
                        handleEmitter_1.default.sendToRoom(updateTable._id, data);
                        yield (0, _1.disconnect)(socket);
                    }
                    else if (element == "ooo") {
                        let data = {
                            eventName: constants_1.EVENT_NAME.WIN_GAME,
                            data: {
                                winner: "o",
                                delayTime: 4,
                            },
                        };
                        handleEmitter_1.default.sendToRoom(updateTable._id, data);
                        yield (0, _1.disconnect)(socket);
                    }
                    else if (tie) {
                        let data = {
                            eventName: constants_1.EVENT_NAME.WIN_GAME,
                            data: {
                                winner: "tie",
                                delayTime: 4,
                            },
                        };
                        handleEmitter_1.default.sendToRoom(updateTable._id, data);
                        yield (0, _1.disconnect)(socket);
                    }
                    else {
                        let userTurnData = {
                            eventName: constants_1.EVENT_NAME.USER_TURN_STARTED,
                            data: {
                                userId: updateTable.player[0]._id == data.data.userId
                                    ? updateTable.player[1]._id
                                    : updateTable.player[0]._id,
                                symbol: data.data.symbol == "x" ? "o" : "x",
                            },
                        };
                        handleEmitter_1.default.sendToRoom(updateTable._id, userTurnData);
                    }
                }));
            }
        }
    }
    catch (error) {
        index_1.default.error("CATCH_ERROR IN move : ", error);
    }
    finally {
        yield lock.release();
    }
});
exports.default = move;
