import { AllowedHafasProfile } from 'types/HAFAS';
import type { LoyalityCard } from 'types/HAFAS/Tarif';

const DBLoyalityCards: { [key in LoyalityCard]: number } = {
  BC25First: 1,
  BC25Second: 2,
  BC50First: 3,
  BC50Second: 4,
  SHCard: 14,
  ATVorteilscard: 9,
  CHGeneral: 15,
  CHHalfWithRailplus: 10,
  CHHalfWithoutRailplus: 11,
  NLWithRailplus: 12,
  NLWithoutRailplus: 13,
  BC100First: 16,
  BC100Second: 17,
};

// TODO: Expand for other profiles, DB only for now
export default (
  loyalityCard?: LoyalityCard,
  _profile: AllowedHafasProfile = AllowedHafasProfile.DB,
): number | undefined => {
  if (!loyalityCard) return;

  return DBLoyalityCards[loyalityCard];
};
