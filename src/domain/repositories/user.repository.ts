import { User } from '@/domain/entities/User';

export interface UserRepository {
  createOrUpdate(user: User): Promise<void>;
  getUserById(userId: string): Promise<User | undefined>;
  getUser(): Promise<User[]>;
  deleteUser(userId: string): Promise<void>;
}
