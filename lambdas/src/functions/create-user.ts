import {
  APIGatewayProxyResult,
  RequestDTO,
  Handler,
  formatErrorResponse,
  formatJSONResponse,
  middify,
  DomainError,
  GlobalFunctions,
  UserRepository,
  User,
  HttpStatus,
  UserPrimitives
} from '/opt/infra/index';
import { CreateUserDTO } from '@/functions/dtos/create-user.dto';

const createUser = async (
  event: RequestDTO<CreateUserDTO>
): Promise<APIGatewayProxyResult> => {
  if (event.body instanceof DomainError) return formatErrorResponse(event.body);

  try {
    const { body } = event as { body: CreateUserDTO };

    const user = User.fromPrimitives({
      id: GlobalFunctions.randomUUID(),
      firstName: body.firstName,
      lastName: body.lastName,
      username: body.username,
      email: body.email,
      phone: body.phone,
      password: body.password,
      age: body.age,
      role: body.role
    });

    await UserRepository.createOrUpdate(user, true);

    return formatJSONResponse(HttpStatus.CREATED, {
      success: true,
      user: GlobalFunctions.getNewParams<UserPrimitives>(user.toPrimitives(), [
        'password'
      ])
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

export const handler: Handler = middify(createUser, CreateUserDTO);
