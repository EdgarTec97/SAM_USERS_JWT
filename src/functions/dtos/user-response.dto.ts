import { IsString } from 'class-validator';
import { User } from '@/domain/User';

export class UserResponseDTO {
  @IsString()
  public readonly id!: string;

  @IsString()
  public readonly firstName!: string;

  @IsString()
  public readonly createdAt!: string;

  @IsString()
  public readonly updatedAt!: string;

  constructor({
    id,
    firstName,
    createdAt,
    updatedAt
  }: {
    id: string;
    firstName: string;
    createdAt: string;
    updatedAt: string;
  }) {
    this.id = id;
    this.firstName = firstName;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromDomain(user: User) {
    return new UserResponseDTO(user.toPrimitives() as UserResponseDTO);
  }
}
