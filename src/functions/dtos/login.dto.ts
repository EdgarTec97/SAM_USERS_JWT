import 'reflect-metadata';
import { IsOptional, IsString } from 'class-validator';

export class LoginDTO {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  password!: string;
}
