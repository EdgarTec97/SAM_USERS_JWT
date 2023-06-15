import { DomainError } from '@/domain/errors/DomainError';
import { DomainErrorToHttpStatus } from '@/domain/response/DomainErrorToHttpStatus';
import HttpStatus from '@/domain/types/HttpStatus';

export const formatJSONResponse = (
  statusCode: HttpStatus,
  response: unknown
) => {
  return {
    statusCode,
    body: JSON.stringify(response)
  };
};

export const formatErrorResponse = async (error: DomainError) => {
  return {
    statusCode: DomainErrorToHttpStatus[error.domainErrorCode],
    body: JSON.stringify({
      message: error.message,
      domainError: error.domainErrorCode
    })
  };
};
