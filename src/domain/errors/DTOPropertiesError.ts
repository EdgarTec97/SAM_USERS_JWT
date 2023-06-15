import { DomainError } from './DomainError';
import { DomainErrorCode } from './DomainErrorCode';

export class DTOPropertiesError extends DomainError {
  public domainErrorCode = DomainErrorCode.DTO_PROPERTIES_ERROR;

  constructor(message?: string) {
    super(`DTO is invalid, send the correct data: ${message}`);
  }
}
