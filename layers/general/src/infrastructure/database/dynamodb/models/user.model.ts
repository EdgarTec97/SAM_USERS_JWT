import { model } from 'dynamoose';
import { Item } from 'dynamoose/dist/Item';
import { config } from '@/infrastructure/config';
import { UserSchema } from '@/infrastructure/database/dynamodb/schemas/user.schema';
import { UserRole } from '@/domain/types/user.role';

export class UserDocument extends Item {
  id!: string;
  firstName!: string;
  lastName!: string;
  username!: string;
  email!: string;
  password!: string;
  phone!: string;
  age!: number;
  role!: UserRole;
  verified!: boolean;
  avatar!: string;
  active!: boolean;
  createdAt!: number;
  updatedAt!: number;
}

export const UserModel = model<UserDocument>(
  config.aws.dynamoDB.users.tableName,
  UserSchema
);
