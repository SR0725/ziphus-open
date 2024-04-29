import type { LoadSpaceCardPort } from "@/application/port/out/load-space-card-port";
import type { MongoCollections } from "./mongo-db";

const SpaceCardPersistenceLoadAdapter = (
  { spaceCardCollection }: MongoCollections
): LoadSpaceCardPort => async (where) => {
  const spaceCard = await spaceCardCollection.findOne({
    ...where
  });

  return spaceCard;
};

export default SpaceCardPersistenceLoadAdapter;
