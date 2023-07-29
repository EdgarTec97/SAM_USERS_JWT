import { APIGatewayProxyResult, Handler } from 'aws-lambda';
import {
  RequestDTO,
  formatErrorResponse,
  formatJSONResponse,
  middify,
  DomainError,
  DTOPropertiesError,
  UserRepository,
  HttpStatus
} from '@general';
import { LoginDTO } from '@/functions/dtos/login.dto';

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
      access_token: token
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
