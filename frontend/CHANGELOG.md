## Version 4.6.0 (2025-06-24)

** New Features & Improvements **

- implementation for out of stock items scenarios
- adding validation message for invalid addresses in checkout
- fix how colors are formatted in B2C
- modify code for new color-data
- Seo information for dynamic pages

** Bug Fixes **

- seo meta info bug
- fixing infinite loop in checkout
- type issues for storybook
- Checkout handle out of stock items scenario
- Filter out inactive shipping methods from display

## Version 4.5.0 (2025-06-09)

** New Features & Improvements **

- Upgrade Node to version 24
- Improved storybook config

** Bug Fixes **

- Fix price filter
- Refactor AddressForm to use react-hook-form for form handling
- Address rendering with improved callback formatting
- Refactor imports in shipping-section and address-form components

## Version 4.4.0 (2025-05-27)

** New Features & Improvements **

- Update translations
- B2C React Hook Form changes
- Fix shipping accessibility
- Fix accessibility warnings
- Implement feedback on address forms
- Rework shipping methods in PDP
- Improve empty state for addresses section
- Allow deletion for single default addresses
- Add react hook form to Discount Form
- Add React Hook Form changes to B2C
- Add React Hook Form to the RangeFacet component
- Add default values to CreateAddressModal
- Modify AddressForm implementation
- Add React Hook Form to the RangeFacet component
- Remove deprecated Input props
- Adapt auth forms to Input component changes
- Refactor Input component
- Add react hook form

** Bug Fixes **

- Width for default address badge
- discount badge UI fix
- Use correct term key for boolean facet
- Empty billing address when selecting same shipping address in checkout
- proper link for thank you page

## Version 4.3.0 (2025-05-12)

** New Features & Improvements **

- Renamed account version field to align with common types
- UI/UX enhancement for checkout
- B2C Redesign addresses
- Update e2e tests to support locales and add DE locale test to checkout
- Add toggle for saved addresses func.
- Add category banner component to B2C

** Bug Fixes **

- Replace hardcoded shipping method description with value from MC
- Fix border radius for banner component

## Version 4.2.0 (2025-04-15)

** New Features & Improvements **

- Enhance regex used for email fields verification
- Implement feedback messages
- Introduce React Hook Form`

** Bug Fixes **

- Fix overlay layering issue
- Fix alt text set in studio not taking effect

## Version 4.1.0 (2025-04-07)

** New Features & Improvements **

- Upate core dependencies (next, ts, eslint)
- Eslint, typescript, dev dependencies update
- Optimize the Hero component
- Add accessibility documentation and update Storybook configuration
- Fix for image issue in add to cart overlay
- E2E updates
- Implement product filters and update product detail page structure
- Add GTM implementation
- Update ShippingInfo structure to replace taxIncludedInPrice with taxRate, and enhance CartMapper for shipping rate handling
- Group gitignore files
- B2B end to end tests update
- Upgrade nextjs to 15.2.3

** Bug Fixes **

- Fix type issues in gmail helper
- Fix gallery LCP optimization (work in progress, testing)
- Fix e2e run commands in workflows
- Fix CI build upload paths
- Clean up prettier config
- Fix screenreader a11y
- Fix drawer a11y issues B2C

## Version 4.0.0 (2025-03-17)

** New Features & Improvements **

- adds placeholder image for image component
- removes cloudinary loader and use next-cloudinary
- removes next-pwa, cleanup, adds mc image hosts
- optimize remote images (mc) and adds quality param to studio imgs
- make QuickView accessible
- use next-intl - migration

** Bug Fixes **

- Update tests and mocks
- Fix nested interactive controls in account dropdown
- Add title for remove button on cart item component
- Add titles for variant attribute colors and sizes
- Fix incorrect list elements children
- Fix nested interactive control elements
- Update Not Found page layout and image configuration
- adjust headers order & logic
- Replace custom button with reusable Button component
- Location selector not rendering
- missing labels for a11y

## Version 3.2.1 (2025-03-04)

** New Features & Improvements **

- Refactor localiation issue in map category
- Adjust disabled button styles and refactor return statement.

** Bug Fixes **

- Update disabled button styles for improved consistency

** New Features & Improvements **

- Update translations for b2c
- Adjust disabled button styles and refactor return statement.
- Update text colors in product details breadcrumb
- Modify nested interactive element
- List keyboard navigation EAA
- Upgrade to headless ui v2
- Scaled product image in cart popup
- Unify env usage
- Update color palette
- Update ref usages

** Bug Fixes **

- Fix localization issues
- Fix accessibility broken for keyboard navigation
- Add missing aria labels for search nav
- Add missing aria labels for presonal info form
- Fix accessibility for forms and form controls
- Fix missing pdp links

## Version 3.2.0 (2025-03-03)

** New Features & Improvements **

- Update translations for b2c
- Adjust disabled button styles and refactor return statement.
- Update text colors in product details breadcrumb
- Modify nested interactive element
- List keyboard navigation EAA
- Upgrade to headless ui v2
- Scaled product image in cart popup
- Unify env usage
- Update color palette
- Update ref usages

** Bug Fixes **

- Fix localization issues
- Fix accessibility broken for keyboard navigation
- Add missing aria labels for search nav
- Add missing aria labels for presonal info form
- Fix accessibility for forms and form controls
- Fix missing pdp links

## Version 3.1.0 (2025-02-17)

** New Features & Improvements **

- Hide the link along with the icon for all screens other than md
- Fixed keyboard navigation for user account button & dropdown items
- PDP Image slider replace with scroll snapping
- Add provider to storybook
- Aligned product and cart discount types
- Improved discount code handler for B2C
- Handle product discount on product query and cart for B2C
- Implemented product discount types on frontend
- Add direct discount and rename discount to DiscountCodes B2C

** Bug Fixes **

- Adds algolia env vars explicitely to storybook
- Adapted german translations and fixed on label
- Set correct name for discount code id
- Differenciated discounted amount and value for product and cart discounts

** New Features & Improvements **

- Fixing static folder warning and deployment error
- Category page locale switching handling on frontend
- Upgrade Node JS version
- Update Storybook to v8.5.0 and add accessibility addon
- Ignore .env file frontend

** Bug Fixes **

- Nextjs15 upgraded
- Close Popover on value select
- Allow locales with region and language and multiple languages per country

## Version 3.0.0 (2025-02-03)

** New Features & Improvements **

- Fixing static folder warning and deployment error
- Category page locale switching handling on frontend
- Upgrade Node JS version
- Update Storybook to v8.5.0 and add accessibility addon
- Ignore .env file frontend

** Bug Fixes **

- Nextjs15 upgraded
- Close Popover on value select
- Allow locales with region and language and multiple languages per country

## Version 2.2.0 (2025-01-13)

** New Features & Improvements **

- Refactor selectors and random string generation.
- Improve unit test coverage.

** Bug Fixes **

- Adapted manifest and images
- Removing unused images
- Removing unused code
- Replace custom heart icon with heroicons
- Replacing flags with library allowing any country to be displayed without the need of adding additonal flags
- Fix default fraction digits for currency
- Fix register error & success feedbacks
- Timeout related issues and search UI update
- Checkout total calculations to include shipping discount

## Version 2.1.0 (2024-12-16)

** New Features & Improvements **

- PLP Sort facet redesign
- Size images properly

** Bug Fixes **

- Map and pass shipping state correctly
- Used correct attribute in product variant component
- Quantity selector disabled wrong color
- Sort widget + quantity selector mini refactor
- Consider max quantity to be added to cart
- Fix active sort not showing in plp

## Version 2.0.0 (2024-11-20)

** New Features & Improvements **

misc: Tagged release 1.19.0 for frontend
misc: Update translations bundle
feat(FP-8009): fix for showing incorrect discount amount in the cart
feat(FP-7988): handled multi level category and included categoryId and categoryRef fields
feat(FP-7696): [B2C] PDP gallery hide arrows with only 1 image product
feat(FP-7698): [B2C] Introduce quantity selector component
refactor(FP-7988): rename subcategories to descentant on category type
feat(FP-7907): Matching borders storybook with Figma reference
feat(FP-7880): included filters for product selection ids
feat(FP-7750): [B2C] Use correct order number instead of order ID
misc: Fix failing build & tests for b2c
feat(FP-7823): [B2C] Add unit tests for useClassNames
feat(FP-7822): [B2C] Add unit tests for string helpers
feat(FP-7820): [B2C] Add unit tests for errorLogger
feat(FP-7821): [B2C] Add unit tests for reference util
chore(FP-7829): [B2C] Remove unused adyen hook
feat(FP-7824): [B2C] Add unit tests for mapCosts
feat(FP-7819): [B2C] Add unit tests for currencyHelpers
feat(FP-7818): [B2C] Add unit tests for subtitle
feat(FP-7629): bug fix for cart items
feat(FP-7825): [B2C] Add useTranlations tests
feat(FP-7816,FP-7817): [B2C] Add unit tests for image loaders

** Bug Fixes **

fix(b2c): remove superfluous divs
fix(FP-7989): fix SEO values
fix(FP-7989): fix SEO values
fix(FP-7989): fix SEO values
fix(b2c): remove duplicate breadcrumb entries for current category
fix: [B2C] Adjust default value for quantity widget when out of stock
fix(FP-7336): modify text tags
fix(FP-7698): [B2C] Enhance disabled state for PDP when out of stock
fix(FP-7336): add translations
fix(FP-7336): modify cart for gift line items
fix(FP-7734): [B2C] Empty cart not showing
fix: [b2c] category page preview

## Version 2.0.0 (2024-11-20)

** New Features & Improvements **

misc: Tagged release 1.19.0 for frontend
misc: Update translations bundle
feat(FP-8009): fix for showing incorrect discount amount in the cart
feat(FP-7988): handled multi level category and included categoryId and categoryRef fields
feat(FP-7696): [B2C] PDP gallery hide arrows with only 1 image product
feat(FP-7698): [B2C] Introduce quantity selector component
refactor(FP-7988): rename subcategories to descentant on category type
feat(FP-7907): Matching borders storybook with Figma reference
feat(FP-7880): included filters for product selection ids
feat(FP-7750): [B2C] Use correct order number instead of order ID
misc: Fix failing build & tests for b2c
feat(FP-7823): [B2C] Add unit tests for useClassNames
feat(FP-7822): [B2C] Add unit tests for string helpers
feat(FP-7820): [B2C] Add unit tests for errorLogger
feat(FP-7821): [B2C] Add unit tests for reference util
chore(FP-7829): [B2C] Remove unused adyen hook
feat(FP-7824): [B2C] Add unit tests for mapCosts
feat(FP-7819): [B2C] Add unit tests for currencyHelpers
feat(FP-7818): [B2C] Add unit tests for subtitle
feat(FP-7629): bug fix for cart items
feat(FP-7825): [B2C] Add useTranlations tests
feat(FP-7816,FP-7817): [B2C] Add unit tests for image loaders

** Bug Fixes **

fix(b2c): remove superfluous divs
fix(FP-7989): fix SEO values
fix(FP-7989): fix SEO values
fix(FP-7989): fix SEO values
fix(b2c): remove duplicate breadcrumb entries for current category
fix: [B2C] Adjust default value for quantity widget when out of stock
fix(FP-7336): modify text tags
fix(FP-7698): [B2C] Enhance disabled state for PDP when out of stock
fix(FP-7336): add translations
fix(FP-7336): modify cart for gift line items
fix(FP-7734): [B2C] Empty cart not showing
fix: [b2c] category page preview

## Version 1.19.0 (2024-11-05)

** New Features and Improvements **

- Change order ID to order number on B2C
- Handled multi level category and included categoryId and categoryRef fields
- PDP gallery hide arrows with only 1 image product

** Bug fixes **

- Showing correct discount amount in the cart
- Remove superfluous divs
- Fix SEO values
- Remove duplicate breadcrumb entries for current category
- Adjust default value for quantity widget when out of stock
- Enhance disabled state for PDP when out of stock
- Introduce quantity selector component

## Version 1.18.0 (2024-10-02)

** New Features and Improvements **

- Unit tests in B2C
- Upgrades to support version Next.js version 14.2.9, React v18.3.1, Yarn4 .4.1 and Typescript version 5.5.4
- Refactored Makret Button and all consequest needed props passing accordingly
- Separated business logic from auth components

** Bug fixes **

- Login modal not closing upon login
- Fix broken auth components
- Removed remainig business logic in UI components
- Updated wishlist data prop as optional

## Version 1.17.0 (2024-08-30)

** New Features and Improvements **

- Add missing links to intro page
- Update ReadME & Add intro storybook page
- Configure Lighthouse CI in netlify.toml

** Bug fixes **

- fix: [B2C] Data injection bug
- fix: [B2C] Data injection bug

## Version 1.16.0 (2024-08-15)

** New Features and Improvements **

- Do not skip builds for empty commits
- PDP performance improvement, reduce query calls by adding skip queue parameter to product calls

## Version 1.15.0 (2024-08-01)

** New Features and Improvements **

- Added not found page to storybook
- Add molecules folder and stories per each

** Bug fixes **

- Updated image storybook src for image
- Update mock images sources
- User modal is not above search bar fix
- Use env variable in netlify.toml for ignore paths
- Upgrade prettier and re lint codebase
- Increase product and category query limits in sitemap generation.
- Update color facet in product list component
- Filters non matching variants in the product list tastic
- Update pdp image quality to large
- Update facet color mapping and product variant display logic
- Ads missing sortAttributes type for b2c orders
- Fix themes bug for b2b and b2c
- Move modal to organisms
- Remove stores links on storybook for b2b and b2c
- Add missing organisms to storybook
- Update molecules stories

## Version 1.14.0 (2024-06-28)

** New Features and Improvements **

- User is able to set theme in studio via project folder configuration
- Color filter list items translated to correct language
- New atoms, molecules and organisms added to storybook
- CT checkout translation fixes
- Checkout header size fix
- Added German translations

## Version 1.13.0 (2024-06-24)

** New Features and Improvements **

- Better error messages for discount form
- Move theme application to layout
- Updated @commercetools/frontend-sdk dependency to 1.13.1
- Update checkout
- Multiple themes support

** Bug fixes **

- Move theme application to layout
- Remove unneeded redirection on PLP
- Fix breakpoints gap between header and body
- Fix slider buggy loading
- PDP image sizes
- Truncates order uuid

## Version 1.12.1 (2024-06-06)

** New Features and Improvements **

- Improve PDP performance (LCP & CLS)
- PDP-variants-switcher-working
- Hide sales filter on PLP when there are no sale items
- Do not send email if not changed when updating account
- Update color facet border styling in product list
- Add confirmation prompt before account deletion
- Added skipQueue and customHeaderValue options to SDk integration actions
- Updated @commercetools/frontend-sdk dependency to 1.12.1
- Add error handling for account deletion

## Version 1.12.0 (2024-05-23)

** New Features and Improvements **

- Refactor variant selection in product tile
- Update brand title and URL in Storybook theme configuration
- Updated Storybook theme and added custom styles

** Bug fixes **

- Modify the classname for shipping methods missing border

## Version 1.11.6 (2024-05-16)

- Removed addresses section from account
- Updated @commercetools/frontend-sdk package to 1.12.0
- Fix server sdk calls cache not working

## Version 1.11.5 (2024-05-09)

** New Features and Improvements **

- Update path correction in middleware
- Add new 'textToColor' helper and integrate into components
- Add more info logs in development mode
- Add missing tastics warning in development mode
- Updated @commercetools/frontend-sdk dependency to version 1.11.2
- Enhance robots and sitemaps automated
- Log frontastic request ID to browser console

## Version 1.11.4 (2024-04-26)

** New Feaures and Improvements **

- API Request Id is logged in windows console
- Search overlay fixed when side panel is open

## Version 1.11.3 (2024-04-19)

** New Features and Improvements **

- Upgraded checkout version

## Version 1.11.2 (2024-04-17)

** New Features and Improvements **

- Upgraded to latest checkout

## Version 1.11.1 (2024-04-16)

** Bug fixes **

- Fixed User component styling

## Version 1.11.0 (2024-03-01)

** New Features and Improvements **

- Hardcoded payment methods were removed

** Bug fixes **

- User could not create accounts fixed
- User can change passwords without any issues
- User can edit account information without issues
- Fixed multiple broken links in pages

## Version 1.10.0 (2024-02-22)

** New Features and Improvements **

- Handle request verification & password reset errors
- Fix fetching category for preview
- Add tasticId to div element id attribute
- Added tasticId to component tastic

** Bug fixes **

- Fix broken links in my account section

## Version 1.9.0 (2023-12-18)

** New Features and Improvements **

- Changed caching strategy

** Bug fixes **

- Fix checkout expired token handler

## Version 1.8.4 (2023-12-10)

** Features and Imporvements **

- Pass `showTaxes` to ct checkout

## Version 1.8.3 (2023-12-07)

** Features and Improvements **

- Checkout style customizations

** Bug Fixes **

- Fix verify route stuck
-

## Version 1.8.1 (2023-12-07)

** Features and Improvements **

- Add leave checkout handler

## Version 1.8.0 (2023-12-07)

** Bug Fixes **

- Fix cart disappearing bug

## Version 1.7.0 (2023-12-06)

** New Features and Improvements **

- Remove adyen
- Checkout imporvements
- Remove nextjs caching from preview and enabled in production only for page

## Version 1.6.0 (2023-11-22)

** New Features and Improvements **

- Updated B2C SDK integration

** Bug fixes **

- Redirect to login fix
- Add estimated shipping to cart total

## Version 1.5.0 (2023-11-16)

** New Features and Improvements **

- Added new set of components

## Version 1.0.1 (2022-07-05)

** New Features and Improvements **

- Added similar products component and datasource

- Logged in user has popover where he can logout

- Checkout with 3 steps, commercetools + adyen integration

- You can specify theme in project folder settings and that theme will be used for your page

- PWA disabled out of the box

** Bug fixes **

- Correct locale is passed to backend via api header

- Filters display total amount of products filtered

- Reset password funcionality fixed

- Links from wishlist, cart fixed for internalization

- Order status misplaced fix

- Cart/Wishlist balloon items look similar now

- Filter sliding fixed

- Theming header icons fixed

- PDP color is displayed correctly

- Not used css removed

## Version 1.0.0 (2022-06-08)

** New Features **

- Now you can specify your theming variables in the `app.css` file, those values will be used to define tailwind styles,
  and you can use those styles in your component, we added dark mode toggle component

- Added language switcher component, you can browse website in different locales

- Product listing page now has side menu with sort and price filters

- We have more explicit error handling component

- Added ESLint rules, you can fix your code `yarn run fix`

- Added `Remember me` functionality for user

- Added breadcrumb component

- Added MWP PWA

** Bug fixes **

- All links now use Next Link component

- All images now use Next Image component

- Minor translation fixes

- Theming fixes

- Fixed storybook components

- Fixed emojis rendering in footer

- Account order history was not showing orders

** Improvements **

- Renamed `checkout-success` component to `thank-you`

- Product component is more robust in handling product model data

- Added `bundle.js`, `bundle.min.js` to gitignore

- We started using `commercetools` as key word in schemas instead of `frontastic`

## Version 1.0.0-alpha.3 (2022-04-21)

- fix: Added TypeScript ignore comment
- Adjusted spacings & fixed header menu bug on mobile
- Moved markdown to library folder
- Removed Hard Coded Colors and updated tailwind config.
- feature/FP-1862 Added missing language switcher in components and updated component schemas
- Refactored Breadcrumbs
- Added item validations in checkout
- fix: change icon of cart tastic
- fix: editorial changes to tastic schemas
- Removed Console logs.
- Corrected naming for components
- Differentiate between client and server errors
- Improved error logging
- Handled markdown alternative flow
- FP-1863 made footer responsive

## Version 1.0.0-alpha.1 (2022-04-19)

- fix: use the right library name on package.json

## Version 1.0.0-alpha (2022-04-19)

- Initial stable release
