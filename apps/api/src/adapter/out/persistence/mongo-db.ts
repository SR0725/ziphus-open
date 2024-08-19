import type { Collection, Db } from "mongodb";
import { MongoClient } from "mongodb";
import type Account from "@/application/domain/model/account";
import type { Space, SpaceCard, Card } from "./mongo-schema";
const { MongodbPersistence } = require("y-mongodb-provider");

export interface MongoCollections {
  spaceCardCollection: Collection<SpaceCard>;
  spaceCollection: Collection<Space>;
  cardCollection: Collection<Card>;
  accountCollection: Collection<Account>;
  yjsDb: Db;
  yjsPersistence: typeof MongodbPersistence;
}

async function createMongoClientCollection(): Promise<MongoCollections> {
  const connectionString = process.env.MONGODB_CONNECTION_STRING;
  const yjsConnectionString = `${process.env.MONGODB_CONNECTION_STRING ?? ""}/${process.env.YJS_DB_NAME ?? ""}`;

  const mainDbName = process.env.MAIN_DB_NAME;
  const yjsDbName = process.env.YJS_DB_NAME;

  if (!connectionString) {
    throw new Error("MONGODB_CONNECTION_STRING is not set");
  }

  const yjsPersistence = new MongodbPersistence(yjsConnectionString, {
    flushSize: 400,
    multipleCollections: true,
  });

  const client = await MongoClient.connect(connectionString);

  const mainDb = client.db(mainDbName);
  const yjsDb = client.db(yjsDbName);
  const spaceCardCollection = mainDb.collection<SpaceCard>("spaceCards");
  const spaceCollection = mainDb.collection<Space>("spaces");
  const cardCollection = mainDb.collection<Card>("cards");
  const accountCollection = mainDb.collection<Account>("account");

  return {
    spaceCardCollection,
    spaceCollection,
    cardCollection,
    accountCollection,
    yjsDb,
    yjsPersistence,
  };
}
export default createMongoClientCollection;
