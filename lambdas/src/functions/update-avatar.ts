import { APIGatewayProxyResult, Handler } from 'aws-lambda';
import {
  S3BucketService,
  RequestDTO,
  formatErrorResponse,
  formatJSONResponse,
  middify,
  DomainError,
  IDPathParameterMissing,
  DTOPropertiesError,
  UserRepository,
  User,
  HttpStatus,
  UserId,
  BASIC,
  GlobalFunctions
} from '@general';

declare const Buffer: any;

const updateAvatar = async (
  event: RequestDTO<any>
): Promise<APIGatewayProxyResult> => {
  if (event.body instanceof DomainError) return formatErrorResponse(event.body);

  try {
    const userId = event.pathParameters?.userId;
    if (!userId) return formatErrorResponse(new IDPathParameterMissing());

    const userExists = await UserRepository.getUserById(new UserId(userId));

    const file = event.body.file;

    if (!file) throw new DTOPropertiesError('file');

    await S3BucketService.send({
      filePath: `${GlobalFunctions.randomUUID()}-${new Date().toISOString()}.${
        file.filename.split('.')[1]
      }`,
      file: file.content.toString()
    });

    // const user = User.fromPrimitives({
    //   id: userId,
    //   firstName: body?.firstName || userExists.getFirstName(),
    //   lastName: body?.lastName || userExists.getLastName(),
    //   username: body?.username || userExists.getUsername(),
    //   email: body?.email || userExists.getEmail(),
    //   phone: body?.phone || userExists.getPhone(),
    //   password: body?.password,
    //   age: body?.age || userExists.getAge(),
    //   role: body?.role || userExists.getRole(),
    //   verified: userExists.getVerified(),
    //   avatar: body?.avatar || userExists.getAvatar(),
    //   createdAt: <string>(<unknown>Date.parse(userExists.getCreatedAt()))
    // });

    // await UserRepository.createOrUpdate(user, false, userExists.getPassword());

    return formatJSONResponse(HttpStatus.CREATED, {
      success: true,
      message: 'User updated'
    });
  } catch (error: DomainError | any) {
    console.error(error);
    console.error(event.body);

    if (error instanceof DomainError) return formatErrorResponse(error);

    return formatJSONResponse(HttpStatus.BAD_REQUEST, {
      success: false,
      message: error.toString()
    });
  }
};

export const handler: Handler = middify(updateAvatar, null, BASIC, true);
