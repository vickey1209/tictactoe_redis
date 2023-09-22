import IORedis  from "ioredis";
import Client from "ioredis";
import logger from "../logger";
import dotenv from 'dotenv';
dotenv.config();

const options:any = {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  db: process.env.REDIS_DB,
};
const redis = new Client({ host: process.env.REDIS_HOST, port: 6379});

redis.on("connect",()=>{
    logger.info("redis connected successfully");
    redis.flushdb();
})

const redisPub: any = new IORedis(options);
const redisSub: any = new IORedis(options);

redisPub.on("connect", () => {
    logger.info("pub connected ")
});
redisPub.on("error", (error: any) => {
    logger.info("pub connection error :  ", error);
});
redisSub.on("connect", () => {
    logger.info("sub connected ");
});
redisSub.on("error", (error: any) => {
   logger.info("sub connection error :  ", error);
});

export { redis, redisPub, redisSub };
