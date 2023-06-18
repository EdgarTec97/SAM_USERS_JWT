import { DomainError } from '@/domain/errors/DomainError';
import { DomainErrorCode } from '@/domain/errors/DomainErrorCode';

export class UserNotFound extends DomainError {
  public domainErrorCode = DomainErrorCode.USER_NOT_FOUND;

  constructor(userId: string, message?: string) {
    super(message || `User with id ${userId} was not found`);
  }
}
