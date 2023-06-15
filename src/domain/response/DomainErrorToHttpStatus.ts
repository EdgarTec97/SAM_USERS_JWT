import { DomainErrorCode } from '@/domain/errors/DomainErrorCode';
import HttpStatus from '@/domain/types/HttpStatus';

export const DomainErrorToHttpStatus: Record<DomainErrorCode, HttpStatus> = {
  [DomainErrorCode.DTO_PROPERTIES_ERROR]: HttpStatus.BAD_REQUEST,
  [DomainErrorCode.BODY_ERROR]: HttpStatus.BAD_REQUEST,
  [DomainErrorCode.INVALID_PROPERTY]: HttpStatus.BAD_REQUEST,
  [DomainErrorCode.USER_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [DomainErrorCode.ID_PATH_PARAMETER_MISSING]: HttpStatus.BAD_REQUEST
};
