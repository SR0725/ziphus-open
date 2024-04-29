import type { LoadCardListPort } from "@/application/port/out/load-card-list-port";
import type { MongoCollections } from "./mongo-db";

const CardListPersistenceLoadAdapter = (
  { cardCollection }: MongoCollections
): LoadCardListPort => async (where) => {
  const cardList = await cardCollection
    .find({
      ...where
    })
    .toArray();

  return cardList;
};

export default CardListPersistenceLoadAdapter;
