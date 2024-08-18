import type { LoadCardPort } from "@/application/port/out/load-card-port";
import type { MongoCollections } from "./mongo-db";

const CardPersistenceLoadAdapter =
  ({ cardCollection, yjsPersistence }: MongoCollections): LoadCardPort =>
  async (where) => {
    const card = await cardCollection.findOne({
      ...where,
    });

    if (!card) {
      return null;
    }

    return card;
  };

export default CardPersistenceLoadAdapter;
