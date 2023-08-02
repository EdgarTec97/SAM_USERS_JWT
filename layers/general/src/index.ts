export {
  IsOptional,
  IsString,
  IsNumber,
  MinLength,
  IsBoolean
} from 'class-validator';
export { config } from '@/infrastructure/config';

import HttpStatus from '@/domain/types/HttpStatus';
import middify from '@/infrastructure/middlewares/middify';
import { SESEmailService as SESEmailClass } from '@/infrastructure/services/ses.email.service';
import { SNSTopicService as SNSTopicClass } from '@/infrastructure/services/sns.topic.service';
import { S3BucketService as S3BucketClass } from '@/infrastructure/services/s3.bucket.service';
const SESEmailService = SESEmailClass.getInstance();
const SNSTopicService = SNSTopicClass.getInstance();
const S3BucketService = S3BucketClass.getInstance();

export {
  middify,
  HttpStatus,
  SESEmailService,
  SNSTopicService,
  S3BucketService
};

export { UserRole } from '@/domain/types/user.role';
export { User, UserPrimitives } from '@/domain/entities/User';
export {
  formatErrorResponse,
  formatJSONResponse
} from '@/domain/response/formatJSONResponse';
export { RequestDTO } from '@/infrastructure/middlewares/RequestDTO';
export { DTOPropertiesError } from '@/domain/errors/DTOPropertiesError';
export { GlobalFunctions } from '@/infrastructure/utils';
export { DomainError } from '@/domain/errors/DomainError';
export { UserRepository } from '@/infrastructure/database';
export { IDPathParameterMissing } from '@/domain/errors/IDPathParameterMissing';
export { UserId } from '@/domain/entities/value-objects/user.id';
export { ADMINISTRATORS, ALL_ROLES, BASIC } from '@/domain/types/user.role';
