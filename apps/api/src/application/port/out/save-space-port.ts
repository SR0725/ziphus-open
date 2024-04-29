import type Space from "@/application/domain/model/space";

export type SaveSpacePort = (space:
    Omit<Space, "spaceCards" | "childSpaces">
) => Promise<void>;
