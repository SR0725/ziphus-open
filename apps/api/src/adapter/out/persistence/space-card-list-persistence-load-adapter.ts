import type { LoadSpaceCardListPort } from "@/application/port/out/load-space-card-list-port";
import type SpaceCardCombineTargetCard from "@/application/port/in/space-card-combine-target-card";
import type { MongoCollections } from "./mongo-db";

const SpaceCardListPersistenceLoadAdapter =
  ({ spaceCardCollection }: MongoCollections): LoadSpaceCardListPort =>
  async (where, option) => {
    const { isCombineTargetCard } = option;
    const { targetSpaceId } = where;

    const aggregatePipeline = isCombineTargetCard
      ? [
          {
            $match: {
              targetSpaceId,
            },
          },
          {
            $lookup: {
              from: "cards",
              localField: "targetCardId",
              foreignField: "id",
              as: "card",
            },
          },
          {
            $unwind: {
              path: "$card",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              id: "$id",
              targetCardId: 1,
              targetSpaceId: 1,
              x: 1,
              y: 1,
              card: 1,
              linkLines: 1,
            },
          },
        ]
      : [
          {
            $match: {
              targetSpaceId,
            },
          },
        ];

    const spaceCards = (await spaceCardCollection
      .aggregate(aggregatePipeline)
      .toArray()) as SpaceCardCombineTargetCard[];

    return spaceCards;
  };

export default SpaceCardListPersistenceLoadAdapter;
