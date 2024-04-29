import type { SpaceCard } from "@/application/domain/model/space";
import type { DeleteManySpaceCardPort } from "@/application/port/out/delete-many-space-card-port";
import type { MongoCollections } from "./mongo-db";

const SpaceCardPersistenceDeleteManyAdapter =
  ({
    spaceCardCollection,
    spaceCollection,
  }: MongoCollections): DeleteManySpaceCardPort =>
  async (where: Partial<SpaceCard>) => {
    const deletedSpaceCards = await spaceCardCollection
      .find({
        ...where,
      })
      .toArray();

    const spaceCardIds =
      deletedSpaceCards.map((spaceCard) => spaceCard.id) ?? [];

    await spaceCardCollection.deleteMany({
      ...where,
    });

    await spaceCollection.updateMany(
      { layers: { $exists: true, $elemMatch: { $in: spaceCardIds } } },
      {
        $pull: {
          layers: {
            $in: spaceCardIds,
          },
        },
      }
    );

    return { deletedSpaceCardIds: spaceCardIds };
  };

export default SpaceCardPersistenceDeleteManyAdapter;
