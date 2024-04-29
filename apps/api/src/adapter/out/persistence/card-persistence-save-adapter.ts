import type Card from "@/application/domain/model/card";
import type { SaveCardPort } from "@/application/port/out/save-card-port";
import type { MongoCollections } from "./mongo-db";

const MIN_SAVE_INTERVAL = 1000;

interface SaveCardCommand {
  card: Card;
  saveTime: number;
}

const commandMap: Record<string, SaveCardCommand> = {};

const CardPersistenceSaveAdapter =
  ({ cardCollection }: MongoCollections): SaveCardPort =>
  async (card: Card, needRealTime) => {
    commandMap[card.id] = {
      card,
      saveTime: Date.now() + (needRealTime ? 0 : MIN_SAVE_INTERVAL),
    };

    async function handelCommand() {
      const needDealCommands = Object.values(commandMap).filter(
        ({ saveTime }) => saveTime <= Date.now() + 100
      );

      if (needDealCommands.length === 0) {
        return;
      }

      await cardCollection.bulkWrite(
        needDealCommands.map(({ card }) => ({
          updateOne: {
            filter: { id: card.id },
            update: { $set: card },
            upsert: true,
          },
        }))
      );

      const needDealCommandIds = needDealCommands.map(({ card }) => card.id);
      needDealCommandIds.forEach((id) => {
        delete commandMap[id];
      });
    }

    needRealTime ? await handelCommand() : setTimeout(handelCommand, 5000);
  };

export default CardPersistenceSaveAdapter;
