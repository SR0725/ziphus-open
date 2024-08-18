import { type LinkSpaceCardRemoveUseCaseConstructor } from "@/application/port/in/link-space-card-remove-use-case";
import { SpaceCard, SpacePermission } from "../model/space";

const linkSpaceCardRemoveUseCaseConstructor: LinkSpaceCardRemoveUseCaseConstructor =

    (loadSpace, loadSpaceCard, saveSpaceCard) =>
    async ({ accountId, spaceId, targetSpaceCardId, linkLineId }) => {
      const targetSpace = await loadSpace({
        id: spaceId,
      });

      if (
        targetSpace?.permission !== SpacePermission.PublicEditable &&
        targetSpace?.belongAccountId !== accountId
      ) {
        throw new Error("Permission denied");
      }

      const targetSpaceCard = await loadSpaceCard({ id: targetSpaceCardId });
      if (!targetSpaceCard) {
        throw new Error("Space card not found");
      }

      const newTargetSpaceCard: SpaceCard = {
        ...targetSpaceCard,
        linkLines: targetSpaceCard.linkLines.filter(
          (line) => line.id !== linkLineId
        ),
      };

      saveSpaceCard(newTargetSpaceCard, true);

      return newTargetSpaceCard;
    };

export default linkSpaceCardRemoveUseCaseConstructor;
