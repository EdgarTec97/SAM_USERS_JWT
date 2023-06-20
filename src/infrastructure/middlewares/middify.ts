import middy from '@middy/core';
import cors from '@middy/http-cors';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { Handler } from 'aws-lambda';
import { ClassType } from 'class-transformer-validator';
import { classValidatorMiddleware } from '@/infrastructure/middlewares/classValidatorMiddleware';
import { classAuthenticationMiddleware } from '@/infrastructure/middlewares/classAuthMiddleware';
import { UserRole } from '@/domain/types/user.role';

const middify = (
  handler: Handler,
  classToValidate?: ClassType<any>,
  roles?: UserRole[]
) => {
  const midd = middy(handler).use(middyJsonBodyParser()).use(cors());

  if (classToValidate) midd.use(classValidatorMiddleware(classToValidate));

  if (roles) midd.use(classAuthenticationMiddleware(roles));

  return midd;
};

export default middify;
