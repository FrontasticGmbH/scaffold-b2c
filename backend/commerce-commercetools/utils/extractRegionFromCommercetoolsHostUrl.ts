import { URL } from 'url';

/**
 * Extracts the region and cloud provider from a commercetools API host URL.
 *
 * This function parses a URL and extracts the region component along with the cloud provider,
 * which is expected to be located between `api.` and `.commercetools.com` (or `.commercetools.cn`)
 * in the hostname. The returned string includes both the region and the cloud provider, such as "us-central1.gcp".
 * If the region and cloud provider cannot be extracted due to an invalid format or other issues,
 * an empty string is returned.
 *
 * Example:
 * ```
 * const hostURL = "https://api.us-central1.gcp.commercetools.com";
 * const region = extractRegionFromHostURL(hostURL);
 * // region === "us-central1.gcp"
 * ```
 *
 * @returns {string} The extracted region and cloud provider, or an empty string if they cannot be determined.
 *
 * @see {@link https://docs.commercetools.com/api/general-concepts#regions} for more details on commercetools regions.
 * @param hostUrl
 */
const extractRegionFromCommercetoolsHostUrl = (hostUrl: string): string => {
  try {
    if (!hostUrl) {
      return '';
    }
    const url = new URL(hostUrl);
    const hostname = url.hostname;

    const regionMatch = hostname.match(/^api\.([\w-]+\.(?:gcp|aws|azure))\.commercetools\.(com|cn)$/);
    if (regionMatch?.[1]) {
      return regionMatch[1];
    } else {
      return '';
    }
  } catch (error) {
    return '';
  }
};

export default extractRegionFromCommercetoolsHostUrl;
