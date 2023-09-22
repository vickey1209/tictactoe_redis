import logger from "../logger/index";
import { MoveData } from "../interface/moveDataInterface";
import { RedLock } from "../connection/redlockConnection";
import { Get, Set } from "../redisOperations";
import { EVENT_NAME, REDIS_KEY } from "../constants";
import Event from "../handleEmitter";
import { moveReqValidation } from "../validator/requestValidator";
import { moveValidation } from "../validator/responceValidator";
import { disconnect } from ".";
//note move update table board & send new board to user
const move = async (data: any, socket: any) => {
  data = await moveReqValidation(data);
  let moveData: MoveData = data.data;
  let lock = await RedLock.acquire([moveData.tableId], 5000);
  try {
    // find table
    let updateTable: any = await Get(`${REDIS_KEY.GAME}:${moveData.tableId}`);

    updateTable = JSON.parse(updateTable);

    if (updateTable) {
      // update table board
      updateTable.board[moveData.id] = moveData.symbol;

      // set new board on data base
      let updateBoard: any = await Set(
        `${REDIS_KEY.GAME}:${moveData.tableId}`,
        JSON.stringify(updateTable)
      );

      if (updateBoard == "OK" && updateTable) {
        // send new data to user
        let moveEventData = {
          eventName: EVENT_NAME.MOVE,
          data:{
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

        let validateData = await moveValidation(moveEventData);
        Event.sendToRoom(updateTable._id, validateData);
        let tie=1;
        for(var i= 0;i<result.length ; i++){
          if(result[i]==null){
            tie=0
          }
        }
        winChance.forEach(async (element) => {
          if (element == "xxx") {
            let data = {
              eventName: EVENT_NAME.WIN_GAME,
              data: {
                winner: "x",
                delayTime: 4,
              },
            };
            Event.sendToRoom(updateTable._id, data);
            await disconnect(socket);
          } else if (element == "ooo") {
            let data = {
              eventName: EVENT_NAME.WIN_GAME,
              data: {
                winner: "o",
                delayTime: 4,
              },
            };
            Event.sendToRoom(updateTable._id, data);
            await disconnect(socket);
          }else if(tie){
            let data = {
              eventName: EVENT_NAME.WIN_GAME,
              data: {
                winner: "tie",
                delayTime: 4,
              },
            };
            Event.sendToRoom(updateTable._id, data);
            await disconnect(socket);
          }
           else {
            let userTurnData = {
              eventName: EVENT_NAME.USER_TURN_STARTED,
              data: {
                userId:
                  updateTable.player[0]._id == data.data.userId
                    ? updateTable.player[1]._id
                    : updateTable.player[0]._id,
                symbol: data.data.symbol == "x" ? "o" : "x",
              },
          };
            Event.sendToRoom(updateTable._id, userTurnData);
          }
        });
      }
    }
  } catch (error) {
    logger.error("CATCH_ERROR IN move : " , error);
  } finally {
    await lock.release();
  }
};

export default move;
