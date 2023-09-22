import { Socket } from "socket.io";

import logger from "../logger/index";

import { delayGame } from "../bull";
import { Get, Set, Del } from "../redisOperations";
import { EVENT_NAME, REDIS_KEY } from "../constants";
import Event from "../handleEmitter";
import { userValidation } from "../validator/requestValidator";
import { joinGameValidation } from "../validator/responceValidator";
import { setTable, setUser } from "../defaultFormate";
const { v4: uuidv4 } = require("uuid");

const GameDelayTime = 5;

// user create & join table  &  send user data symbol table id etc
const joinGame = async (data: any, socket: any) => {
  
  try {
    let socketId = socket.id;
    let userName = await userValidation(data);

    userName = userName.data.name;

    let userData = setUser({ name: userName, socketId });
    socket.userId = userData._id;
    // create user
    let addUser = await Set(
      `${REDIS_KEY.USER}:${userData._id}`,
      JSON.stringify(userData)
    );
    if (addUser) {
      Event.sendToSocket(socketId, {
        eventName: EVENT_NAME.SIGN_UP,
        data: { userId: userData._id },
      });

      let tableQueue: any = await Get(REDIS_KEY.QUEUE);
      tableQueue = JSON.parse(tableQueue);
      let tableData: any;
      if (tableQueue && tableQueue.tablesId.length > 0) {
        tableData = await Get(`${REDIS_KEY.GAME}:${tableQueue.tablesId[0]}`);
        tableData = JSON.parse(tableData);
        tableData
          ? (tableData.activePlayer = tableData.activePlayer + 1)
          : null;
      }

      if (tableData && tableData.activePlayer === tableData.maxPlayer) {
        tableQueue.tablesId.shift();
        await Set(
          REDIS_KEY.QUEUE,
          JSON.stringify({ tablesId: tableQueue.tablesId })
        );

        tableData.player.push(userData);
        tableData.status = "start";
        await Del(`${REDIS_KEY.GAME}:${tableData._id}`);
        await Set(
          `${REDIS_KEY.GAME}:${tableData._id}`,
          JSON.stringify(tableData)
        );

        socket.join(tableData._id);
        let UsersData = {
          eventName: EVENT_NAME.JOIN_GAME,
          data: {
            board: tableData.board,
            tableId: tableData._id,
            userData: tableData.player,
            userId: userData._id,
            status: "start",
          },
        };

        let UserValidateData = await joinGameValidation(UsersData);

        Event.sendToRoom(tableData._id, UserValidateData);

        let rounderTimerData = {
          eventName: EVENT_NAME.ROUND_TIMER_START,
          data: {
            delayTime: GameDelayTime,
          },
        };
        Event.sendToRoom(tableData._id, rounderTimerData);
        let data = {
          user1: tableData.player[0]._id,
          delayTime: GameDelayTime * 1000,
          attempts: 1,
          jobId: tableData._id,
        };
        await delayGame(data);
      } else if (tableData && tableData.activePlayer != tableData.maxPlayer) {
        tableData.player.push(userData);

        await Del(`${REDIS_KEY.GAME}:${tableData._id}`);
        await Set(
          `${REDIS_KEY.GAME}:${tableData._id}`,
          JSON.stringify(tableData)
        );

        socket.join(tableData._id);

        let UserData = {
          eventName: EVENT_NAME.JOIN_GAME,
          data: {
            board: tableData.board,
            tableId: tableData._id,
            userData: tableData.player,
            status: "start",
          },
        };
        let UserValidateData = await joinGameValidation(UserData);

        Event.sendToRoom(tableData._id, UserValidateData);
      } else {
        let gameTable = await setTable(userData);
        socket.join(gameTable._id);
        socket.tableId = gameTable._id;

        await Set(
          `${REDIS_KEY.GAME}:${gameTable._id}`,
          JSON.stringify(gameTable)
        );
        let firstUserData = {
          eventName: EVENT_NAME.JOIN_GAME,
          data: {
            userData: [userData],
            board: gameTable.board,
            tableId: gameTable._id,
            userId: userData._id,
            status: "waiting",
          },
        };
        let firstUserValidateData = await joinGameValidation(firstUserData);
        Event.sendToRoom(gameTable._id, firstUserValidateData);

        await Set(
          REDIS_KEY.QUEUE,
          JSON.stringify({ tablesId: [gameTable._id] })
        );
      }
    }
  } catch (error) {
    logger.error("CATCH_ERROR IN joinGame : ", error);
  }
};

export default joinGame;
