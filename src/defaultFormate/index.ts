import { User } from "../interface/userInterface";

const { v4: uuidv4 } = require('uuid');
const setUser = (data:{name:string,socketId:string})=>{
    return {
            _id:uuidv4(),
            name: data.name,
            socketId: data.socketId,
    }
}
const setTable = (userData:User)=>{
    return {
            _id:uuidv4(),
            player: [userData],
            activePlayer: 1,
            maxPlayer: 2,
            board: [null, null, null, null, null, null, null, null, null],
            status:"waiting",
    }
}
export{setUser,setTable};