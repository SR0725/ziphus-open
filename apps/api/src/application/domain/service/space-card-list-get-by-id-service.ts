import { type SpaceCardListGetBySpaceIdUseCaseConstructor } from "@/application/port/in/space-card-list-get-by-space-id-use-case";
import { SpacePermission } from "../model/space";

const spaceCardListGetBySpaceIdUseCaseConstructor: SpaceCardListGetBySpaceIdUseCaseConstructor =

    (loadSpace, loadSpaceCardList) =>
    async ({ spaceId, accountId, isCombineTargetCard }) => {
      const space = await loadSpace({
        id: spaceId,
      });
      if (!space) {
        throw new Error("Space not found");
      }
      if (
        space.permission === SpacePermission.Private &&
        space.belongAccountId !== accountId
      ) {
        throw new Error("Permission denied");
      }

      const spaceCards =
        (await loadSpaceCardList(
          {
            targetSpaceId: spaceId,
          },
          {
            isCombineTargetCard: isCombineTargetCard ?? false,
          }
        )) ?? [];

      spaceCards.sort((a, b) => {
        const indexA = space.layers.indexOf(a.id);
        const indexB = space.layers.indexOf(b.id);
        return indexA - indexB;
      });

      return spaceCards ?? [];
    };

export default spaceCardListGetBySpaceIdUseCaseConstructor;
