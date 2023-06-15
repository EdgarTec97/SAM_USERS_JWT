import { User } from '@/domain/entities/User';
import { UserId } from '@/domain/entities/value-objects/user.id';

export interface UserRepository {
  createOrUpdate(user: User, save?: boolean): Promise<void>;
  getUserById(userId: UserId): Promise<User>;
  getUsers(): Promise<User[]>;
  deleteUser(userId: UserId): Promise<void>;
}
