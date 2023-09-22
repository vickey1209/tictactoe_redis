import { redis } from "../connection/redisConnection";

const Set = async (key:string,data:string)=>{
    return await redis.set(key,data);
 }

const Get = async(key:string)=>{
    return await redis.get(key);
}

const Del = async(key:string)=>{
    return await redis.del(key);
}

export {Get,Set,Del};