import {
  APIGatewayProxyResult,
  APIGatewayEvent,
  Handler,
  formatErrorResponse,
  formatJSONResponse,
  middify,
  DomainError,
  IDPathParameterMissing,
  UserRepository,
  UserId,
  HttpStatus,
  ADMINISTRATORS
} from '/opt/infra/index';

const deleteUser = async (
  event: APIGatewayEvent & { body: any }
): Promise<APIGatewayProxyResult> => {
  if (event.body instanceof DomainError) return formatErrorResponse(event.body);

  try {
    const userId = event.pathParameters?.userId;
    if (!userId) return formatErrorResponse(new IDPathParameterMissing());

    await UserRepository.deleteUser(new UserId(userId));

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

export const handler: Handler = middify(deleteUser, undefined, ADMINISTRATORS);
