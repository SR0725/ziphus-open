import type Space from "@/application/domain/model/space";
import type { LoadSpaceListPort } from "@/application/port/out/load-space-list-port";
import type { MongoCollections } from "./mongo-db";

const SpaceListPersistenceLoadAdapter = (
  { spaceCollection }: MongoCollections
): LoadSpaceListPort => async (where) => {
  const spaceList = await spaceCollection
    .aggregate([
      {
        $match: {
          ...where
        }
      },
      {
        $lookup: {
          from: "spaceCards",
          localField: "id",
          foreignField: "spaceId",
          as: "spaceCards"
        },
      }
    ])
    .toArray() as Space[];

  return spaceList.map(space => ({
    ...space,
    childSpaces: []
  }));
};

export default SpaceListPersistenceLoadAdapter;
