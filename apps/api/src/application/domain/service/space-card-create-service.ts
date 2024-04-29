import { randomUUID } from "node:crypto";
import { type SpaceCardCreateUseCaseConstructor } from "@/application/port/in/space-card-create-use-case";
import { SpaceCard, SpacePermission } from "../model/space";

const spaceCardCreateUseCaseConstructor: SpaceCardCreateUseCaseConstructor =
  (loadSpace, saveSpaceCard) =>
  async ({ accountId, targetCardId, targetSpaceId, x, y }) => {
    const targetSpace = await loadSpace({ id: targetSpaceId });
    if (!targetSpace) {
      throw new Error("Space not found");
    }
    if (
      targetSpace.permission !== SpacePermission.PublicEditable &&
      targetSpace.belongAccountId !== accountId
    ) {
      throw new Error("Permission denied");
    }

    const newSpaceCard = new SpaceCard(
      randomUUID(),
      targetCardId,
      targetSpaceId,
      x,
      y
    );

    await saveSpaceCard(newSpaceCard, true);

    return newSpaceCard;
  };

export default spaceCardCreateUseCaseConstructor;
