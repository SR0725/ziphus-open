import type Space from "@/application/domain/model/space";

export type DeleteSpacePort = (space: Space) => Promise<void>;
