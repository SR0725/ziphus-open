import type {
  SpaceCardImmediateUpdatePositionRequestDTO,
  Authorization,
} from "@repo/shared-types";
import type { SpaceCardUpdatePositionUseCase } from "@/application/port/in/space-card-update-position-use-case";
import type { EmitSocketPort } from "@/application/port/out/emit-socket-port";
import getAccountTokenInterfaceFromAuth from "@/common/get-account-token-interface-from-auth";
import type IoControllerInterface from "./io-controller-interface";

/**
 * 即時修改卡片位置
 */
const SpaceCardImmediateUpdatePositionUseCaseController: IoControllerInterface<
  [SpaceCardUpdatePositionUseCase, EmitSocketPort]
> = (socket, [spaceCardUpdatePosition, emitSocket]) => {
  socket.on(
    "space:card:update-position",
    async (
      data: SpaceCardImmediateUpdatePositionRequestDTO & Authorization
    ) => {
      try {
        const accountToken = getAccountTokenInterfaceFromAuth(data);
        await spaceCardUpdatePosition({
          accountId: accountToken?.accountId,
          ...data,
        });
        emitSocket({
          event: `space:card:${data.spaceCardId}:update-position`,
          data: {
            spaceCardId: data.spaceCardId,
            x: data.x,
            y: data.y,
          },
          room: data.spaceId,
          except: socket.id,
        });
      } catch (error) { }
    }
  );
};

export default SpaceCardImmediateUpdatePositionUseCaseController;
