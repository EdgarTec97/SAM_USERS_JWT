import { aws } from 'dynamoose';
import AWS from 'aws-sdk';
import { User, UserPrimitives } from '@/domain/entities/User';
import { UserRepository } from '@/domain/repositories/user.repository';
import { UserNotFound } from '@/domain/errors/UserNotFound';
import {
  UserModel,
  UserDocument
} from '@/infrastructure/database/dynamodb/models/user.model';
import { config } from '@/infrastructure/config';
import { BcryptLib } from '@/infrastructure/utils/encrypt.lib';

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
  async getUser(): Promise<User[]> {
    const results = await this.model.scan().exec();

    return results.map((result) =>
      User.fromPrimitives((<unknown>result) as UserPrimitives)
    );
  }

  async createOrUpdate(user: User): Promise<void> {
    const userPrimitives = user.toPrimitives();

    userPrimitives.password = await BcryptLib.getInstance().encryptValue(
      userPrimitives.password,
      2
    );
    const document = new this.model(userPrimitives);
    await document.save();
  }

  async getUserById(userId: string): Promise<User | undefined> {
    const document: UserDocument | undefined = await this.model.get(userId);

    if (!document) throw new UserNotFound(userId);

    return User.fromPrimitives((<unknown>document) as UserPrimitives);
  }

  async deleteUser(userId: string): Promise<void> {
    const document = await this.model.get(userId);
    await document.delete();
  }
}
