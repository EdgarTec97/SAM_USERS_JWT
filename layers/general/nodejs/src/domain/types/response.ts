import { User } from '@/domain/entities/User';

export type UsersResponse = {
  page: number;
  itemsByPage: number;
  usersSize: number;
  totalUsers: number;
  totalPages: number;
  users: User[];
};
