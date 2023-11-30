import { OrderState } from "shared/types/cart";

type QueryOrdersQuery = {
	limit?: number;
	cursor?: string;
	orderIds?: string[];
	orderNumbers?: string[];
	orderStates?: OrderState[];
	// sortAttributes?: any;  // TODO find accurate type and add
	query?: string;
};

export { type QueryOrdersQuery };
