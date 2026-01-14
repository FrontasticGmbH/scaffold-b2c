# @commercetools-frontend/b2c-launchpad

## 2.0.1

### Patch Changes

-   63090dd: Fix routing and hydration issues after Next.js 16 upgrade

    **Fixes:**

    -   Restore usePath hook contract to maintain compatibility with existing components
    -   Add suppressHydrationWarning to HeadlessUI components to fix React 19 hydration warnings
    -   Add next-env.d.ts to .prettierignore to prevent auto-formatting conflicts

## 2.0.0

### Major Changes

-   f3d4439: Upgrade B2C frontend to Next.js 16 with React 19 and next-intl v4

    **Major Changes:**

    -   Upgraded Next.js from 15.2.6 to 16.0.7 with Turbopack support
    -   Upgraded React from 19.2.1 to 19.2.3
    -   Upgraded next-intl from 3.26.5 to 4.0.0
    -   Upgraded Storybook from 8.x to 10.1.2
    -   Upgraded react-icons from 4.12.0 to 5.4.0 for React 19 compatibility

    **Breaking Changes:**

    -   Replaced `next-client-cookies` with `js-cookie` (Next.js 16 incompatibility)
    -   Removed `CookiesProvider` from layout (no longer needed)
    -   Updated ESLint configuration to support flat config format
    -   Excluded Storybook and Jest files from TypeScript build

    **Improvements:**

    -   Build now works with Turbopack (Next.js 16's default bundler)
    -   All 154 tests passing with comprehensive next-intl mocks
    -   Fixed CSS import ordering for Turbopack compatibility
    -   Updated TypeScript configuration to exclude test and mock files

### Patch Changes

-   91be3f5: Axios security vulnerability fixed

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
