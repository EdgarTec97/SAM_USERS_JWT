import { aws } from 'dynamoose';
import AWS from 'aws-sdk';
import { User, UserPrimitives } from '@/domain/entities/User';
import { UserRepository } from '@/domain/repositories/user.repository';
import {
  UserModel,
  UserDocument
} from '@/infrastructure/database/dynamo/models/user.model';
import { config } from '@/infrastructure/config';

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

  async saveUser(cedis: User): Promise<void> {
    const document = new this.model(cedis.toPrimitives());
    await document.save().catch((err) => {
      console.error(err);
    });
  }

  async getUserById(userId: string): Promise<User | undefined> {
    let document: UserDocument | undefined;
    try {
      document = await this.model.get(userId);
    } catch (error) {
      console.error(error);
      document = undefined;
    }

    return document
      ? User.fromPrimitives((<unknown>document) as UserPrimitives)
      : undefined;
  }

  async updateUser(user: User): Promise<void> {
    const userPrimitives = user.toPrimitives();
    const document = new this.model(userPrimitives);

    await document.save().catch((err) => {
      console.error(err);
    });
  }

  async deleteUser(userId: string): Promise<void> {
    const document = await this.model.get(userId);
    await document.delete();
  }
}
