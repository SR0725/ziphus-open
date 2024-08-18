import type { MongoCollections } from "./mongo-db";
import { CreateCardListPort } from "@/application/port/out/create-card-list-port";

const SpaceCardListPersistenceCreateAdapter =
  ({ cardCollection }: MongoCollections): CreateCardListPort =>
  async (cards) => {
    await cardCollection.insertMany(cards);
  };

export default SpaceCardListPersistenceCreateAdapter;
