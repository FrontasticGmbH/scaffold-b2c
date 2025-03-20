import React, { useState } from 'react';
import { useTranslations } from 'use-intl';

export interface NewsletterProps {
  headline?: string;
  description?: string;
  inputPlaceholder?: string;
  ctaLabel?: string;
  successTitle?: string;
  successMessage?: string;
  disclaimer?: string;
}

export default function Newsletter({
  headline,
  description,
  inputPlaceholder,
  ctaLabel,
  disclaimer,
  successTitle,
  successMessage,
}: NewsletterProps) {
  //i18n messages
  const translate = useTranslations();

  //messages
  const fallbackHeadline = translate('newsletter.headline-fallback');

  const fallbackDescription = translate('newsletter.description-fallback');

  const fallbackPlaceholder = translate('newsletter.placeholder-fallback');

  const fallbackCta = translate('newsletter.cta-fallback');

  const fallbackDisclaimer = translate('newsletter.disclaimer-fallback');

  const fallbackSuccessTitle = translate('newsletter.success-fallback-title');
  const fallbackSuccessMessage = translate('newsletter.success-fallback-message');

  //form data
  const [data, setData] = useState({ email: '' });
  // confirmation
  const [isConfirm, setIsConfirm] = useState(false);

  //input change handler
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  //submission handler
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //validate
    const isValid = !!data.email;
    if (!isValid) {
      return alert(translate('error.email-enter'));
    }
    //success
    //Add newsletter subscription logic here
    setIsConfirm(true);
  };

  return (
    <div className="mx-auto max-w-7xl rounded-lg bg-gray-100 px-4 py-2 sm:px-6 lg:px-0">
      {!isConfirm ? (
        <div className="relative px-6 py-3 text-neutral-700 md:px-12 md:py-6 lg:px-16 lg:py-9 xl:flex xl:items-center">
          <div className="xl:w-0 xl:flex-1">
            <h2 className="mt-2 text-center text-2xl font-bold tracking-[0.010em] md:text-left">
              {headline || fallbackHeadline}
            </h2>
            <p className="mt-3 max-w-2xl text-center text-sm md:text-left">{description || fallbackDescription}</p>
          </div>
          <div className="mt-8 sm:w-full sm:max-w-md xl:ml-8 xl:mt-0">
            <form action="#" className="mt-4 sm:mx-auto sm:flex sm:max-w-xl xl:px-4" onSubmit={onSubmit}>
              <label htmlFor="cta-email" className="sr-only">
                <>{inputPlaceholder || fallbackPlaceholder}</>
              </label>
              <input
                id="cta-email"
                name="email"
                type="email"
                className="block w-full rounded-md border border-transparent px-5 py-3 text-sm leading-5 text-gray-600 shadow-sm placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                placeholder={inputPlaceholder}
                onChange={onChange}
              />
              <div className="mt-4 sm:ml-3 sm:mt-0">
                <button
                  type="submit"
                  className="block w-full rounded-md px-6 py-3 text-base font-bold leading-5 text-white sm:px-11"
                >
                  <>{ctaLabel || fallbackCta}</>
                </button>
              </div>
            </form>
            <p className="mt-2 max-w-md text-left text-xs text-neutral-600 xl:px-5">
              <>{disclaimer || fallbackDisclaimer}</>
            </p>
          </div>
        </div>
      ) : (
        <div className="relative py-4">
          <div className="sm:text-center">
            <div className="flex items-center justify-center">
              <svg width="72" height="59" viewBox="0 0 72 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M56.5476 34.0136L51.6672 29.1202V21.6665C51.6672 20.9594 51.3864 20.2813 50.8864 19.7813C50.3863 19.2808 49.7078 19 49.0006 19H23.6666C22.9304 19 22.3335 19.5969 22.3335 20.3335V29.1202L17.3866 34.0538C17.2665 34.177 17.1719 34.3212 17.1067 34.4801C17.0366 34.6449 17.0004 34.8217 17 35.0002V57.6668C17 58.0204 17.1406 58.3597 17.3906 58.6097C17.6406 58.8597 17.9799 59.0003 18.3335 59.0003H55.6666C56.0201 59.0003 56.3594 58.8597 56.6094 58.6097C56.8594 58.3597 57.0001 58.0204 57.0001 57.6668V35.0002C56.9956 34.6221 56.8315 34.2631 56.5476 34.0136ZM27.6672 46.24L19.6671 54.2401V38.2399L27.6672 46.24ZM30.4806 47.1869L30.5873 47.0936L37.0008 40.693L43.3875 47.0931L52.6412 56.3335H21.3608L30.4806 47.1869ZM46.3345 46.24L54.3346 38.2399V54.2401L46.3345 46.24ZM25.0005 21.666H49.0008V39.7865H51.6674V32.8797L53.7875 34.9998L44.4539 44.3335L37.974 37.8401C37.7235 37.5874 37.3829 37.4455 37.0275 37.4455C36.6717 37.4455 36.3311 37.5874 36.0806 37.8401L29.5738 44.3335L25.0005 39.7865L25.0005 21.666ZM22.334 32.8795V37.1198L20.2138 34.9996L22.334 32.8795Z"
                  fill="#27304B"
                />
                <path
                  d="M36.8331 34.4397L43.4332 27.8396L41.5399 25.9463L39.4867 27.9995L35.8867 31.6129L33.0599 28.7861L31.1666 30.666L34.9399 34.4393C35.1904 34.6915 35.531 34.834 35.8868 34.834C36.2422 34.834 36.5831 34.6919 36.8331 34.4397Z"
                  fill="#BE4A72"
                />
                <line
                  x1="2.12132"
                  y1="16"
                  x2="8"
                  y2="21.8787"
                  stroke="#27304B"
                  strokeOpacity="0.41"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <line
                  x1="64"
                  y1="21.8787"
                  x2="69.8787"
                  y2="16"
                  stroke="#27304B"
                  strokeOpacity="0.41"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <line
                  x1="35.5"
                  y1="10.5"
                  x2="35.5"
                  y2="1.5"
                  stroke="#27304B"
                  strokeOpacity="0.41"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h2 className="mt-2 text-center text-2xl font-bold tracking-[0.010em] lg:text-3xl">
              <>{successTitle || fallbackSuccessTitle}</>
            </h2>
            <p className="mx-auto mt-1 max-w-2xl text-center text-sm">
              <>{successMessage || fallbackSuccessMessage}</>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
