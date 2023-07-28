import { DynamoUserRepository } from '@/infrastructure/database/dynamodb/dynamo.user.repository';
import { UserRepository as Repository } from '@/domain/repositories/user.repository';

export const UserRepository: Repository = new DynamoUserRepository();
