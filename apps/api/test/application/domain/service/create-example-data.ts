import { randomUUID } from "node:crypto";
import Account from "@/application/domain/model/account";
import Card, { CardPermission } from "@/application/domain/model/card";
import hash from "@/common/hash";

export const examplePassword = "test-password";

export async function createExampleAccount(): Promise<Account> {
  const hashedExamplePassword = await hash(examplePassword);

  return new Account(
    randomUUID(),
    null,
    "test@example.com",
    "Test User",
    hashedExamplePassword,
    new Date().toISOString(),
    new Date().toISOString(),
    null
  );
}

export function createExampleCard(accountId: string): Card {
  return new Card(
    randomUUID(),
    accountId,
    CardPermission.Private,
    "",
    "",
    1280,
    1280,
    true,
    [],
    [],
    new Date().toISOString(),
    new Date().toISOString(),
    null
  );
}
