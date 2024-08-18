import { randomUUID } from "node:crypto";
import Account from "@/application/domain/model/account";
import Card, {
  CardPermission,
  CardType,
} from "@/application/domain/model/card";
import hash from "@/common/hash";
import Space, { SpacePermission } from "@/application/domain/model/space";

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
    CardPermission.PublicEditable,
    "",
    "",
    "",
    600,
    128,
    true,
    [],
    [],
    CardType.note,
    null,
    new Date().toISOString(),
    new Date().toISOString(),
    null
  );
}

export function createExampleSpace(accountId: string): Space {
  return new Space(
    randomUUID(),
    accountId,
    "Example Title",
    SpacePermission.PublicEditable,
    [],
    new Date().toISOString(),
    new Date().toISOString(),
    null
  );
}
