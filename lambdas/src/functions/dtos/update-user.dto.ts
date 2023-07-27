import { IsString, IsNumber, IsOptional, MinLength } from '/opt/infra/index';
import { UserRole } from '/opt/infra/index';

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
}
