import { create } from "zustand";
import { SpaceDto, SpaceCardDTO, SpacePermissionDTO } from "@repo/shared-types";

export interface SpaceState extends SpaceDto {
  spaceCards: SpaceCardDTO[];
}

const useSpaceStore = create<SpaceState>(() => ({
  id: "",
  createdAt: "",
  updatedAt: "",
  deletedAt: null,
  belongAccountId: "",
  permission: SpacePermissionDTO.Private,
  title: "",
  layers: [],
  spaceCards: [],
}));

export default useSpaceStore;
