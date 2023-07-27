import { IsOptional, IsString } from '/opt/infra/index';

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
