import type Account from "@/application/domain/model/account";
import type { SaveAccountPort } from "@/application/port/out/save-account-port";
import type { MongoCollections } from "./mongo-db";

const AccountPersistenceSaveAdapter = (
  { accountCollection }: MongoCollections
): SaveAccountPort => async (
  account: Account
) => {
    await accountCollection.updateOne(
      {
        id: account.id
      },
      {
        $set: account
      },
      {
        upsert: true
      }
    );
  };

export default AccountPersistenceSaveAdapter;
