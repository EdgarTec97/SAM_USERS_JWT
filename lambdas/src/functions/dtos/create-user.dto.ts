//@ts-ignore
import { IsString, IsNumber, IsOptional, MinLength, UserRole } from '@general';

export class CreateUserDTO {
  @IsString()
  @MinLength(4, { message: 'The firstName must have at least 4 characters.' })
  firstName!: string;

  @IsString()
  @MinLength(4, { message: 'The lastName must have at least 4 characters.' })
  lastName!: string;

  @IsString()
  @MinLength(4, { message: 'The username must have at least 4 characters.' })
  username!: string;

  @IsString()
  @MinLength(4, { message: 'The email must have at least 4 characters.' })
  email!: string;

  @IsString()
  @MinLength(4, { message: 'The password must have at least 4 characters.' })
  password!: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  role!: UserRole;

  @IsNumber()
  age!: number;

  @IsString()
  @IsOptional()
  avatar?: string;
}
