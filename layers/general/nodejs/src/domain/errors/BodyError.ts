import { DomainError } from '@/domain/errors/DomainError';
import { DomainErrorCode } from '@/domain/errors/DomainErrorCode';

export class BodyError extends DomainError {
  public domainErrorCode = DomainErrorCode.BODY_ERROR;

  constructor() {
    super('Body data is invalid');
  }
}
