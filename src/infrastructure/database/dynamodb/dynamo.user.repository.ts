import { aws } from 'dynamoose';
import AWS from 'aws-sdk';
import { User, UserPrimitives } from '@/domain/entities/User';
import { UserRepository } from '@/domain/repositories/user.repository';
import { UserNotFound } from '@/domain/errors/UserNotFound';
import { UserId } from '@/domain/entities/value-objects/user.id';
import {
  UserModel,
  UserDocument
} from '@/infrastructure/database/dynamodb/models/user.model';
import { config } from '@/infrastructure/config';
import { BcryptLib } from '@/infrastructure/utils/encrypt.lib';
import { UserExistsError } from '@/domain/errors/UserExistsError';
import { GlobalFunctions } from '@/infrastructure/utils';
import { UsersResponse } from '@/domain/types/response';
import { JSONWebTokenAuth } from '@/infrastructure/utils/jwt.lib';

export class DynamoUserRepository implements UserRepository {
  private readonly model = UserModel;

  private readonly region = config.aws.region;
  constructor() {
    AWS.config.update({ region: this.region });

    if (config.isOffline) {
      aws.ddb.local(
        `http://${config.aws.dynamoDB.users.host}:${config.aws.dynamoDB.users.port}`
      );
    }
  }
  async getUsers(page: number, pageSize: number): Promise<UsersResponse> {
    const results = await this.model.scan().exec();

    let users: UserPrimitives[] = results.sort(
      (userA, userB) => userB.createdAt - userA.createdAt
    ) as any;

    const size = users.length;

    users = users.splice((page - 1) * pageSize, pageSize);

    const totalPages = size / users.length;
    const floor = Math.floor(totalPages);

    return {
      page,
      itemsByPage: pageSize,
      usersSize: users.length,
      totalUsers: size,
      totalPages:
        users.length < pageSize ? page : floor < totalPages ? floor + 1 : floor,
      users: users.map((user) =>
        User.fromPrimitives((<unknown>{
          ...user,
          createdAt: new Date(user.createdAt).toISOString(),
          updatedAt: new Date(user.updatedAt).toISOString()
        }) as UserPrimitives)
      )
    };
  }

  async createOrUpdate(
    user: User,
    save?: boolean,
    password?: string
  ): Promise<void> {
    const userPrimitives = user.toPrimitives();

    // const condition = new Condition().where('email').eq(userPrimitives.email).or().where('username').eq(userPrimitives.username);

    /* 
    const userFound = (await UserModel.scan('username')
      .eq('edgarcv')
      .or()
      .where('email')
      .eq('vayne.edgar@gmail.com')
      .exec()).pop();
    */

    const queryByEmail = this.model
      .query('email')
      .eq(userPrimitives.email)
      .limit(1)
      .exec();
    const queryByUsername = this.model
      .query('username')
      .eq(userPrimitives.username)
      .limit(1)
      .exec();

    const [resultByEmail, resultByUsername] = await Promise.all([
      queryByEmail,
      queryByUsername
    ]);

    const usersFound: UserDocument[] = resultByEmail.concat(resultByUsername);

    // Validate the password to update method
    userPrimitives.password = userPrimitives.password
      ? await BcryptLib.getInstance().encryptValue(userPrimitives.password, 2)
      : password!;

    // Create workflow
    if (save) {
      if (usersFound.pop()) throw new UserExistsError();

      const document = new this.model(
        GlobalFunctions.getNewParams(userPrimitives, ['createdAt', 'updatedAt'])
      );
      await document.save();
      return;
    }
    // Update workflow
    const userFound = usersFound.some(
      (userF) =>
        userF.id !== userPrimitives.id &&
        (userPrimitives.email == userF.email ||
          userPrimitives.username == userF.username)
    );
    if (userFound) throw new UserExistsError();

    await this.model.update(
      { id: userPrimitives.id, createdAt: userPrimitives.createdAt },
      {
        ...GlobalFunctions.removeFalsyProperties(
          GlobalFunctions.getNewParams<any>(userPrimitives, [
            'id',
            'createdAt',
            'updatedAt'
          ])
        ),
        updatedAt: Date.now()
      }
    );
  }

  async getUserById(userId: UserId): Promise<User> {
    const document: UserDocument | undefined = (
      await this.model.query('id').eq(userId.valueOf()).limit(1).exec()
    ).pop(); // this.model.get(userId) // in case of use only primary key (individual partition)

    if (!document) throw new UserNotFound(userId.valueOf());

    return User.fromPrimitives((<unknown>{
      ...document,
      createdAt: new Date(document.createdAt).toISOString(),
      updatedAt: new Date(document.updatedAt).toISOString()
    }) as UserPrimitives);
  }

  async deleteUser(userId: UserId): Promise<void> {
    const document: UserDocument | undefined = (
      await this.model.query('id').eq(userId.valueOf()).limit(1).exec()
    ).pop(); // this.model.get(userId) // in case of use only primary key (individual partition)

    if (!document) throw new UserNotFound(userId.valueOf());

    await document.delete();
  }

  async login(
    { email, username }: { email?: string; username?: string },
    password: string
  ): Promise<string> {
    let userFound: UserDocument | undefined;

    const finding = async (property: string, value: string) =>
      (await this.model.query({ [property]: value }).exec()).pop();

    if (username) userFound = await finding('username', username);
    if (email && !userFound) userFound = await finding('email', email);

    if (!userFound)
      throw new UserNotFound('', 'User not found: Incorrect credentials');

    const verifyPassword = await BcryptLib.getInstance().verifyEncryptValue(
      password,
      userFound.password
    );

    if (!verifyPassword)
      throw new UserNotFound('', 'User not found: Incorrect credentials');

    return JSONWebTokenAuth.getInstance().sign(userFound, [
      'createdAt',
      'updatedAt',
      'password',
      'active'
    ]);
  }
}
