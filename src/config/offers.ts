export const offers = {
  consultation: {
    priceKobo: 0,
    isFree: true,
  },
  package: {
    priceKobo: 9_999_900, // ₦99,999
    deliveryTargetBusinessDays: 5,
    postProjectSupportMonths: 2,
    domainSubsidyCapKobo: 1_000_000, // ₦10,000
  },
  // Backward compatibility alias for any existing imports
  onlinePresence: {
    startingPriceKobo: 9_999_900,
    deliveryTargetBusinessDays: 5,
  },
  partnerCommissionPercent: 20,
} as const;