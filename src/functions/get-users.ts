import { APIGatewayProxyResult, APIGatewayEvent, Handler } from 'aws-lambda';
import {
  formatErrorResponse,
  formatJSONResponse
} from '@/domain/response/formatJSONResponse';
import { DomainError } from '@/domain/errors/DomainError';
import middify from '@/infrastructure/middlewares/middify';
import HttpStatus from '@/domain/types/HttpStatus';
import { UserRepository } from '@/infrastructure/database';

const getUsers = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { page, pageSize } = <any>event.queryStringParameters;
    const data = await UserRepository.getUsers(
      Number(page || 1),
      Number(pageSize || 10)
    );

    return formatJSONResponse(HttpStatus.OK, {
      success: true,
      ...data,
      users: data.users.map((user) => user.toPrimitives())
    });
  } catch (error: DomainError | any) {
    console.error(error);

    if (error instanceof DomainError) return formatErrorResponse(error);

    return formatJSONResponse(HttpStatus.BAD_REQUEST, {
      success: false,
      message: error.toString()
    });
  }
};

export const handler: Handler = middify(getUsers);
