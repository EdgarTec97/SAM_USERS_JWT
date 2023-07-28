import { DomainError } from '@/domain/errors/DomainError';
import { DomainErrorCode } from '@/domain/errors/DomainErrorCode';

export class UserExistsError extends DomainError {
  public domainErrorCode = DomainErrorCode.USER_EXISTS;

  constructor(message?: string) {
    super(message || 'User exists with same email or username');
  }
}
