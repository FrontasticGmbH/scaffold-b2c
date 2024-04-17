import { Address } from "shared/types/account";

type AddCartItemPayload = {
	variant: {
		sku: string;
		count: number;
	};
};

type RemoveCartItemPayload = {
	lineItem: {
		id: string;
	};
};

type UpdateCartItemPayload = {
	lineItem: {
		id: string;
		count: number;
	};
};

type UpdateCartPayload = {
	account?: {
		email: string;
	};
	shipping?: Address;
	billing?: Address;
};

type GetCartShippingMethodsPayload = {
	query: {
		onlyMatching: boolean;
	};
};

type SetCartShippingMethodPayload = {
	shippingMethod: {
		id: string;
	};
};

type RedeemDiscountCodePayload = {
	code: string;
};

type RemoveDiscountCodePayload = {
	discountId: string;
};

type CheckoutCartPayload = {
    purchaseOrderNumber?: string;
};

export {
	type AddCartItemPayload,
	type RemoveCartItemPayload,
	type UpdateCartItemPayload,
	type UpdateCartPayload,
	type GetCartShippingMethodsPayload,
	type SetCartShippingMethodPayload,
	type RedeemDiscountCodePayload,
	type RemoveDiscountCodePayload,
	type CheckoutCartPayload,
};
