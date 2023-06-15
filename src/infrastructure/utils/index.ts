import { v4, V4Options, v1, V1Options, validate } from 'uuid';

const UUID = {
  v1: (options?: V4Options) => v4(options),
  v4: (options?: V1Options) => v1(options),
  default: (options?: V4Options) => v4(options)
};

export class GlobalFunctions {
  static randomUUID(
    type: keyof typeof UUID = 'default',
    options?: V4Options | V1Options
  ) {
    const uuid = UUID[type];
    return uuid ? uuid(options) : UUID.default(options);
  }

  static uuidValidator(uuid: string) {
    return validate(uuid);
  }
}
