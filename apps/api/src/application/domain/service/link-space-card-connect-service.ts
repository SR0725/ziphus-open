import { randomUUID } from "node:crypto";
import { type LinkSpaceCardConnectUseCaseConstructor } from "@/application/port/in/link-space-card-connect-use-case";
import { LineType, LinkLine, SpaceCard, SpacePermission } from "../model/space";

const linkSpaceCardConnectUseCaseConstructor: LinkSpaceCardConnectUseCaseConstructor =

    (loadSpace, loadSpaceCard, saveSpaceCard) =>
    async ({
      accountId,
      spaceId,
      startSpaceCardId,
      endSpaceCardId,
      startSpaceCardDirection,
      endSpaceCardDirection,
    }) => {
      const targetSpace = await loadSpace({
        id: spaceId,
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

      const startSpaceCard = await loadSpaceCard({ id: startSpaceCardId });
      const endSpaceCard = await loadSpaceCard({ id: endSpaceCardId });
      if (!startSpaceCard || !endSpaceCard) {
        throw new Error("Space card not found");
      }

      const newStartSpaceCard: SpaceCard = {
        ...startSpaceCard,
        linkLines: [
          ...startSpaceCard.linkLines,
          new LinkLine(
            randomUUID(),
            startSpaceCardDirection,
            endSpaceCardDirection,
            LineType.Curve,
            startSpaceCard.id,
            endSpaceCard.id,
            startSpaceCard.x,
            startSpaceCard.y,
            endSpaceCard.x,
            endSpaceCard.y,
            new Date().toISOString(),
            new Date().toISOString(),
            null
          ),
        ],
      };

      saveSpaceCard(newStartSpaceCard, true);

      return newStartSpaceCard;
    };

export default linkSpaceCardConnectUseCaseConstructor;
