import { User } from '@/domain/entities/User';
import { UserId } from '@/domain/entities/value-objects/user.id';

export interface UserRepository {
  createOrUpdate(user: User): Promise<void>;
  getUserById(userId: UserId): Promise<User>;
  getUser(): Promise<User[]>;
  deleteUser(userId: UserId): Promise<void>;
}
