"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisSub = exports.redisPub = exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const ioredis_2 = __importDefault(require("ioredis"));
const logger_1 = __importDefault(require("../logger"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const options = {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB,
};
const redis = new ioredis_2.default({ host: process.env.REDIS_HOST, port: 6379 });
exports.redis = redis;
redis.on("connect", () => {
    logger_1.default.info("redis connected successfully");
    redis.flushdb();
});
const redisPub = new ioredis_1.default(options);
exports.redisPub = redisPub;
const redisSub = new ioredis_1.default(options);
exports.redisSub = redisSub;
redisPub.on("connect", () => {
    logger_1.default.info("pub connected ");
});
redisPub.on("error", (error) => {
    logger_1.default.info("pub connection error :  ", error);
});
redisSub.on("connect", () => {
    logger_1.default.info("sub connected ");
});
redisSub.on("error", (error) => {
    logger_1.default.info("sub connection error :  ", error);
});
