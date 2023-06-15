import { APIGatewayProxyResult, Handler } from 'aws-lambda';
import { User } from '@/domain/entities/User';
import {
  formatErrorResponse,
  formatJSONResponse
} from '@/domain/response/formatJSONResponse';
import middify from '@/infrastructure/middlewares/middify';
import { RequestDTO } from '@/infrastructure/middlewares/RequestDTO';
import { GlobalFunctions } from '@/infrastructure/utils';
import { CreateUserDTO } from '@/functions/dtos/create-user.dto';
import HttpStatus from '@/domain/types/HttpStatus';
import { DomainError } from '@/domain/errors/DomainError';
import { UserRepository } from '@/infrastructure/database';

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

    await UserRepository.saveUser(user);

    return formatJSONResponse(HttpStatus.CREATED, {
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

export const handler: Handler = middify(createUser, CreateUserDTO);
