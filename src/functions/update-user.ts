import { APIGatewayProxyResult, Handler } from 'aws-lambda';
import { User } from '@/domain/entities/User';
import { IDPathParameterMissing } from '@/domain/errors/IDPathParameterMissing';
import {
  formatErrorResponse,
  formatJSONResponse
} from '@/domain/response/formatJSONResponse';
import { UserId } from '@/domain/entities/value-objects/user.id';
import middify from '@/infrastructure/middlewares/middify';
import { RequestDTO } from '@/infrastructure/middlewares/RequestDTO';
import { UpdateUserDTO } from '@/functions/dtos/update-user.dto';
import HttpStatus from '@/domain/types/HttpStatus';
import { DomainError } from '@/domain/errors/DomainError';
import { UserRepository } from '@/infrastructure/database';

const updateUser = async (
  event: RequestDTO<UpdateUserDTO>
): Promise<APIGatewayProxyResult> => {
  if (event.body instanceof DomainError) return formatErrorResponse(event.body);

  try {
    const userId = event.pathParameters?.userId;
    if (!userId) return formatErrorResponse(new IDPathParameterMissing());

    const userExists = await UserRepository.getUserById(new UserId(userId));

    const { body } = event as { body: UpdateUserDTO };

    const user = User.fromPrimitives({
      id: userId,
      firstName: body?.firstName || userExists.getFirstName(),
      lastName: body?.lastName || userExists.getLastName(),
      username: body?.username || userExists.getUsername(),
      email: body?.email || userExists.getEmail(),
      phone: body?.phone || userExists.getPhone(),
      password: body?.password,
      age: body?.age || userExists.getAge(),
      role: body?.role || userExists.getRole()
    });

    await UserRepository.createOrUpdate(user, false);

    return formatJSONResponse(HttpStatus.CREATED, {
      success: true,
      message: 'User updated'
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

export const handler: Handler = middify(updateUser, UpdateUserDTO);