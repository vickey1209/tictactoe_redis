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
const bull_1 = require("../bull");
const redisOperations_1 = require("../redisOperations");
const constants_1 = require("../constants");
const handleEmitter_1 = __importDefault(require("../handleEmitter"));
const requestValidator_1 = require("../validator/requestValidator");
const responceValidator_1 = require("../validator/responceValidator");
const defaultFormate_1 = require("../defaultFormate");
const { v4: uuidv4 } = require("uuid");
const GameDelayTime = 5;
// user create & join table  &  send user data symbol table id etc
const joinGame = (data, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let socketId = socket.id;
        let userName = yield (0, requestValidator_1.userValidation)(data);
        userName = userName.data.name;
        let userData = (0, defaultFormate_1.setUser)({ name: userName, socketId });
        socket.userId = userData._id;
        // create user
        let addUser = yield (0, redisOperations_1.Set)(`${constants_1.REDIS_KEY.USER}:${userData._id}`, JSON.stringify(userData));
        if (addUser) {
            handleEmitter_1.default.sendToSocket(socketId, {
                eventName: constants_1.EVENT_NAME.SIGN_UP,
                data: { userId: userData._id },
            });
            let tableQueue = yield (0, redisOperations_1.Get)(constants_1.REDIS_KEY.QUEUE);
            tableQueue = JSON.parse(tableQueue);
            let tableData;
            if (tableQueue && tableQueue.tablesId.length > 0) {
                tableData = yield (0, redisOperations_1.Get)(`${constants_1.REDIS_KEY.GAME}:${tableQueue.tablesId[0]}`);
                tableData = JSON.parse(tableData);
                tableData
                    ? (tableData.activePlayer = tableData.activePlayer + 1)
                    : null;
            }
            if (tableData && tableData.activePlayer === tableData.maxPlayer) {
                tableQueue.tablesId.shift();
                yield (0, redisOperations_1.Set)(constants_1.REDIS_KEY.QUEUE, JSON.stringify({ tablesId: tableQueue.tablesId }));
                tableData.player.push(userData);
                tableData.status = "start";
                yield (0, redisOperations_1.Del)(`${constants_1.REDIS_KEY.GAME}:${tableData._id}`);
                yield (0, redisOperations_1.Set)(`${constants_1.REDIS_KEY.GAME}:${tableData._id}`, JSON.stringify(tableData));
                socket.join(tableData._id);
                let UsersData = {
                    eventName: constants_1.EVENT_NAME.JOIN_GAME,
                    data: {
                        board: tableData.board,
                        tableId: tableData._id,
                        userData: tableData.player,
                        userId: userData._id,
                        status: "start",
                    },
                };
                let UserValidateData = yield (0, responceValidator_1.joinGameValidation)(UsersData);
                handleEmitter_1.default.sendToRoom(tableData._id, UserValidateData);
                let rounderTimerData = {
                    eventName: constants_1.EVENT_NAME.ROUND_TIMER_START,
                    data: {
                        delayTime: GameDelayTime,
                    },
                };
                handleEmitter_1.default.sendToRoom(tableData._id, rounderTimerData);
                let data = {
                    user1: tableData.player[0]._id,
                    delayTime: GameDelayTime * 1000,
                    attempts: 1,
                    jobId: tableData._id,
                };
                yield (0, bull_1.delayGame)(data);
            }
            else if (tableData && tableData.activePlayer != tableData.maxPlayer) {
                tableData.player.push(userData);
                yield (0, redisOperations_1.Del)(`${constants_1.REDIS_KEY.GAME}:${tableData._id}`);
                yield (0, redisOperations_1.Set)(`${constants_1.REDIS_KEY.GAME}:${tableData._id}`, JSON.stringify(tableData));
                socket.join(tableData._id);
                let UserData = {
                    eventName: constants_1.EVENT_NAME.JOIN_GAME,
                    data: {
                        board: tableData.board,
                        tableId: tableData._id,
                        userData: tableData.player,
                        status: "start",
                    },
                };
                let UserValidateData = yield (0, responceValidator_1.joinGameValidation)(UserData);
                handleEmitter_1.default.sendToRoom(tableData._id, UserValidateData);
            }
            else {
                let gameTable = yield (0, defaultFormate_1.setTable)(userData);
                socket.join(gameTable._id);
                socket.tableId = gameTable._id;
                yield (0, redisOperations_1.Set)(`${constants_1.REDIS_KEY.GAME}:${gameTable._id}`, JSON.stringify(gameTable));
                let firstUserData = {
                    eventName: constants_1.EVENT_NAME.JOIN_GAME,
                    data: {
                        userData: [userData],
                        board: gameTable.board,
                        tableId: gameTable._id,
                        userId: userData._id,
                        status: "waiting",
                    },
                };
                let firstUserValidateData = yield (0, responceValidator_1.joinGameValidation)(firstUserData);
                handleEmitter_1.default.sendToRoom(gameTable._id, firstUserValidateData);
                yield (0, redisOperations_1.Set)(constants_1.REDIS_KEY.QUEUE, JSON.stringify({ tablesId: [gameTable._id] }));
            }
        }
    }
    catch (error) {
        index_1.default.error("CATCH_ERROR IN joinGame : ", error);
    }
});
exports.default = joinGame;
