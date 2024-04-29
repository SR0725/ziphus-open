import type { SaveSpaceCardPort } from "@/application/port/out/save-space-card-port";
import type { MongoCollections } from "./mongo-db";
import type { SpaceCard } from "./mongo-schema";

const MIN_SAVE_INTERVAL = 1000;
interface SaveSpaceCardCommand {
  spaceCard: SpaceCard;
  saveTime: number;
}

const commandMap: Record<string, SaveSpaceCardCommand> = {};

const SpaceCardPersistenceSaveAdapter =
  ({
    spaceCardCollection,
    spaceCollection,
  }: MongoCollections): SaveSpaceCardPort =>
  async (spaceCard, needRealTime?: boolean) => {
    // 為了避免在短時間內重複儲存相同的 SpaceCard，我們會在這裡加入一個緩存機制
    commandMap[spaceCard.id] = {
      spaceCard,
      saveTime: Date.now() + (needRealTime ? 0 : MIN_SAVE_INTERVAL),
    };

    async function handelCommand() {
      const needDealCommands = Object.values(commandMap).filter(
        ({ saveTime }) => saveTime <= Date.now() + 100
      );

      if (needDealCommands.length === 0) {
        return;
      }

      await spaceCardCollection.bulkWrite(
        needDealCommands.map(({ spaceCard }) => ({
          updateOne: {
            filter: { id: spaceCard.id },
            update: { $set: spaceCard },
            upsert: true,
          },
        }))
      );

      const layers = needDealCommands.reduce((acc, { spaceCard }) => {
        if (!acc.has(spaceCard.targetSpaceId)) {
          acc.set(spaceCard.targetSpaceId, []);
        }
        acc.get(spaceCard.targetSpaceId)?.push(spaceCard.id);
        return acc;
      }, new Map<string, string[]>());

      await spaceCollection.bulkWrite(
        Array.from(layers.entries()).map(([spaceId, spaceCardIds]) => ({
          updateOne: {
            filter: { id: spaceId },
            update: {
              $addToSet: {
                layers: {
                  $each: spaceCardIds,
                },
              },
            },
          },
        }))
      );

      // 移除已經處理過的指令
      const needDealCommandIds = needDealCommands.map(
        ({ spaceCard }) => spaceCard.id
      );
      needDealCommandIds.forEach((id) => {
        delete commandMap[id];
      });
    }

    needRealTime ? await handelCommand() : setTimeout(handelCommand, 5000);
  };

export default SpaceCardPersistenceSaveAdapter;
