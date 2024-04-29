import type { SaveSpacePort } from "@/application/port/out/save-space-port";
import type { MongoCollections } from "./mongo-db";

const SpacePersistenceSaveAdapter = (
  { spaceCollection, spaceCardCollection }: MongoCollections
): SaveSpacePort => async (space) => {

  await spaceCollection.updateOne(
    {
      id: space.id
    },
    {
      $set: {
        ...space,
        childSpaces: undefined,
        spaceCards: undefined
      }
    },
    {
      upsert: true
    }
  );
};

export default SpacePersistenceSaveAdapter;
