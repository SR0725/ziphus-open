import type Space from "@/application/domain/model/space";

export type LoadSpaceListPort = (where: Partial<Space>) => Promise<Space[] | null>;
