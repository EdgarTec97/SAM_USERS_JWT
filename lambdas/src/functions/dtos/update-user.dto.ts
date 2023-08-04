import {
  IsString,
  IsNumber,
  IsOptional,
  MinLength,
  UserRole,
  IsBoolean
} from '@general';

export class UpdateUserDTO {
  @IsString()
  @MinLength(4, { message: 'The firstName must have at least 4 characters.' })
  @IsOptional()
  firstName!: string;

  @IsString()
  @MinLength(4, { message: 'The lastName must have at least 4 characters.' })
  @IsOptional()
  lastName!: string;

  @IsString()
  @MinLength(4, { message: 'The username must have at least 4 characters.' })
  @IsOptional()
  username!: string;

  @IsString()
  @MinLength(4, { message: 'The email must have at least 4 characters.' })
  @IsOptional()
  email!: string;

  @IsString()
  @MinLength(4, { message: 'The password must have at least 4 characters.' })
  @IsOptional()
  password!: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  role!: UserRole;

  @IsNumber()
  @IsOptional()
  age!: number;

  @IsBoolean()
  @IsOptional()
  verified!: number;

  @IsString()
  @IsOptional()
  avatar?: string;
}
