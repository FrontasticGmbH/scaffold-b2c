import { ComposableCommerce, ComposableCommerceEvents } from './composable-commerce';
import { SDK } from '@commercetools/frontend-sdk';
import { getLocalizationInfo } from 'project.config';
// Add other extension's custom events to the SDK's generic type here,
// by extending ComposableCommerceEvents with their type with an
// intersection. For example <ComposableCommerceEvents & OtherEvents>.
class CommercetoolsSDK extends SDK<ComposableCommerceEvents> {
  composableCommerce!: ComposableCommerce;
  // Add your other extensions here.

  constructor() {
    super();
    this.composableCommerce = new ComposableCommerce(this);
    // Initialise your other extensions here.

    this.on('errorCaught', (event) => {
      // Globally handle any errors caught by the SDK from your
      // extensions. Log error, fire notification etc...
      console.log('SDK error: ', event.data);
    });

    // Set up any other custom global event handlers here.
    // Ensure types are created and added to the SDK generic type
    // if specific to your project.
  }

  configureForNext(nextJsLocale: string) {
    const { locale, currency } = getLocalizationInfo(nextJsLocale);

    sdk.configure({
      locale,
      currency,
      extensionVersion: process.env.NEXT_PUBLIC_EXT_BUILD_ID ?? 'dev',
      endpoint: process.env.NEXT_PUBLIC_FRONTASTIC_HOST
        ? (process.env.NEXT_PUBLIC_FRONTASTIC_HOST as string).split('/frontastic')[0]
        : '',
    });
  }
}

// Create a single instance of the sdk.
const sdk = new CommercetoolsSDK();

// Export only the instance to serve as a singleton throughout
// the project.
export { sdk };
