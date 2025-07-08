# B2C Launchpad

A Store Launchpad for B2C Retail built with commercetools Frontend and Composable Commerce, designed according to digital commerce UX and UI best practices.

## Overview

This B2C Launchpad is a commercetools Frontend template for creating B2C commerce websites. It consists of Frontend components, extensions, and types that leverage features and functionalities from [commercetools Composable Commerce](https://docs.commercetools.com/docs/composable-commerce) and [commercetools Frontend](https://docs.commercetools.com/docs/frontend).

**Key Technologies:**
- **Frontend**: Node.js 24 with Next.js 15 and React 19
- **Backend**: Node.js 24 with commercetools Composable Commerce integration
- **Email**: SendGrid and SMTP support for transactional emails

## Main Template Elements

The B2C Launchpad includes the following main components:

- **Homepage** with merchandising features (hero banner, categories, products, blogs)
- **Registration & Login** pages for customer account management
- **Account Pages** (profile management, orders, customer support)
- **Product Listings** and **Product Details** pages
- **Slideout Cart** and **Wishlist** functionality
- **Cart** and **Checkout** pages with payment integration
- **Navigation Menu**, **Language Selector**, **Header**, and **Footer**

## Key Features

- **Advanced Search** and product catalog management
- **Shopping cart and checkout flow** with payment integration
- **User account management and order history** with profile management
- **Wishlist functionality** with product saving
- **Multi-language support** with language selector
- **Responsive design optimized for commerce** optimized for B2C workflows
- **SEO optimization** with sitemap and robots.txt generation
- **Email campaign management** with SendGrid and SMTP support


Built with modern web technologies following commercetools best practices for scalability and performance.

## Getting Started

### Prerequisites

The following should be installed locally:

* Homebrew for macOS or Linux
* scoop for Windows
* Node.js (version 24.x)
* Yarn (version 4.4.1)

### 1. Install the CLI

The CLI is our command-line interface that you can use for development. To install the latest version of the CLI, open a command-line tool and run one of the following commands based on your operating system.

**For macOS and Linux:**
```bash
brew tap frontasticgmbh/tap && brew install frontastic-cli
```

**For Windows:**
```bash
# Add scoop bucket
scoop bucket add FrontasticGmbH_scoop-bucket https://github.com/FrontasticGmbH/scoop-bucket

# Install frontastic-cli
scoop install frontastic-cli
```

### 2. Get your API token from the Studio

To get your API token from the Studio, follow these steps:

1. From the Studio homepage, click the **Account** icon, then select **Profile**: the **User settings** dialog opens.
2. Copy the value in the **API token** field and close the dialog.
3. Save the copied value for later use.

### 3. Set up your project locally

To set up your project locally, follow these steps:

1. Clone the GitHub repository of your commercetools Frontend project on your computer.
2. Open a command-line tool and move to the root directory of your repository.
3. To initialize your project, run `frontastic init` in your command-line tool: you'll be prompted to enter the Studio user API token.
4. Enter the API token you copied from the Studio.
5. To install the necessary dependencies, run `frontastic install` in your command-line tool.
6. To start your commercetools Frontend project, run `frontastic run` in your command-line tool. Once it has finished, you can preview your website by opening `http://localhost:3000` in a web browser.

### 4. Start Development

You can now start developing your project in your favorite IDE. The project structure includes:

- **Frontend components**: Located in `frontend/src/components/`
- **Backend extensions**: Located in `backend/` with various integrations
- **Types**: Shared TypeScript definitions in `types/`

For more information, see the [official B2C Store Launchpad documentation](https://docs.commercetools.com/frontend-development/b2c-store-launchpad-overview) and [commercetools Frontend development guide](https://docs.commercetools.com/frontend-getting-started/developing-with-commercetools-frontend).
