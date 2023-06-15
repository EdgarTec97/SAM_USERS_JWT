import { APIGatewayProxyResult, APIGatewayEvent, Handler } from 'aws-lambda';
import { IDPathParameterMissing } from '@/domain/errors/IDPathParameterMissing';
import {
  formatErrorResponse,
  formatJSONResponse
} from '@/domain/response/formatJSONResponse';
import { UserId } from '@/domain/entities/value-objects/user.id';
import { DomainError } from '@/domain/errors/DomainError';
import middify from '@/infrastructure/middlewares/middify';
import HttpStatus from '@/domain/types/HttpStatus';
import { UserRepository } from '@/infrastructure/database';

const deleteUser = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.pathParameters?.userId;
    if (!userId) return formatErrorResponse(new IDPathParameterMissing());

    const user = await UserRepository.deleteUser(new UserId(userId));

    return formatJSONResponse(HttpStatus.OK, {
      success: true,
      message: 'User deleted'
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

export const handler: Handler = middify(deleteUser);
