import type { LoadAccountPort } from "@/application/port/out/load-account-port";
import type { MongoCollections } from "./mongo-db";

const AccountPersistenceLoadAdapter = (
  { accountCollection }: MongoCollections
): LoadAccountPort => async (where) => {
  const account = await accountCollection
    .findOne({
      ...where
    });
  return account;
};

export default AccountPersistenceLoadAdapter;
