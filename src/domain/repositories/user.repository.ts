import { User } from '@/domain/entities/User';

export interface UserRepository {
  saveUser(user: User): Promise<void>;
  getUserById(userId: string): Promise<User | undefined>;
  getUser(): Promise<User[]>;
  updateUser(user: User): Promise<void>;
  deleteUser(userId: string): Promise<void>;
}
