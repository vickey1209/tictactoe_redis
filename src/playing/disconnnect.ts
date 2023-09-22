import logger from "../logger/index";
import { Get, Del,Set} from "../redisOperations";
import { REDIS_KEY } from "../constants";
// on user disconnect : delete user & that user table
const disconnect = async (socket: any) => {
  try {
    // find table

    if (socket.tableId) {
      let queue: any = await Get(REDIS_KEY.QUEUE);
      queue = JSON.parse(queue);
      queue.tablesId.includes(socket.tableId)
        ? queue.tablesId.splice(queue.tablesId.indexOf(socket.tableId),1)
        : null;
      await Set(REDIS_KEY.QUEUE,JSON.stringify({tablesId:queue.tablesId}))
      let data: any = await Get(`${REDIS_KEY.GAME}:${socket.tableId}`);
      data = JSON.parse(data);

      data.player[0] ? Del(`${REDIS_KEY.USER}:${data.player[0]._id}`) : null;
      data.player[1] ? Del(`${REDIS_KEY.USER}:${data.player[1]._id}`) : null;

      Del(`${REDIS_KEY.GAME}:${socket.tableId}`);
    }
  } catch (error) {
    logger.error("CATCH_ERROR IN disconnect : " , error);
  }
};

export default disconnect;
