import { UserRole } from '@/domain/types/user.role';

export type UserPrimitives = ReturnType<User['toPrimitives']>;

export class User {
  constructor(
    private id: string,
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
      u.id,
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
    if (['root', 'visitor', 'standard'].includes(this.role)) {
      throw new Error('Invalid user role');
    }
  }

  toPrimitives() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      email: this.email,
      password: this.password,
      age: this.age,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      phone: this.phone
    };
  }

  getId(): string {
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
