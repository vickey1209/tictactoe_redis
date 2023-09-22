import Joi from "joi";
import { MoveData } from "../../interface/moveDataInterface";
import logger from "../../logger";

const moveReqValidation = (data: MoveData) => {
  const schema = Joi.object().keys({
    eventName: Joi.string().required(),
    data: Joi.object().keys({
      id: Joi.number().required(),
      userId:Joi.any().required(),
      symbol: Joi.string().required(),
      tableId: Joi.string().required(),
    }),
  });

  const { error, value } = schema.validate(data);
  if (error) {
    logger.error("move joi validation error : " , error);
  } else {
    return value;
  }
};

export default moveReqValidation;
