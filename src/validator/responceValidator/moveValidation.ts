import Joi from "joi";
import { EVENT_NAME } from "../../constants";
import logger from "../../logger";

const moveValidation = (data:any)=>{
    const schema=Joi.object().keys({
        eventName:Joi.string().valid(EVENT_NAME.MOVE).required(),
        data:Joi.object().keys(
           { board:Joi.array().allow(null).length(9).required()}
        )
    })
    const {error,value}=schema.validate(data);
    if(error){
        logger.error("res move validation error : ",error);
    }else{
        return value;
    }
}
export default moveValidation;