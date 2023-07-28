import { DomainError } from '@/domain/errors/DomainError';
import { DomainErrorCode } from '@/domain/errors/DomainErrorCode';

export class MISSING_HEADERS extends DomainError {
  public domainErrorCode = DomainErrorCode.MISSING_HEADERS;

  constructor(header: string) {
    super(`Missing authentication headers: ${header}`);
  }
}
