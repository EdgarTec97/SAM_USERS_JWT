import { DomainError } from '@/domain/errors/DomainError';
import { DomainErrorCode } from '@/domain/errors/DomainErrorCode';

export class InvalidPropertyError extends DomainError {
  public domainErrorCode = DomainErrorCode.BODY_ERROR;

  constructor(property: any, message?: string) {
    super(message || `The property (${property}) is invalid`);
  }
}
