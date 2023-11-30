export type EffectType = 'acceptCoupon' | 'rejectCoupon' | 'rollbackCoupon';

export interface BaseEffect {
  campaignId: number;
  rulesetId: number;
  ruleIndex: number;
  ruleName: string;
}

export interface AcceptCouponEffect extends BaseEffect {
  effectType: 'acceptCoupon';
  props: {
    value: string;
  };
}

export interface RejectCouponEffect extends BaseEffect {
  effectType: 'rejectCoupon';
  props: {
    value: string;
    rejectionReason: string;
  };
}

export interface SetDiscountEffect extends BaseEffect {
  effectType: 'setDiscount';
  props: {
    name: string;
    value: number;
    scope?: 'sessionTotal' | 'cartItems' | 'additionalCosts';
    desiredValue?: number;
  };
}

export interface SetDiscountPerItemEffect extends BaseEffect {
  effectType: 'setDiscountPerItem';
  props: {
    name: string;
    value: number;
    position?: number;
    subPosition?: number;
    desiredValue?: number;
    totalDiscount: number;
    desiredTotalDiscount?: number;
    scope: 'price' | 'additionalCosts' | 'itemTotal';
    bundleIndex?: number;
    bundleName?: number;
  };
}

export interface AddFreeItemEffect extends BaseEffect {
  effectType: 'addFreeItem';
  props: {
    name: string;
    sku: string;
  };
}

export interface SetDiscountPerAdditionalCostEffect {
  effectType: 'setDiscountPerAdditionalCost';
  props: {
    name: string;
    additionalCostId: number;
    additionalCost: string;
    value: 2.5;
    desiredValue?: number;
  };
}

export interface AwardGiveawayEffect {
  effectType: 'awardGiveaway';
  props: {
    poolId: number;
    poolName: string;
    recipientIntegrationId: string;
    giveawayId: number;
    code: string;
  };
}

export interface AcceptReferralEffect {
  effectType: 'acceptReferral';
  props: {
    value: string;
  };
}

export interface RejectReferralEffect {
  effectType: 'rejectReferral';
  props: {
    value: string;
    rejectionReason: string;
  };
}

export type Effect =
  | AcceptCouponEffect
  | RejectCouponEffect
  | SetDiscountEffect
  | SetDiscountPerItemEffect
  | AddFreeItemEffect
  | SetDiscountPerAdditionalCostEffect
  | AwardGiveawayEffect
  | AcceptReferralEffect
  | RejectReferralEffect;
