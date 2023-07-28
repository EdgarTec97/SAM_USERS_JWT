import { UserRole } from '@/domain/types/user.role';
import { InvalidPropertyError } from '@/domain/errors/InvalidPropertyError';
import { UserId } from '@/domain/entities/value-objects/user.id';

export type UserPrimitives = ReturnType<User['toPrimitives']>;

export class User {
  constructor(
    private id: UserId,
    private firstName: string,
    private lastName: string,
    private username: string,
    private phone: string | undefined,
    private email: string,
    private password: string,
    private age: number,
    private role: UserRole,
    private createdAt: string,
    private updatedAt: string
  ) {
    this.validate();
  }

  static fromPrimitives(
    u: Omit<UserPrimitives, 'createdAt' | 'updatedAt'> & {
      createdAt?: string;
      updatedAt?: string;
    }
  ) {
    const date = new Date().toISOString();
    return new User(
      new UserId(u.id),
      u.firstName,
      u.lastName,
      u.username,
      u.phone,
      u.email,
      u.password,
      u.age,
      u.role as UserRole,
      u.createdAt || date,
      u.updatedAt || date
    );
  }

  private validate() {
    const roles = ['root', 'visitor', 'standard'];
    if (!roles.includes(this.role))
      throw new InvalidPropertyError(
        this.role,
        `Invalid user role, should send one of this: ${roles}.`
      );

    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        this.email
      )
    )
      throw new InvalidPropertyError(
        this.email,
        "The email isn't in the correct format."
      );

    if (this.age < 18)
      throw new InvalidPropertyError(
        this.age,
        `You must be of legal age to use this system.`
      );
  }

  toPrimitives() {
    return {
      id: this.id.valueOf(),
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      phone: this.phone,
      email: this.email,
      password: this.password,
      age: this.age,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  getId(): UserId {
    return this.id;
  }

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  getUsername(): string {
    return this.username;
  }

  getEmail(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }

  getAge(): number {
    return this.age;
  }

  getRole(): UserRole {
    return this.role;
  }

  getCreatedAt(): string {
    return this.createdAt;
  }

  getUpdatedAt(): string {
    return this.updatedAt;
  }

  getPhone(): string | undefined {
    return this.phone;
  }
}
