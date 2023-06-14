export type UserPrimitives = ReturnType<User['toPrimitives']>;

export class User {
  constructor(
    private id: string,
    private firstName: string,
    private createdAt?: string,
    private updatedAt?: string
  ) {
    this.validate();
  }

  static fromPrimitives(u: UserPrimitives) {
    return new User(u.id, u.firstName, u.createdAt, u.updatedAt);
  }

  private validate() {}

  toPrimitives() {
    return {
      id: this.id,
      firstName: this.firstName,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  getId() {
    return this.id;
  }
}
