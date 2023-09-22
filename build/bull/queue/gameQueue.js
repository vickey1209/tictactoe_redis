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
const bull_1 = __importDefault(require("bull"));
const handleEmitter_1 = __importDefault(require("../../handleEmitter"));
const constants_1 = require("../../constants");
const logger_1 = __importDefault(require("../../logger"));
const dotenv_1 = __importDefault(require("dotenv"));
const turnQueue_1 = __importDefault(require("./turnQueue"));
dotenv_1.default.config({ path: "../../../.env" });
const delayGame = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const redisData = {
            port: process.env.REDIS_PORT,
            host: process.env.REDIS_HOST,
        };
        let gameQueue = new bull_1.default(constants_1.BULL_KEY.GAME_DELAY, {
            redis: redisData,
        });
        let options = {
            delay: data.delayTime,
            attempts: 1,
            job_id: data.jobId,
        };
        gameQueue.add(data, options);
        gameQueue.process((job) => __awaiter(void 0, void 0, void 0, function* () {
            let startData = {
                eventName: constants_1.EVENT_NAME.START,
                msg: "start Game",
            };
            handleEmitter_1.default.sendToRoom(job.data.jobId, startData);
            let turnDelayData = {
                delayTime: 2000,
                attempts: 1,
                jobId: job.data.jobId,
                userId: job.data.user1,
            };
            yield (0, turnQueue_1.default)(turnDelayData);
            yield gameQueue.removeJobs(job.data.jobId);
        }));
    }
    catch (error) {
        logger_1.default.error("CATCH_ERROR IN delayGame : ", error);
    }
});
exports.default = delayGame;
