import { User } from "./userInterface";

export interface Game{
    id:{$oid:string};
    _id?:string;
    player:User[];
    max_player:number;
    active_player:number;
    board:(null|string)[];
}