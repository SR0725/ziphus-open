class Account {
  constructor(
    readonly id: string,
    readonly googleId: string | null,
    readonly email: string,
    readonly name: string,
    readonly hashedPassword: string,
    readonly createdAt: string,
    readonly updatedAt: string,
    readonly deletedAt: string | null
  ) {}
}

export default Account;
