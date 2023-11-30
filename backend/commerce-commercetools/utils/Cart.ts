import { Cart } from '@Types/cart/Cart';

export const hasUser = (cart: Cart): boolean => {
  return cart.email !== undefined;
};

export const hasShippingAddress = (cart: Cart): boolean => {
  return (
    cart.shippingAddress !== undefined &&
    cart.shippingAddress.firstName !== undefined &&
    cart.shippingAddress.lastName !== undefined &&
    cart.shippingAddress.postalCode !== undefined &&
    cart.shippingAddress.city !== undefined &&
    cart.shippingAddress.country !== undefined
  );
};

export const hasBillingAddress = (cart: Cart): boolean => {
  return (
    cart.billingAddress !== undefined &&
    cart.billingAddress.firstName !== undefined &&
    cart.billingAddress.lastName !== undefined &&
    cart.billingAddress.postalCode !== undefined &&
    cart.billingAddress.city !== undefined &&
    cart.billingAddress.country !== undefined
  );
};

export const hasAddresses = (cart: Cart): boolean => {
  return hasShippingAddress(cart) && hasBillingAddress(cart);
};

export const isReadyForCheckout = (cart: Cart): boolean => {
  return hasUser(cart) && hasAddresses(cart);
};
