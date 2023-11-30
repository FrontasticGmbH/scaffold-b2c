import { Event, SDK, ServerOptions } from "@commercetools/frontend-sdk";
import {
	AddToWishlistPayload,
	RemoveFromWishlistPayload,
	UpdateWishlistItemPayload,
} from "../../types/payloads/WishlistPayloads";
import {
	AddToWishlistAction,
	GetWishlistAction,
	RemoveFromWishlistAction,
	UpdateWishlistItemAction,
} from "../../types/actions/WishlistActions";
import { Wishlist } from "shared/types/wishlist";
import { ComposableCommerceEvents } from "../../types/events/ComposableCommerceEvents";

export type WishlistActions = {
	getWishlist: GetWishlistAction;
	addItem: AddToWishlistAction;
	removeItem: RemoveFromWishlistAction;
	updateItem: UpdateWishlistItemAction;
};

export const getWishlistActions = (
	sdk: SDK<ComposableCommerceEvents>
): WishlistActions => {
	return {
		getWishlist: async (
			options: { serverOptions?: ServerOptions } = {}
		) => {
			const response = await sdk.callAction<Wishlist>({
				actionName: "wishlist/getWishlist",
				serverOptions: options.serverOptions,
			});

			if (response.isError === false) {
				sdk.trigger(
					new Event({
						eventName: "wishlistFetched",
						data: {
							wishlist: response.data,
						},
					})
				);
			}
			return response;
		},
		addItem: async (
			payload: AddToWishlistPayload,
			options: { serverOptions?: ServerOptions } = {}
		) => {
			const response = await sdk.callAction<Wishlist>({
				actionName: "wishlist/addToWishlist",
				payload,
				serverOptions: options.serverOptions,
			});

			if (response.isError === false) {
				const lineItem = response.data.lineItems?.find(
					(lineItem) => lineItem.variant?.sku === payload.variant.sku
				);
				if (lineItem) {
					sdk.trigger(
						new Event({
							eventName: "lineItemAddedToWishlist",
							data: {
								lineItem,
							},
						})
					);
				}
			}
			return response;
		},
		removeItem: async (
			payload: RemoveFromWishlistPayload,
			options: { serverOptions?: ServerOptions } = {}
		) => {
			const response = await sdk.callAction<Wishlist>({
				actionName: "wishlist/removeLineItem",
				payload,
				serverOptions: options.serverOptions,
			});

			if (
				response.isError === false &&
				!response.data.lineItems?.find(
					(item) => item.lineItemId === payload.lineItem.id
				)
			) {
				sdk.trigger(
					new Event({
						eventName: "lineItemRemovedFromWishlist",
						data: {
							lineItemId: payload.lineItem.id,
						},
					})
				);
			}
			return response;
		},
		updateItem: async (
			payload: UpdateWishlistItemPayload,
			options: { serverOptions?: ServerOptions } = {}
		) => {
			const response = await sdk.callAction<Wishlist>({
				actionName: "wishlist/updateLineItemCount",
				payload,
				serverOptions: options.serverOptions,
			});

			if (response.isError === false) {
				const lineItem = response.data.lineItems?.find(
					(item) => item.lineItemId === payload.lineItem.id
				);
				if (lineItem?.count === payload.count) {
					sdk.trigger(
						new Event({
							eventName: "wishlistLineItemUpdated",
							data: {
								lineItem: lineItem,
							},
						})
					);
				}
			}
			return response;
		},
	};
};
