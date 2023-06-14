import middy, { MiddlewareObj } from '@middy/core';
import { ClassType, transformAndValidate } from 'class-transformer-validator';

export class ClassValidatorMiddleware<T extends Record<string, unknown>>
  implements MiddlewareObj
{
  public static create<S extends Record<string, unknown>>(
    classType?: ClassType<S>
  ): ClassValidatorMiddleware<S> {
    return new ClassValidatorMiddleware({
      classType
    });
  }

  private readonly classType: ClassType<T> | undefined;

  constructor({ classType }: { classType?: ClassType<any> }) {
    this.classType = classType;
  }

  public before: middy.MiddlewareFn = async (request): Promise<void> => {
    if (this.classType) {
      const transformedBody = await transformAndValidate(
        this.classType,
        request.event.body
      ).catch((err) => {
        console.error(err);
        request.event.body = undefined;
        return;
      });
      request.event.body = transformedBody;
    }
  };
}

export const classValidatorMiddleware = ClassValidatorMiddleware.create;
