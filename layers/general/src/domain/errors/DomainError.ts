import { DomainErrorCode } from '@/domain/errors/DomainErrorCode';

export abstract class DomainError extends Error {
  public abstract domainErrorCode: DomainErrorCode;

  public message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }
}
