import { Cart, Order, ShippingMethod } from "shared/types/cart";
import { SDKResponse, ServerOptions } from "@commercetools/frontend-sdk";
import {
	AddCartItemPayload,
    CheckoutCartPayload,
	RemoveCartItemPayload,
	UpdateCartItemPayload,
	UpdateCartPayload,
	GetCartShippingMethodsPayload,
	SetCartShippingMethodPayload,
	RedeemDiscountCodePayload,
	RemoveDiscountCodePayload,
} from "../payloads/CartPayloads";
import { QueryOrdersQuery, GetOrderQuery } from "../queries/CartQueries";
import { PaginatedResult } from "shared/types/result";
import { Token } from "shared/types/Token";

type GetCartAction = (options?: {
	serverOptions?: ServerOptions;
}) => Promise<SDKResponse<Cart>>;

type AddCartItemAction = (
	payload: AddCartItemPayload,
	options?: { serverOptions?: ServerOptions }
) => Promise<SDKResponse<Cart>>;

type RemoveCartItemAction = (
	payload: RemoveCartItemPayload,
	options?: { serverOptions?: ServerOptions }
) => Promise<SDKResponse<Cart>>;

type UpdateCartItemAction = (
	payload: UpdateCartItemPayload,
	options?: { serverOptions?: ServerOptions }
) => Promise<SDKResponse<Cart>>;

type UpdateCartAction = (
	payload: UpdateCartPayload,
	options?: { serverOptions?: ServerOptions }
) => Promise<SDKResponse<Cart>>;

type GetCartShippingMethodsAction = (
	payload: GetCartShippingMethodsPayload,
	options?: { serverOptions?: ServerOptions }
) => Promise<SDKResponse<ShippingMethod[]>>;

type GetAvailableCartShippingMethodsAction = (options?: {
	serverOptions?: ServerOptions;
}) => Promise<SDKResponse<ShippingMethod[]>>;

type SetCartShippingMethodAction = (
	payload: SetCartShippingMethodPayload,
	options?: { serverOptions?: ServerOptions }
) => Promise<SDKResponse<Cart>>;

type RedeemDiscountCodeAction = (
	payload: RedeemDiscountCodePayload,
	options?: { serverOptions?: ServerOptions }
) => Promise<SDKResponse<Cart | string>>;

type RemoveDiscountCodeAction = (
	payload: RemoveDiscountCodePayload,
	options?: { serverOptions?: ServerOptions }
) => Promise<SDKResponse<Cart>>;

type CheckoutCartAction = (
    payload: CheckoutCartPayload,
    options?: { serverOptions?: ServerOptions; }
) => Promise<SDKResponse<Cart>>;

type QueryOrdersAction = (
	query?: QueryOrdersQuery,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<PaginatedResult<Order>>>;

type GetOrderAction = (
    query: GetOrderQuery,
    options?: {
        serverOptions?: ServerOptions;
    },
) => Promise<SDKResponse<Order>>;

type GetCheckoutSessionTokenAction = (options?: {
    serverOptions?: ServerOptions;
}) => Promise<SDKResponse<Token>>;

export {
	type GetCartAction,
	type AddCartItemAction,
	type RemoveCartItemAction,
	type UpdateCartItemAction,
	type UpdateCartAction,
	type GetCartShippingMethodsAction,
	type GetAvailableCartShippingMethodsAction,
	type SetCartShippingMethodAction,
	type RedeemDiscountCodeAction,
	type RemoveDiscountCodeAction,
	type CheckoutCartAction,
	type QueryOrdersAction,
    type GetOrderAction,
    type GetCheckoutSessionTokenAction,
};
