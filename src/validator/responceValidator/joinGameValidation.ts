import Joi from "joi";
import { EVENT_NAME } from "../../constants";
import logger from "../../logger";

const joinGameValidation = (data:any) => {
  const schema = Joi.object().keys({
    eventName:Joi.string().valid(EVENT_NAME.JOIN_GAME).required(),
    data:Joi.object().keys({
      userData:Joi.array().required(),
      board: Joi.array().allow(null).length(9).required(),
      tableId:Joi.string().required() ,
      status:Joi.string().required(), 
      userId:Joi.string().required()
    })
  });
  const {error , value} = schema.validate(data,{abortEarly:false});
  if(error){
    logger.error("res join_game_validation error : ",error)
  }else{
    return value;
  }
};

export default joinGameValidation;