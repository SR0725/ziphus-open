import type Card from "@/application/domain/model/card";
import { type Image } from "@/application/domain/model/card";
import type { PushCardImagePort } from "@/application/port/out/push-card-image-port";
import type { MongoCollections } from "./mongo-db";

const CardPersistencePushImageAdapter =
  ({ cardCollection }: MongoCollections): PushCardImagePort =>
  async (card: Card, image: Image) => {
    await cardCollection.updateOne(
      { id: card.id },
      {
        $push: { images: image },
      }
    );
  };

export default CardPersistencePushImageAdapter;
