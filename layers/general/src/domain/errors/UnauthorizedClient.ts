import { DomainError } from '@/domain/errors/DomainError';
import { DomainErrorCode } from '@/domain/errors/DomainErrorCode';

export class UnauthorizedClient extends DomainError {
  public domainErrorCode = DomainErrorCode.UNAUTHORIZED_CLIENT;

  constructor() {
    super(`Unauthorized Client: you should authenticate`);
  }
}
