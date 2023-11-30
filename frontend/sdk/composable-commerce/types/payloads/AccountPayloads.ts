import { Address } from "shared/types/account";

type LoginAccountPayload = {
	email: string;
	password: string;
	remember?: boolean;
};

type RegisterAccountPayload = {
	email: string;
	password: string;
	firstName?: string;
	lastName?: string;
	salutation?: string;
	birthdayYear?: number;
	birthdayMonth?: number;
	birthdayDay?: number;
	billingAddress?: Address;
	shippingAddress?: Address;
};

type ConfirmAccountPayload = {
	token: string;
};

type RequestAccountConfirmationEmailPayload = {
	email: string;
	password: string;
};

type ChangeAccountPasswordPayload = {
	oldPassword: string;
	newPassword: string;
};

type RequestAccountPasswordResetPayload = {
	email: string;
};

type ResetAccountPasswordPayload = {
	token: string;
	newPassword: string;
};

type UpdateAccountPayload = {
	firstName?: string;
	lastName?: string;
	salutation?: string;
	birthdayYear?: number;
	birthdayMonth?: number;
	birthdayDay?: number;
};

type AddAccountAddressPayload = Omit<Address, "addressId">;

type UpdateAccountAddressPayload = Address;

type RemoveAccountAddressPayload = {
	addressId: string;
};

type SetDefaultAccountBillingAddressPayload = {
	addressId: string;
};

type SetDefaultAccountShippingAddressPayload = {
	addressId: string;
};

export {
	type LoginAccountPayload,
	type RegisterAccountPayload,
	type ConfirmAccountPayload,
	type RequestAccountConfirmationEmailPayload,
	type ChangeAccountPasswordPayload,
	type RequestAccountPasswordResetPayload,
	type ResetAccountPasswordPayload,
	type UpdateAccountPayload,
	type AddAccountAddressPayload,
	type UpdateAccountAddressPayload,
	type RemoveAccountAddressPayload,
	type SetDefaultAccountBillingAddressPayload,
	type SetDefaultAccountShippingAddressPayload,
};
