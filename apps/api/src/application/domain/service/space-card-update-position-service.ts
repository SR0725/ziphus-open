import type { SpaceCardUpdatePositionUseCaseConstructor } from "@/application/port/in/space-card-update-position-use-case";
import { SpacePermission } from "../model/space";

const spaceCardUpdatePositionUseCaseConstructor: SpaceCardUpdatePositionUseCaseConstructor =
  (loadSpace, loadSpaceCard, saveSpaceCard) =>
    async ({ accountId, spaceCardId, x, y }) => {
      const existingSpaceCard = await loadSpaceCard({ id: spaceCardId });
      if (!existingSpaceCard) {
        throw new Error("Space card not found");
      }
      const targetSpace = await loadSpace({
        id: existingSpaceCard.targetSpaceId,
      });
      if (!targetSpace) {
        throw new Error("Space not found");
      }
      if (
        targetSpace.permission !== SpacePermission.PublicEditable &&
        targetSpace.belongAccountId !== accountId
      ) {
        throw new Error("Permission denied");
      }

      await saveSpaceCard({
        ...existingSpaceCard,
        x,
        y,
      });

      return true;
    };

export default spaceCardUpdatePositionUseCaseConstructor;
