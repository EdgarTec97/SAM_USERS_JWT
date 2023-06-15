import middy from '@middy/core';
import cors from '@middy/http-cors';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { Handler } from 'aws-lambda';
import { ClassType } from 'class-transformer-validator';
import { classValidatorMiddleware } from '@/infrastructure/middlewares/classValidatorMiddleware';

const middify = (handler: Handler, classToValidate?: ClassType<any>) => {
  return middy(handler)
    .use(middyJsonBodyParser())
    .use(classValidatorMiddleware(classToValidate))
    .use(cors());
};

export default middify;
