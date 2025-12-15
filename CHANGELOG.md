# @commercetools-frontend/b2c-launchpad

## 1.1.2

### Patch Changes

-   084fe54: Updated the versions of react and react-dom packages

## 1.1.1

### Patch Changes

-   e7534e3: Bump esbuild package to fix security issue

## 1.1.0

### Minor Changes

-   dfd97ff: Implement Locale type for defaultLocale and improve Localization handling to support language and language+country

### Patch Changes

-   935bf2a: Fixed the bug with missing swatches on product listing page.
-   4ab33c5: Removing ZIP validation external service
-   e54a1c7: Bump contentstack package to fix security vulnerability issue
-   7a2c9e1: Refactored all mapper files to use `LocalizedValue.getLocalizedValue()` instead of directly accessing `[locale.language]`. This ensures proper fallback to defaultLocale when translations are missing, improving localization accuracy and user experience.

## 1.0.1

### Patch Changes

-   8e6e196: Set wishlistId to session when an item is added and
    fetch wishlist from session or account when the user logs in
-   50899cf: Fix logs and bump nanoid package to fix security issue

## 1.0.0

### Major Changes

-   0181636: Initial release of a package for the B2C Launchpad
