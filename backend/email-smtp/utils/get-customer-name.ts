import { Account } from '@Types/account/Account';

const getCustomerName = (customer: Account) => {
  if (customer.firstName && customer.lastName) {
    return `${customer.firstName} ${customer.lastName}`;
  }

  if (customer.firstName) {
    return customer.firstName;
  }

  return '';
};
export default getCustomerName;
