import type { MongoCollections } from "./mongo-db";
import { CreateSpaceCardListPort } from "@/application/port/out/create-space-card-list-port";

const SpaceCardListPersistenceCreateAdapter =
  ({ spaceCardCollection }: MongoCollections): CreateSpaceCardListPort =>
    async (spaceCards) => {
    console.log(spaceCards);
    await spaceCardCollection.insertMany(spaceCards);
  };

export default SpaceCardListPersistenceCreateAdapter;
