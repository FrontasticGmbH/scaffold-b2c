'use client';

import { useAccount } from 'frontastic';

function AccountTestTastic() {
  const {
    loggedIn,
    account,
    login,
    logout,
    register,
    confirm,
    changePassword,
    requestPasswordReset,
    resetPassword,
    update,
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultBillingAddress,
    setDefaultShippingAddress,
  } = useAccount();

  return (
    <div>
      <p>logged in: {loggedIn ? 'true' : 'false'}</p>
      {account && <pre>{JSON.stringify(account, null, 4)}</pre>}
      {loggedIn && (
        <>
          <button
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={logout}
          >
            Logout
          </button>
          <button
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => {
              changePassword('3e7e422b-93d1-4ed8-8dca-161dd1867ca6', '3e7e422b-93d1-4ed8-8dca-161dd1867ca6');
            }}
          >
            Change Password
          </button>
          <button
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => {
              update({
                firstName: 'Florian',
                lastName: 'Sowade',
                salutation: 'Mr.',
                birthdayYear: 1988,
                birthdayMonth: 9,
                birthdayDay: 18,
              });
            }}
          >
            Update
          </button>
          <button
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => {
              addAddress({
                firstName: 'Florian',
                lastName: 'Sowade',
                salutation: 'Mr.',
                streetName: 'Oskar-Hoffmann-Str.',
                streetNumber: '122',
                postalCode: '44789',
                city: 'Bochum',
                country: 'DE',
                isDefaultBillingAddress: true,
                isDefaultShippingAddress: true,
              });
            }}
          >
            Add Address
          </button>
          <button
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => {
              updateAddress({
                addressId: 'C6R3Tch4',
                firstName: 'Florian',
                lastName: 'Sowade',
                salutation: 'Herr',
                streetName: 'Oskar-Hoffmann-Str.',
                streetNumber: '122',
                postalCode: '44789',
                city: 'Bochum',
                country: 'DE',
                isDefaultBillingAddress: true,
                isDefaultShippingAddress: true,
              });
            }}
          >
            Update Address
          </button>
          <button
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => {
              removeAddress('WI1-AJ0T');
            }}
          >
            Remove Address
          </button>
          <button
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => {
              setDefaultBillingAddress('C6R3Tch4');
            }}
          >
            Set Default Billing Address
          </button>
          <button
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => {
              setDefaultShippingAddress('C6R3Tch4');
            }}
          >
            Set Default Shipping Address
          </button>
        </>
      )}
      {loggedIn || (
        <>
          <button
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => {
              login('0fccf729-4a81-43f6-a475-939540761786@r9e.de', '3e7e422b-93d1-4ed8-8dca-161dd1867ca6');
            }}
          >
            Login
          </button>
          <button
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={async () => {
              const account = await register({
                email: crypto.randomUUID() + '@r9e.de',
                password: '3e7e422b-93d1-4ed8-8dca-161dd1867ca6',
              });
            }}
          >
            Register
          </button>
          <button
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={async () => {
              const account = await confirm(crypto.randomUUID());
            }}
          >
            Confirm
          </button>
          <button
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={async () => {
              const token = await requestPasswordReset('0fccf729-4a81-43f6-a475-939540761786@r9e.de');
            }}
          >
            Request Password Reset
          </button>
          <button
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={async () => {
              const account = await resetPassword(
                'I_kiMJBbR6mZ0FpLLHq_kWi0eBp9yXQy9q-cx_4J',
                '3e7e422b-93d1-4ed8-8dca-161dd1867ca6',
              );
            }}
          >
            Reset Password
          </button>
        </>
      )}
    </div>
  );
}

export default AccountTestTastic;
