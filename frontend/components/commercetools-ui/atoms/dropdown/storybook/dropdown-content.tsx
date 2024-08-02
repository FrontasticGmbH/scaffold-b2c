import React from 'react';
import { dropdownItems } from 'helpers/mocks/mockAtomsData';
import CustomDropdownMarket from './custom-dropdown-market';
import Dropdown from '..';
import Typography from '../../typography';

const DropdownContent = () => {
  return (
    <div className="ml-44">
      <Typography className="mt-40 w-2/5 text-28 font-bold text-black">Dropdown</Typography>
      <Typography className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
        The Dropdown component allows customers to select one option from a list of options.
      </Typography>

      <div className="mt-40 w-2/5">
        <Dropdown items={dropdownItems} />
      </div>

      <CustomDropdownMarket />
    </div>
  );
};

export default DropdownContent;
