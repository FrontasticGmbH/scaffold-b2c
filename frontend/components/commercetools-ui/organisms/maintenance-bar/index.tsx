import React, { useState } from 'react';
import { XMarkIcon as CloseIcon } from '@heroicons/react/24/solid';

export interface Props {
  maintenanceText: string;
  activateMaintenance: boolean;
}

const MaintenanceBar = ({ maintenanceText, activateMaintenance }: Props) => {
  const [visible, setIsVisible] = useState(activateMaintenance);

  if (!visible) return <></>;

  return (
    <div className="flex items-center justify-between bg-[#416BD8] p-16 text-14 text-white md:px-24 lg:px-20 lg:text-16 xl:px-48">
      <span />
      <p>{maintenanceText}</p>
      <CloseIcon className="size-24 cursor-pointer" onClick={() => setIsVisible(false)} />
    </div>
  );
};

export default MaintenanceBar;
