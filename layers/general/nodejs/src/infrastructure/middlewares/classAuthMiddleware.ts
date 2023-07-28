import middy, { MiddlewareObj } from '@middy/core';
import { DTOPropertiesError } from '@/domain/errors/DTOPropertiesError';
import { MISSING_HEADERS } from '@/domain/errors/MissingHeaders';
import { UnauthorizedClient } from '@/domain/errors/UnauthorizedClient';
import { JSONWebTokenAuth } from '@/infrastructure/utils/jwt.lib';
import { UserRole } from '@/domain/types/user.role';
import { DomainError } from '@/domain/errors/DomainError';

export class ClassAuthenticationMiddleware implements MiddlewareObj {
  private jwt: JSONWebTokenAuth = JSONWebTokenAuth.getInstance();

  constructor(private roles: UserRole[]) {}

  public static create(roles: UserRole[]) {
    return new ClassAuthenticationMiddleware(roles);
  }

  public before: middy.MiddlewareFn = async (request): Promise<void> => {
    let { Authorization: token }: { Authorization: string } =
      request.event.headers;

    try {
      if (!token) {
        request.event.body = new MISSING_HEADERS('Authorization');
        return;
      }

      token = token.split(' ')[1];
      const decoded: any | string = await this.jwt.verify(token);

      if (decoded?.error) {
        request.event.body = new UnauthorizedClient();
        return;
      }

      if (!this.roles.includes(decoded.role)) {
        request.event.body = new UnauthorizedClient();
        return;
      }

      request.event.body = { ...request.event.body, userAuth: decoded };
    } catch (error) {
      console.error(error);
      request.event.body =
        error instanceof DomainError ? error : new DTOPropertiesError();
    }
  };
}

export const classAuthenticationMiddleware =
  ClassAuthenticationMiddleware.create;
