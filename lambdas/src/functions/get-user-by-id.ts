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
  ALL_ROLES
} from '/opt/infra/index';

const getUseById = async (
  event: APIGatewayEvent & { body: any }
): Promise<APIGatewayProxyResult> => {
  if (event.body instanceof DomainError) return formatErrorResponse(event.body);

  try {
    const userId = event.pathParameters?.userId;
    if (!userId) return formatErrorResponse(new IDPathParameterMissing());

    const user = await UserRepository.getUserById(new UserId(userId));

    return formatJSONResponse(HttpStatus.OK, {
      success: true,
      user: user.toPrimitives()
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

export const handler: Handler = middify(getUseById, undefined, ALL_ROLES);
