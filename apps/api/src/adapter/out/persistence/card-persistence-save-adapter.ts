import type Card from "@/application/domain/model/card";
import type { SaveCardPort } from "@/application/port/out/save-card-port";
import type { MongoCollections } from "./mongo-db";
import { Timer } from "@/common/timer";

const MIN_SAVE_INTERVAL = 1000;

interface SaveCardCommand {
  card: Partial<Card> & { id: string };
  saveTime: number;
}

const commandMap: Record<string, SaveCardCommand> = {};
const timer = Timer(MIN_SAVE_INTERVAL);

const CardPersistenceSaveAdapter =
  ({ cardCollection }: MongoCollections): SaveCardPort =>
  async (card: Partial<Card> & { id: string }, needRealTime) => {
    if (needRealTime) {
      await cardCollection.updateOne(
        { id: card.id },
        { $set: card },
        { upsert: true }
      );
      return;
    }

    if (commandMap[card.id]) {
      commandMap[card.id]!.card = { ...commandMap[card.id]!.card, ...card };
      commandMap[card.id]!.saveTime = Date.now() + MIN_SAVE_INTERVAL;
    } else {
      commandMap[card.id] = {
        card,
        saveTime: Date.now() + MIN_SAVE_INTERVAL,
      };
    }

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
      if (Object.keys(commandMap).length === 0) {
        timer.clear();
      }
    }

    timer.start(handelCommand);
  };

export default CardPersistenceSaveAdapter;
