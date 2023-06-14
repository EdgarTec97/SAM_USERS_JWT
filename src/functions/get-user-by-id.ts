import { APIGatewayProxyResult, APIGatewayEvent, Handler } from 'aws-lambda';
import { User, UserPrimitives } from '@/domain/User';
import { IDPathParameterMissing } from '@/domain/errors/IDPathParameterMissing';
import {
  formatErrorResponse,
  formatJSONResponse
} from '@/libs/formatJSONResponse';
import middify from '@/libs/middify';
import HttpStatus from '@/libs/types/HttpStatus';
import { GlobalFunctions } from '@/libs/utils';
import { UserResponseDTO } from '@/functions/dtos/user-response.dto';

const getUseById = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const userId = event.pathParameters?.userId;
  if (!userId) return formatErrorResponse(new IDPathParameterMissing());

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

export const handler: Handler = middify(getUseById);
