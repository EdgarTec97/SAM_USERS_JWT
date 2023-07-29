import { APIGatewayProxyResult, Handler, APIGatewayEvent } from 'aws-lambda';
import {
  formatErrorResponse,
  formatJSONResponse,
  middify,
  DomainError,
  UserRepository,
  User,
  HttpStatus,
  ADMINISTRATORS
} from '@general';

const getUsers = async (
  event: APIGatewayEvent & { body: any }
): Promise<APIGatewayProxyResult> => {
  if (event.body instanceof DomainError) return formatErrorResponse(event.body);

  try {
    const { page, pageSize } = <any>(event.queryStringParameters || {});
    const data = await UserRepository.getUsers(
      Number(page || 1),
      Number(pageSize || 10)
    );

    return formatJSONResponse(HttpStatus.OK, {
      success: true,
      ...data,
      users: data.users.map((user: User) => user.toPrimitives())
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

export const handler: Handler = middify(getUsers, undefined, ADMINISTRATORS);
