import { Account } from "shared/types/account";
import { SDKResponse, ServerOptions } from "@commercetools/frontend-sdk";
import {
	LoginAccountPayload,
	RegisterAccountPayload,
	ConfirmAccountPayload,
	RequestAccountConfirmationEmailPayload,
	ChangeAccountPasswordPayload,
	RequestAccountPasswordResetPayload,
	ResetAccountPasswordPayload,
	UpdateAccountPayload,
	AddAccountAddressPayload,
	UpdateAccountAddressPayload,
	RemoveAccountAddressPayload,
	SetDefaultAccountBillingAddressPayload,
	SetDefaultAccountShippingAddressPayload,
} from "../payloads/AccountPayloads";

type GetAccountActionReturn =
	| {
			loggedIn: false;
	  }
	| {
			loggedIn: true;
			account: Account;
	  };

type GetAccountAction = (options?: {
	serverOptions?: ServerOptions;
}) => Promise<SDKResponse<GetAccountActionReturn>>;

type LoginAccountAction = (
	payload: LoginAccountPayload,
	options?: { serverOptions?: ServerOptions }
) => Promise<SDKResponse<Account>>;

type LogoutAccountAction = (options?: {
	serverOptions?: ServerOptions;
}) => Promise<SDKResponse<void>>;

type RegisterAccountAction = (
	payload: RegisterAccountPayload,
	options?: { serverOptions?: ServerOptions }
) => Promise<SDKResponse<Account>>;

type ConfirmAccountAction = (
	payload: ConfirmAccountPayload,
	options?: { serverOptions?: ServerOptions }
) => Promise<SDKResponse<Account>>;

type RequestAccountConfirmationEmailAction = (
	payload: RequestAccountConfirmationEmailPayload,
	options?: { serverOptions?: ServerOptions }
) => Promise<SDKResponse<void>>;

type ChangeAccountPasswordAction = (
	payload: ChangeAccountPasswordPayload,
	options?: { serverOptions?: ServerOptions }
) => Promise<SDKResponse<Account>>;

type RequestAccountPasswordResetAction = (
	payload: RequestAccountPasswordResetPayload,
	options?: { serverOptions?: ServerOptions }
) => Promise<SDKResponse<void>>;

type ResetAccountPasswordAction = (
	payload: ResetAccountPasswordPayload,
	options?: { serverOptions?: ServerOptions }
) => Promise<SDKResponse<Account>>;

type UpdateAccountAction = (
	payload: UpdateAccountPayload,
	options?: { serverOptions?: ServerOptions }
) => Promise<SDKResponse<Account>>;

type AddAccountAddressAction = (
	payload: AddAccountAddressPayload,
	options?: { serverOptions?: ServerOptions }
) => Promise<SDKResponse<Account>>;

type UpdateAccountAddressAction = (
	payload: UpdateAccountAddressPayload,
	options?: { serverOptions?: ServerOptions }
) => Promise<SDKResponse<Account>>;

type RemoveAccountAddressAction = (
	payload: RemoveAccountAddressPayload,
	options?: { serverOptions?: ServerOptions }
) => Promise<SDKResponse<Account>>;

type SetDefaultAccountBillingAddressAction = (
	payload: SetDefaultAccountBillingAddressPayload,
	options?: { serverOptions?: ServerOptions }
) => Promise<SDKResponse<Account>>;

type SetDefaultAccountShippingAddressAction = (
	payload: SetDefaultAccountShippingAddressPayload,
	options?: { serverOptions?: ServerOptions }
) => Promise<SDKResponse<Account>>;

export {
	type GetAccountActionReturn,
	type GetAccountAction,
	type LoginAccountAction,
	type LogoutAccountAction,
	type RegisterAccountAction,
	type ConfirmAccountAction,
	type RequestAccountConfirmationEmailAction,
	type ChangeAccountPasswordAction,
	type RequestAccountPasswordResetAction,
	type ResetAccountPasswordAction,
	type UpdateAccountAction,
	type AddAccountAddressAction,
	type UpdateAccountAddressAction,
	type RemoveAccountAddressAction,
	type SetDefaultAccountBillingAddressAction,
	type SetDefaultAccountShippingAddressAction,
};
