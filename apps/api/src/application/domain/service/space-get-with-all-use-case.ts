import { type SpaceGetWithAllUseCaseConstructor } from "@/application/port/in/space-get-with-all-use-case";

const spaceGetWithAllUseCaseConstructor: SpaceGetWithAllUseCaseConstructor =
  (loadSpaceList) =>
  async ({ accountId }) => {
    const cards =
      (await loadSpaceList({
        belongAccountId: accountId,
      })) || [];

    return cards;
  };

export default spaceGetWithAllUseCaseConstructor;
