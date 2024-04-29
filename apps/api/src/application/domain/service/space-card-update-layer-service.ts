import type { SpaceCardUpdateLayerUseCaseConstructor } from "@/application/port/in/space-card-update-layer-use-case";
import { SpacePermission } from "../model/space";

const spaceCardUpdateLayerUseCaseConstructor: SpaceCardUpdateLayerUseCaseConstructor =

    (loadSpaceCard, loadSpace, saveSpace) =>
    async ({ accountId, targetSpaceCardId, operation }) => {
      // 確認卡片
      const targetSpaceCard = await loadSpaceCard({ id: targetSpaceCardId });
      if (!targetSpaceCard) {
        throw new Error("Space card not found");
      }
      // 確認空間與權限
      const targetSpace = await loadSpace({
        id: targetSpaceCard.targetSpaceId,
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

      const cardLayers = targetSpace.layers;
      const currentIndex = cardLayers.indexOf(targetSpaceCardId);
      if (currentIndex === -1) {
        throw new Error("Space card not found in layers");
      }

      let newIndex = currentIndex;
      if (operation === "top") {
        newIndex = cardLayers.length - 1;
      } else if (operation === "bottom") {
        newIndex = 0;
      } else if (operation === "up") {
        newIndex =
          currentIndex === cardLayers.length - 1
            ? currentIndex
            : currentIndex + 1;
      } else if (operation === "down") {
        newIndex = currentIndex === 0 ? 0 : currentIndex - 1;
      }

      if (newIndex < 0 || newIndex >= cardLayers.length) {
        throw new Error("Invalid operation");
      }

      cardLayers.splice(currentIndex, 1);

      cardLayers.splice(newIndex, 0, targetSpaceCardId);

      await saveSpace({
        ...targetSpace,
        layers: cardLayers,
      });

      return cardLayers;
    };

export default spaceCardUpdateLayerUseCaseConstructor;
