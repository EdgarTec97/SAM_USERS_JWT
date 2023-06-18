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
    obj: T,
    properties: Array<keyof T>,
    validateProperties?: Array<keyof T>
  ) {
    const newObj: any = {};

    const realProperties = Object.keys(
      validateProperties
        ? GlobalFunctions.cleanAllParams<T>(obj, validateProperties)
        : obj
    ) as Array<keyof T>; //{id: 2, name: "E"} => ["id","name"]

    realProperties.forEach((property) => {
      if (!properties.find((prop) => prop == property)) {
        const value = obj[property];
        newObj[property] =
          typeof value == 'object'
            ? structuredClone({}, obj[property] as object)
            : value;
      }
    });

    return newObj as T;
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

  static removeFalsyProperties<T>(obj: T) {
    const result: Partial<T> = {};
    for (const property in obj) {
      if (property !== undefined) result[property] = obj[property];
    }
    return result;
  }
}
