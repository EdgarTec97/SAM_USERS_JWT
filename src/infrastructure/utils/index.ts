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

  static getNewParams<T>(
    obj: any,
    properties: Array<keyof T>,
    validateProperties?: Array<keyof T>
  ) {
    const newObj: any = {};

    const realProperties: Array<string> = Object.keys(
      validateProperties
        ? GlobalFunctions.cleanAllParams<T>(obj, validateProperties)
        : obj
    ); //{id: 2, name: "E"} => ["id","name"]

    realProperties.forEach((property: string) => {
      if (!properties.find((prop) => prop == property)) {
        const value = obj[property];
        newObj[property] =
          typeof value == 'object' ? structuredClone({}, obj[property]) : value;
      }
    });

    return newObj;
  }

  private static cleanAllParams<T>(
    obj: any,
    validateProperties: Array<keyof T>
  ): any {
    validateProperties.forEach((property) => {
      obj[property] = obj[property] || 0;
    });

    return obj;
  }
}
