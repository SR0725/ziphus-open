import type { SpaceCard } from "@/application/domain/model/space";
import type Card from "@/application/domain/model/card";

export default interface SpaceCardCombineTargetCard extends SpaceCard {
  card: Card | null;
};;;;;;;;;;
