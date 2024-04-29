import { type SpaceModifyTitleUseCaseConstructor } from "@/application/port/in/space-modify-title-use-case";
import { SpacePermission } from "../model/space";

const spaceModifyTitleCaseConstructor: SpaceModifyTitleUseCaseConstructor =
  (loadSpace, saveSpace) =>
  async ({ title, spaceId, accountId }) => {
    const space = await loadSpace({
      id: spaceId,
    });
    if (!space) {
      throw new Error("space not found");
    }

    if (
      space.permission !== SpacePermission.PublicEditable &&
      space.belongAccountId !== accountId
    ) {
      throw new Error("Permission denied");
    }

    // 儲存更新後的卡片
    await saveSpace({ ...space, title });

    return true;
  };

export default spaceModifyTitleCaseConstructor;
