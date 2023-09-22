import Bull from "bull";
import dotenv from "dotenv";
import { BULL_KEY, EVENT_NAME } from "../../constants";
dotenv.config({ path: "../../.env" });
import Event from "../../handleEmitter";
import logger from "../../logger";

interface dataInterFace {
  delayTime: number;
  attempts: number;
  jobId: any;
  userId: any;
}

const turnDelay = (data: dataInterFace) => {
  let redisData: any = {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    db: process.env.REDIS_DB,
  };
  let turnQueue = new Bull(BULL_KEY.TURN_DELAY, { redis: redisData });

  let options = {
    delay: data.delayTime,
    Job_id: data.jobId,
    attempts: 1,
  };
  turnQueue.add(data, options);

  turnQueue.process(async (job: any) => {
    try {
      
      let userTurnData = {
        eventName: EVENT_NAME.USER_TURN_STARTED,
        data: {
          userId: job.data.userId,
          symbol: "x",
        },
      };
      
     await Event.sendToRoom( job.data.jobId, userTurnData);
    } catch (error) {
      logger.error("CATCH_ERROR IN turnDelay : ", error);
    }
  });
};

export default turnDelay;