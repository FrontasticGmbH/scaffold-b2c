import * as React from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { Log, LogError } from 'helpers/errorLogger';
import { isDevelopment } from 'helpers/utils/environment';

const getErrorMessage = (error: LogError) => {
  if (typeof error?.data[0] === 'string') {
    return error.data[0];
  }

  if (typeof error?.data[0]?.message === 'string') {
    return error.data[0].message;
  }

  try {
    return JSON.stringify(error?.data[0]);
  } catch (e) {
    return 'Unprintable error, check console';
  }
};

export function Errors() {
  const [errors, setErrors] = React.useState(Log.getErrors());
  const [open, setOpen] = React.useState(!!Log.getErrors());

  // There is some complexity here:
  //
  // If we just append the incoming error to the state we try to update the
  // state while another componet is rendering, because the errors are appended
  // as a side effect.
  //
  // If we delay error recoding as done now using setTimeout() we will loose
  // errors happening exactly in parallel.
  //
  // If somebody has a better solution for this, please fix:
  Log.setErrorLogger((error: LogError) => {
    if (typeof window !== 'undefined') {
      window.setTimeout(() => {
        setErrors([error, ...errors].slice(0, 5));
        setOpen(true);
      }, 0);
    } else {
      setErrors([error, ...errors].slice(0, 5));
      setOpen(true);
    }
  });

  if (!errors.length || !open || !isDevelopment()) {
    return null;
  }

  return (
    <div className="relative z-10">
      <div className="fixed inset-0 z-10 overflow-y-auto bg-black/50 text-center">
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
          &#8203;
        </span>
        <div className="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Errors communicating with the API hub</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Some errors occured when communicating with the API hub. Check the sandbox logs (s) of your
                    Frontastic CLI and find the error messages either in the browser console (F12) or the last five
                    below:
                  </p>
                </div>
              </div>
            </div>
            <dl className="mt-6 space-y-6 divide-y divide-gray-200">
              {errors.map((error) => (
                <Disclosure key={error.date.getTime()}>
                  {({ open }) => (
                    <div className="pt-6">
                      <dt className="text-lg">
                        <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-400">
                          <span className="font-medium text-gray-900">
                            <strong>{error.type}:</strong> {getErrorMessage(error)}
                          </span>
                          <span className="ml-6 flex h-7 items-center">
                            <ChevronDownIcon
                              className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-6 w-6 transform')}
                              aria-hidden="true"
                            />
                          </span>
                        </Disclosure.Button>
                      </dt>
                      <Disclosure.Panel className="mt-2 pr-12">
                        <p className="whitespace-pre-wrap text-base text-gray-500">
                          {JSON.stringify(error.data, null, 2)}
                        </p>
                      </Disclosure.Panel>
                    </div>
                  )}
                </Disclosure>
              ))}
            </dl>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
