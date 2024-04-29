import type Card from "@/application/domain/model/card";
import type { DeleteCardPort } from "@/application/port/out/delete-card-port";
import type { MongoCollections } from "./mongo-db";

const CardPersistenceDeleteAdapter = (
  { cardCollection, yjsDb }: MongoCollections
): DeleteCardPort => async (card: Card) => {
  await cardCollection.deleteOne({
    id: card.id
  });

  await yjsDb.dropCollection(`card:${card.id}`);
};

export default CardPersistenceDeleteAdapter;
