import type { SaveSpaceCardPort } from "@/application/port/out/save-space-card-port";
import type { MongoCollections } from "./mongo-db";
import type { SpaceCard } from "./mongo-schema";
import { Timer } from "@/common/timer";

const MIN_SAVE_INTERVAL = 1000;
interface SaveSpaceCardCommand {
  spaceCard: SpaceCard;
  saveTime: number;
}

const commandMap: Record<string, SaveSpaceCardCommand> = {};
const timer = Timer(MIN_SAVE_INTERVAL);

// TODO: 目前程式存在缺陷，如果在短時間內重複儲存相同的 SpaceCard，會導致 SpaceCard 被覆蓋
// 不過考慮到 SpaceCard 簡單，不太會出現這種情況，所以暫時不處理

const SpaceCardPersistenceSaveAdapter =
  ({
    spaceCardCollection,
    spaceCollection,
  }: MongoCollections): SaveSpaceCardPort =>
  async (spaceCard, needRealTime?: boolean) => {
    if (needRealTime) {
      await spaceCardCollection.updateOne(
        { id: spaceCard.id },
        { $set: spaceCard },
        { upsert: true }
      );

      await spaceCollection.updateOne(
        { id: spaceCard.targetSpaceId },
        {
          $addToSet: {
            layers: spaceCard.id,
          },
        }
      );
      return;
    }
    // 為了避免在短時間內重複儲存相同的 SpaceCard，我們會在這裡加入一個緩存機制
    commandMap[spaceCard.id] = {
      spaceCard,
      saveTime: Date.now() + MIN_SAVE_INTERVAL,
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

      timer.clear();
      if (Object.keys(commandMap).length > 0) {
        timer.start(handelCommand);
      }
    }

    timer.start(handelCommand);
  };

export default SpaceCardPersistenceSaveAdapter;
