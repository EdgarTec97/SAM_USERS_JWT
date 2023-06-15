import 'reflect-metadata';
import { IsString, IsNumber, IsOptional, MinLength } from 'class-validator';
import { UserRole } from '@/domain/types/user.role';

export class CreateUserDTO {
  @IsString()
  @MinLength(4)
  firstName!: string;

  @IsString()
  @MinLength(4)
  lastName!: string;

  @IsString()
  @MinLength(4)
  username!: string;

  @IsString()
  @MinLength(4)
  email!: string;

  @IsString()
  @MinLength(4)
  password!: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  role!: UserRole;

  @IsNumber()
  age!: number;
}
