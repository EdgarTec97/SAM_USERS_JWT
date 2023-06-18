import { APIGatewayProxyResult, Handler } from 'aws-lambda';
import {
  formatErrorResponse,
  formatJSONResponse
} from '@/domain/response/formatJSONResponse';
import middify from '@/infrastructure/middlewares/middify';
import { RequestDTO } from '@/infrastructure/middlewares/RequestDTO';
import { LoginDTO } from '@/functions/dtos/login.dto';
import HttpStatus from '@/domain/types/HttpStatus';
import { DomainError } from '@/domain/errors/DomainError';
import { UserRepository } from '@/infrastructure/database';
import { DTOPropertiesError } from '@/domain/errors/DTOPropertiesError';

const loginUser = async (
  event: RequestDTO<LoginDTO>
): Promise<APIGatewayProxyResult> => {
  if (event.body instanceof DomainError) return formatErrorResponse(event.body);

  try {
    const { email, username, password } = event.body as LoginDTO;

    if (!email && !username) throw new DTOPropertiesError('email or username');

    const token = await UserRepository.login({ email, username }, password);

    return formatJSONResponse(HttpStatus.CREATED, {
      success: true,
      access_tokeb: token
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

export const handler: Handler = middify(loginUser, LoginDTO);
