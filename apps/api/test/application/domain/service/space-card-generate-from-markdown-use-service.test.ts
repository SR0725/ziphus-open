import spaceCardGenerateFromPdfUseCaseConstructor from "@/application/domain/service/space-card-generate-with-markdown-service";
import { type SpaceCardGenerateWithMarkdownUseCaseConstructor } from "@/application/port/in/space-card-generate-with-markdown-use-case";
import type { SaveCardPort } from "@/application/port/out/save-card-port";
import { createExampleSpace } from "./create-example-data";
import { LoadSpacePort } from "@/application/port/out/load-space-port";
import { SaveSpaceCardPort } from "@/application/port/out/save-space-card-port";
import pdfExport from "@/common/pdf-export";
import markdownSplit from "@/common/markdown-split";

describe("SpaceCardGenerationFromPdfUseCase", () => {
  let spaceCardGenerateFromPdfUseCase: ReturnType<SpaceCardGenerateWithMarkdownUseCaseConstructor>;
  let loadSpace: jest.Mock<ReturnType<LoadSpacePort>>;
  let saveCard: jest.Mock<ReturnType<SaveCardPort>>;
  let saveSpaceCard: jest.Mock<ReturnType<SaveSpaceCardPort>>;

  beforeEach(() => {
    loadSpace = jest.fn();
    saveCard = jest.fn();
    saveSpaceCard = jest.fn();
    spaceCardGenerateFromPdfUseCase =
      spaceCardGenerateFromPdfUseCaseConstructor(
        loadSpace,
        saveCard,
        saveSpaceCard
      );
  });

  it(`
    Given Frontend Developer Book PDF
    When generate cards
    Then it should generate cards
  `, async () => {
    const exampleAccountId = "example-account-id";
    const examplePdfFilePath = "./test/application/domain/service/startup.pdf";
    const exampleSpace = createExampleSpace(exampleAccountId);
    loadSpace.mockResolvedValue(exampleSpace);
    const pagesMd = await pdfExport(examplePdfFilePath);
    const cleanedPagesMd = markdownSplit(pagesMd);
    const spaceCards = await spaceCardGenerateFromPdfUseCase({
      accountId: exampleAccountId,
      spaceId: exampleSpace.id,
      markdown: cleanedPagesMd,
    });

    expect(spaceCards).toHaveLength(pagesMd.length);
    expect(saveCard).toHaveBeenCalledTimes(pagesMd.length);
    expect(saveSpaceCard).toHaveBeenCalledTimes(pagesMd.length);
  });
});
