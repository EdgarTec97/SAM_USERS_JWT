import { User } from '@/domain/entities/User';
import { UserId } from '@/domain/entities/value-objects/user.id';
import { UsersResponse } from '@/domain/types/response';

export interface UserRepository {
  login(
    { email, username }: { email?: string; username?: string },
    password: string
  ): Promise<string>;
  createOrUpdate(user: User, save?: boolean, password?: string): Promise<void>;
  getUserById(userId: UserId): Promise<User>;
  getUsers(page: number, pageSize: number): Promise<UsersResponse>;
  deleteUser(userId: UserId): Promise<void>;
}
