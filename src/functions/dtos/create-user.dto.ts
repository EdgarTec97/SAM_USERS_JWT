import 'reflect-metadata';
import { IsString } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  firstName!: string;
}
