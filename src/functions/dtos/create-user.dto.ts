import 'reflect-metadata';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { UserRole } from '@/domain/types/user.role';

export class CreateUserDTO {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  username!: string;

  @IsString()
  email!: string;

  @IsString()
  password!: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  role!: UserRole;

  @IsNumber()
  age!: number;
}
