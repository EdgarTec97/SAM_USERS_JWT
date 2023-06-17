import { aws, Condition } from 'dynamoose';
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
import { GlobalFunctions } from '../../utils';

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
  async getUsers(): Promise<User[]> {
    const results = await this.model.scan().exec();

    return results.map((result) =>
      User.fromPrimitives((<unknown>{
        ...result,
        createdAt: new Date(result.createdAt).toISOString(),
        updatedAt: new Date(result.updatedAt).toISOString()
      }) as UserPrimitives)
    );
  }

  async createOrUpdate(user: User, save?: boolean): Promise<void> {
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

    const userFound: UserDocument | undefined = resultByEmail
      .concat(resultByUsername)
      .pop();

    // Create workflow
    if (save) {
      if (userFound) throw new UserExistsError();

      userPrimitives.password = await BcryptLib.getInstance().encryptValue(
        userPrimitives.password,
        2
      );

      const document = new this.model(
        GlobalFunctions.getNewParams(userPrimitives, ['createdAt', 'updatedAt'])
      );
      await document.save();
      return;
    }

    // Update workflow
    const document: UserDocument | undefined = (
      await this.model.query('id').eq(userPrimitives.id).limit(1).exec()
    ).pop(); // this.model.get(userId) // in case of use only primary key (individual partition)

    if (!document) throw new UserNotFound(userPrimitives.id);

    if (
      userFound &&
      userFound.id !== document.id &&
      (userPrimitives.email == userFound.email ||
        userPrimitives.username == userFound.email)
    )
      throw new UserExistsError();

    if (userPrimitives.password)
      document.password = await BcryptLib.getInstance().encryptValue(
        userPrimitives.password,
        2
      );

    document.updatedAt = Date.now();

    await document.save();
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
}
