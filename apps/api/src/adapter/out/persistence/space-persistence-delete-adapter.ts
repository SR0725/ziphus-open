import type Space from "@/application/domain/model/space";
import type { DeleteSpacePort } from "@/application/port/out/delete-space-port";
import type { MongoCollections } from "./mongo-db";

const SpacePersistenceDeleteAdapter = (
  { spaceCollection }: MongoCollections
): DeleteSpacePort => async (space: Space) => {
  await spaceCollection.deleteOne({
    id: space.id
  });
};

export default SpacePersistenceDeleteAdapter;
