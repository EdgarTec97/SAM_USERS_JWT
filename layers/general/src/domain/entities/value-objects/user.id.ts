import { GlobalFunctions } from '@/infrastructure/utils';
import { InvalidPropertyError } from '@/domain/errors/InvalidPropertyError';

export class UserId {
  constructor(private userId: string) {
    this.validate();
  }

  valueOf() {
    return this.userId;
  }

  validate() {
    if (!GlobalFunctions.uuidValidator(this.userId))
      throw new InvalidPropertyError(
        this.userId,
        `The id (${this.userId}) must be in UUID format.`
      );
  }
}
