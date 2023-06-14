import { APIGatewayProxyResult, Handler } from 'aws-lambda';
import { User, UserPrimitives } from '@/domain/User';
import {
  formatErrorResponse,
  formatJSONResponse
} from '@/libs/formatJSONResponse';
import middify from '@/libs/middify';
import HttpStatus from '@/libs/types/HttpStatus';
import { RequestDTO } from '@/libs/types/RequestDTO';
import { GlobalFunctions } from '@/libs/utils';
import { UserResponseDTO } from '@/functions/dtos/user-response.dto';
import { CreateUserDTO } from '@/functions/dtos/create-user.dto';

const createUser = async (
  event: RequestDTO<CreateUserDTO>
): Promise<APIGatewayProxyResult> => {
  return formatJSONResponse(
    HttpStatus.CREATED,
    UserResponseDTO.fromDomain(
      User.fromPrimitives({
        id: GlobalFunctions.randomUUID(),
        firstName: 'Test'
      } as UserPrimitives)
    )
  );
};

export const handler: Handler = middify(createUser, CreateUserDTO);
