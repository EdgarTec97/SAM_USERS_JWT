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
  GlobalFunctions,
  config
} from '@general';

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

    const fileName = `${GlobalFunctions.randomUUID()}.${
      file.filename.split('.')[1]
    }`;

    await S3BucketService.send({
      filePath: fileName,
      file: file.content.toString()
    });

    const user = User.fromPrimitives({
      id: userId,
      firstName: userExists.getFirstName(),
      lastName: userExists.getLastName(),
      username: userExists.getUsername(),
      email: userExists.getEmail(),
      phone: userExists.getPhone(),
      password: undefined,
      age: userExists.getAge(),
      role: userExists.getRole(),
      verified: userExists.getVerified(),
      avatar: `https://${config.aws.bucket}.s3.amazonaws.com/${fileName}`,
      createdAt: <string>(<unknown>Date.parse(userExists.getCreatedAt()))
    });

    await UserRepository.createOrUpdate(user, false, userExists.getPassword());

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
