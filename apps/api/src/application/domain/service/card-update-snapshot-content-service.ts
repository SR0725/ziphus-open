import { type CardUpdateSnapshotContentUseCaseConstructor } from "@/application/port/in/card-update-snapshot-content-use-case";
import convertXmlToHtml from "@/common/convert-xml-to-html";
import { Document } from "@repo/y-socket-io/dist/server";

function extractCardId(input: string): string {
  const separatorIndex = input.indexOf(":");
  if (separatorIndex === -1) {
    return "";
  }
  return input.substring(separatorIndex + 1);
}

const CardUpdateSnapshotContentUseCaseConstructor: CardUpdateSnapshotContentUseCaseConstructor =
  (loadCard, saveCard, YSocketIO) => {
    YSocketIO.on("all-document-connections-closed", async (doc: Document) => {
      try {
        const cardId = extractCardId(doc.name);
        const cardFragmentXml = doc.getXmlFragment("card-content").toJSON();
        await doc.destroy();
        const cardFragmentHtml = await convertXmlToHtml(cardFragmentXml);
        const card = await loadCard({
          id: cardId,
        });
        if (!card) {
          console.error("Card not found");
          return;
        }
        const cardTitle = cardFragmentHtml.match(/<h1>(.*?)<\/h1>/)?.[1] || "";
        saveCard(
          {
            id: cardId,
            title: card.title || cardTitle,
            snapshotContent: cardFragmentHtml,
          },
          true
        );
      } catch (e) {}
    });
  };

export default CardUpdateSnapshotContentUseCaseConstructor;
