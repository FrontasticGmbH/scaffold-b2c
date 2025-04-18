import React, { FC } from 'react';
import { Popover, PopoverButton, PopoverPanel, PopoverBackdrop } from '@headlessui/react';
import { UserIcon } from '@heroicons/react/24/outline';
import AccountDropdown from '..';

const AccountDropdownContent: FC = () => {
  return (
    <div className="ml-44">
      <p className="mt-40 w-2/5 text-28 font-bold text-black">Account Popover</p>
      <p className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
        The Account Popover displays customer account information and options in a dropdown menu. It consists of an icon
        that on click, opens a menu. The menu has a logged out and a logged in state, presenting options of login and
        register, or account related actions.
      </p>
      <div className="ml-100 mt-44 flex w-fit justify-start gap-x-50 rounded-md border-2 px-12 pt-12">
        <div className="h-40">
          <div className="w-fit">
            <Popover as="div" className="relative hidden h-fit lg:flex">
              {() => (
                <>
                  <PopoverButton title={'Popover Title'}>
                    <div className="flex w-fit whitespace-nowrap">
                      <div className="border-primary pb-8 hover:border-b-2">
                        <UserIcon className="w-28 text-gray-600" />
                      </div>
                    </div>
                  </PopoverButton>
                  <PopoverBackdrop className="fixed inset-0 z-[310] bg-gray-600 opacity-30" />
                  <PopoverPanel className="absolute -left-105 top-50 z-[310] animate-[appearDropdown_0.15s_ease-in-out] rounded-sm bg-white shadow-400">
                    <div className="absolute -top-20 left-1/2 z-10 w-31 -translate-x-1/2 overflow-hidden">
                      <div className="size-21 origin-bottom-left rotate-45 bg-white" />
                    </div>
                    <AccountDropdown loggedIn={false} />
                  </PopoverPanel>
                </>
              )}
            </Popover>
          </div>
        </div>
      </div>
      <div className="mt-44 flex w-1/2 justify-start gap-x-50">
        <div>
          <Popover className="relative shadow-300">
            <div className="z-[310] rounded-sm bg-white shadow-400">
              <AccountDropdown loggedIn />
            </div>
          </Popover>
        </div>
        <div>
          <Popover className="relative shadow-300">
            <div className="z-[310] rounded-sm bg-white shadow-400">
              <AccountDropdown loggedIn={false} />
            </div>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default AccountDropdownContent;
