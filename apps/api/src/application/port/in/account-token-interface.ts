class AccountTokenInterface {
  constructor(
    // 特指該 token 的 id
    readonly id: string,
    readonly accountId: string,
    readonly name: string,
    readonly email: string
  ) {}
}

export default AccountTokenInterface;
