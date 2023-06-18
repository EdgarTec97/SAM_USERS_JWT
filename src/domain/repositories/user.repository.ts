import { User } from '@/domain/entities/User';
import { UserId } from '@/domain/entities/value-objects/user.id';
import { UsersResponse } from '@/domain/types/response';

export interface UserRepository {
  createOrUpdate(user: User, save?: boolean): Promise<void>;
  getUserById(userId: UserId): Promise<User>;
  getUsers(page: number, pageSize: number): Promise<UsersResponse>;
  deleteUser(userId: UserId): Promise<void>;
}
