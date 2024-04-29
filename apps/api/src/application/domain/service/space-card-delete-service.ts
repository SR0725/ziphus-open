import type { SpaceCardDeleteUseCaseConstructor } from "@/application/port/in/space-card-delete-use-case";
import { SpacePermission } from "../model/space";

const spaceCardDeleteUseCaseConstructor: SpaceCardDeleteUseCaseConstructor =
  (loadSpace, loadSpaceCard, deleteSpaceCard) =>
  async ({ accountId, spaceCardId }) => {
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

    await deleteSpaceCard(existingSpaceCard);

    return true;
  };

export default spaceCardDeleteUseCaseConstructor;
