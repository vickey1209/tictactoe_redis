import QUEUE from "bull";

import Event from "../../handleEmitter";
import { BULL_KEY, EVENT_NAME } from "../../constants";
import logger from "../../logger";
import dotenv from "dotenv";
import turnDelay from "./turnQueue";
dotenv.config({ path: "../../../.env" });

interface DataType {
  user1: string;
  delayTime: number;
  attempts: number;
  jobId: string;
}

const delayGame = async (data: DataType) => {
  try {
    const redisData: any = {
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
    };
    let gameQueue = new QUEUE(BULL_KEY.GAME_DELAY, {
      redis: redisData,
    });

    let options = {
      delay: data.delayTime,
      attempts: 1,
      job_id: data.jobId,
    };

    gameQueue.add(data, options);

    gameQueue.process(async (job: any) => {
      
      let startData = {
        eventName: EVENT_NAME.START,
        msg: "start Game",
      };

      Event.sendToRoom(job.data.jobId, startData);

      let turnDelayData = {
        delayTime: 2000,
        attempts: 1,
        jobId: job.data.jobId,
        userId: job.data.user1,
      };
      await turnDelay(turnDelayData);
      await gameQueue.removeJobs(job.data.jobId);
    });

  } catch (error) {
    logger.error("CATCH_ERROR IN delayGame : ", error);
  }
};
export default delayGame;
