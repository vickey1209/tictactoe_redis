import Joi from "joi";
import logger from "../../logger";

const userValidation = (data:{name:string}) => {
  const schema = Joi.object().keys({
   eventName:Joi.string().required(),
   data:Joi.object().keys({
    name:Joi.string().required()
   })
  });
  let {error ,value}=schema.validate(data,{abortEarly:false});
  if(error){
    logger.error("user joi validation error : " , error)
  }else{
    
    return value;   
  }
};

export default userValidation;