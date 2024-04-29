import type Space from "@/application/domain/model/space";

export type LoadSpacePort = (where: Partial<Space>) => Promise<Space | null>;
