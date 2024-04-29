import { type SpaceGetByIdUseCaseConstructor } from "@/application/port/in/space-get-by-id-use-case";
import { SpacePermission } from "../model/space";

const spaceGetByIdUseCaseConstructor: SpaceGetByIdUseCaseConstructor =
  (loadSpace) =>
  async ({ spaceId, accountId }) => {
    const space = await loadSpace({
      id: spaceId,
    });
    if (!space) {
      throw new Error("Space not found");
    }
    if (
      space.permission === SpacePermission.Private &&
      space.belongAccountId !== accountId
    ) {
      throw new Error("Permission denied");
    }

    return space;
  };

export default spaceGetByIdUseCaseConstructor;
