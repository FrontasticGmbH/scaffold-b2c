
## Version 1.15.0 (2025-05-12)

** New Features & Improvements **

- Moved all usages of account to accountId
- Added target to the discount

## Version 1.14.1 (2025-04-15)


** Bug Fixes **

* Add more fields to LineItem type

## Version 1.14.0 (2025-04-07)

** New Features & Improvements **

* Implement product filters and update product detail page structure
* In B2C update ShippingInfo structure to replace taxIncludedInPrice with taxRate, and enhance CartMapper for shipping rate handling

## Version 1.13.0 (2025-03-17)

** New Features & Improvements **

* Added metadata fields for product and categories

## Version 1.12.0 (2025-02-17)


** New Features & Improvements **

* Add priceCustomerGroup to product search query
* Added support for free shipping method above amount
* Aligned product and cart discount types
* Clean up types and comments B2B backend
* Improved discount code handler for B2C
* Added support for buy and get + shipping discounts on B2C
* Added method to handle localized currencies and cleanup
* Handled cart discount for whole cart and line items
* Handle product discount on product query and cart for B2C
* Implemented product discount types on frontend
* Add discount types to B2C
* Introduce product discounts inside b2c
* Add discountOnTotalPrice on B2C Cart
* Add direct discount and rename discount to DiscountCodes B2C


** Bug Fixes **

* Set correct name for discount code id
* Differenciated discounted amount and value for product and cart discounts

## Version 1.11.0 (2025-02-03)


** New Features & Improvements **

* handle slug in url for a given locale
* map customer groups in b2c

## Version 1.10.0 (2024-11-05)

** New Features and Improvements **

- Handled multi level category and included categoryId and categoryRef fields 
- Included filters for product selection id
- Added api method and mappers for new search

** Bug fixes **

- Moved child categories only if parent exist and refactor descentants

## Version 1.9.0 (2024-10-02)

** New Features and Improvements **

- Add region to project type

## Version 1.8 (2024-08-30)

## Version 1.7.0 (2024-08-01)

** New Features and Improvements **

- isMatchingaVariant is optional property
- Added product id key and ref to product types, mappers

## Version 1.6.0 (2024-06-28)

## Version 1.5.2 (2024-06-06)

## Version 1.5.1 (2024-05-09)

## Version 1.5.0 (2024-04-22)

** New Features and Improvements **

- Added default store types

## Version 1.5.0 (2024-04-22)

** New Features and Improvements **

- Added select store types

## Version 1.4.0 (2024-02-22)

** New Features and Improvements **

- Refactor product mapper to use a helper method
- Add discount details for b2c

## Version 1.3.0 (2023-09-27)

** New Features and Improvements **

- Added type to export
- Added index files for domain types
- Removed unused methods for shipping
- Added human readable facet label

## Version 1.2.0 (2023-08-29)

** New Features and Improvements **

- Added discounts to shipping info
- Return human readable facet label

## Version 1.1.0 (2023-02-03)

** New Features and Improvements **

- Added Token type

# Version 1.0.1 (2022-07-20)

** New Features and Improvements **

- Initial stable release

## Version 1.0.0 (2022-07-20)

* misc: Tagged release 1.0.0 for types
