# B2C Launchpad Backend

> :information_source: Full documentation can be found [Here](https://docs.commercetools.com/frontend-development/b2c-store-launchpad-overview)

This is a commercetools Launchpad backend project that provides a unified extension system for integrating various commerce, content, email, and promotion services.

# Getting Started With Backend Extensions:

## 1- Start the development environment

### Running locally in development mode

```
yarn install
yarn extensions:watch
```

### Building for production

```
yarn install
yarn build
```

### Running tests

```
yarn test
```

### Type checking

```
yarn ts-compile
```

### Watch mode for type checking

```
yarn ts-watch
```

## 2- Available Extensions

The backend includes several pre-built extensions:

### Commerce Extensions
- **commerce-commercetools**: commercetools platform integration

### Content Extensions
- **content-contentful**: Contentful CMS integration
- **content-amplience**: Amplience CMS integration
- **content-contentstack**: Contentstack CMS integration
- **content-bloomreach**: Bloomreach CMS integration
- **content-dynamicyield**: Dynamic Yield personalization
- **content-nosto**: Nosto personalization

### Email Extensions
- **email-smtp**: SMTP email integration
- **email-sendgrid**: SendGrid email service integration

### Promotion Extensions
- **promotion-talon-one**: Talon.One promotion engine integration

## 3- Create a new extension

### Under `/packages/backend/{{extension-name}}/`

- Create an `index.ts` with the extension structure:

```typescript
import { ExtensionRegistry } from '@frontastic/extension-types';

const extension: ExtensionRegistry = {
  'data-sources': {
    // Your data sources here
  },
  'actions': {
    'my-namespace': {
      // Your action controllers here
    }
  },
  'dynamic-page-handler': async (request, dynamicPageContext) => {
    // Your dynamic page handling logic here
    return null;
  }
};

export default extension;
```

- Create your APIs under `apis/` directory
- Create your action controllers under `actionControllers/` directory
- Create utilities under `utils/` directory
- Add mappers under `mappers/` directory if needed

## 4- Register your extension

### In the main `/packages/backend/index.ts`

Import your extension:
```typescript
import myExtension from '@My-extension';
```

Add it to the extensions array:
```typescript
const extensionsToMerge = [
  commercetoolsExtension,
  contentfulExtensions,
  // ... other extensions
  myExtension, // Add your extension here
] as Array<ExtensionRegistry>;
```

## 5- Extension Structure

Each extension typically includes:

- **APIs**: Core business logic and external service integrations
- **Action Controllers**: HTTP request handlers that use the APIs
- **Mappers**: Data transformation utilities
- **Utils**: Helper functions and utilities
- **Schemas**: TypeScript interfaces and validation schemas
- **Errors**: Custom error types

### Example Action Controller

```typescript
import { ActionContext, Request } from '@frontastic/extension-types';

export const getProduct = async (request: Request, actionContext: ActionContext) => {
  // Your action logic here
  return {
    statusCode: 200,
    body: JSON.stringify({ data: 'your response' }),
  };
};
```

## That's it! Your extension is now integrated into the backend system.

<br />
<hr />
<br />

## Testing

This project uses Jest for testing. Tests are located in the `_test/` directory.

To run tests:
```
yarn test
```

Test files should follow the naming convention: `*.test.ts`

### Example test structure:
```typescript
import { describe, test, expect } from '@jest/globals';

describe('My Extension', () => {
  test('should work correctly', () => {
    expect(true).toBe(true);
  });
});
```

## Linting

This project uses ESLint with TypeScript support and Prettier integration for code quality and formatting.

To run the linter:
```
yarn lint
```

To fix errors that can be automatically fixed:
```
yarn lint:fix
```

We recommend adding linting directly to your code editor or development environment for immediate feedback.

### Configuration files:
- `.eslintrc.json`: ESLint configuration
- `.eslintignore`: Files to ignore during linting

## Prettier / Code formatting

Prettier is integrated with the linter. When running `yarn lint:fix`, your code will be auto-formatted.

To format all TypeScript files:
```
yarn format
```

### Configuration files:
- `.prettierrc.json`: Prettier configuration
- `.prettierignore`: Files to ignore during formatting

We recommend setting up your editor to format documents on save using Prettier.

## Building

The project uses `tsup` for building. Configuration is in `tsup.config.ts`.

To build for production:
```
yarn build
```

This will create a bundled output in the `build/` directory that can be deployed to your environment. 
