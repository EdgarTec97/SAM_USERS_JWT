import { DomainError } from '@/domain/errors/DomainError';
import { DomainErrorCode } from '@/domain/errors/DomainErrorCode';

export class AuthenticationError extends DomainError {
  public domainErrorCode = DomainErrorCode.AUTHENTICATION_ERROR;

  constructor(message: string, wrongPassword?: boolean) {
    super(
      wrongPassword ? message : `INTERNAL AUTHENTICATION ERROR: ${message}`
    );
  }
}
