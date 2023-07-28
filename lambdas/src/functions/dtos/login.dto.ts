import { IsOptional, IsString } from '@general';

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
