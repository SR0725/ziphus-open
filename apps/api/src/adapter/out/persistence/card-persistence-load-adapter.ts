import type { LoadCardPort } from "@/application/port/out/load-card-port";
import type { MongoCollections } from "./mongo-db";

const CardPersistenceLoadAdapter =
  ({ cardCollection, yjsDb }: MongoCollections): LoadCardPort =>
  async (where) => {
    const card = await cardCollection.findOne({
      ...where,
    });

    return card;
  };

export default CardPersistenceLoadAdapter;
