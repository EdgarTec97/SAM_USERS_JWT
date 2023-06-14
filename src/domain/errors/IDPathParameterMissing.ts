import { DomainError } from '@/domain/errors/DomainError';
import { DomainErrorCode } from '@/domain/errors/DomainErrorCode';

export class IDPathParameterMissing extends DomainError {
  public domainErrorCode = DomainErrorCode.ID_PATH_PARAMETER_MISSING;

  constructor() {
    super('Missing ID path paramter');
  }
}
