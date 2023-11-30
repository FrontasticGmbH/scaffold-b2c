# Frontastic Next.js Starter

> :information_source: Full documentation can be found [Here](https://docs.frontastic.cloud/docs)

This is a Frontastic starter project that uses Next.js

# Getting Started With Frontend:

## 1- Start the development environment

### Running locally in development mode

```
yarn install
yarn dev
```

### Building and deploying in production

```
yarn install
yarn build
yarn start
```

## 2- Create a basic component

```javascript
export default function MyComponent(props) {
  return <h1>{props.headline}</h1>;
}
```

## 3- Create a tastic for your component

### Under `/packages/frontend/frontastic/tastics/{{MyComponent}}`

- Create a `schema.json`

```json
{
  "tasticType": "my-component",
  "name": "My Component",
  "icon": "favorite",
  "category": "Content",
  "schema": [
    {
      "name": "Basic Options",
      "fields": [
        {
          "label": "Headline",
          "field": "headline",
          "type": "string",
          "required": true
        }
      ]
    }
  ]
}
```

- Create an `index.tsx`

```javascript
export default function MyComponentTastic(props) {
  return <MyComponent headline={props.data.headline} />;
}
```

You can find more about tastics [Here](https://docs.frontastic.cloud/docs/creating-a-frontastic-component)

## 4- Register your tastic

### Under `/packages/frontend/frontastic/tastics/index.tsx`

```javascript
export const tastics = {
    ...
    'my-component': MyComponentTastic
}
```

## 5- Finally upload your component to studio

![Fig.1](https://files.readme.io/37460f8-Components_on_Frontastic_studio_dashboard_staging.png)
![Fig.2](https://files.readme.io/4c30e4d-Click_add_icon_to_add_a_new_component.png)

## That's it.. Now you're all set and can start using your new component in any page you like!

<br />
<hr />
<br />

## Linting

This project uses linting rules that improve the Core Web Vitals of frontastic storefront which are also the recommended rules by Next.js.

In addition, the following
rules are included as well to get reasonable defaults:

`eslint:recommended`
`plugin:react/recommended` see [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react)
`plugin:react-hooks/recommended` see [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)

If you want more fine-grained configuration, all of the above can be configured,
deactivated and/or extended in the `.eslintrc.json` in the project root folder.

To run the linter, just run

```
yarn lint
```

To fix erros that can be automatically fixed, run

```
yarn lint --fix
```

We recommend to add linting directly to your code editor or development environment,
to get immediate feedback.

### Linting in vim

There are a variety of extensions that can add linting support to vim and Neovim.
If you're using vim, we recommend either [ALE](https://github.com/dense-analysis/ale)
or [CoC](https://github.com/neoclide/coc.nvim) and if you use Neovim you can
use the integrated Language Server Protocol to run [eslint_d](https://github.com/mantoni/eslint_d.js/) in the background.
Here's [a handy guide](https://phelipetls.github.io/posts/configuring-eslint-to-work-with-neovim-lsp/) on how to do that

### Linting in Visual Studio Code

To integrate ESLint into Visual Studio Code, you will need to install the ESLint extension for Visual Studio Code. Search for ESLint in the Extensions tab and click Install once you have located the extension.
Once ESLint is installed in Visual Studio Code, you’ll notice colorful underlining in your JS/TS files highlighting errors. These markers are color-coded based on severity. If you hover over your underlined code, you will see a message that explains the error to you.

## Prettier / Code formatting

We also recommend to setup your editor to use prettier to format a document on save.

To prettify your code, just run

```
yarn prettify
```

### Prettier in vim

### Prettier in Visual Studio Code

## Full code formatting

To run linter with `--fix` flag and also prettify your code, you can run

```
yarn fix
```

This is typically equivalent to running `yarn lint --fix` and `yarn prettify` 
