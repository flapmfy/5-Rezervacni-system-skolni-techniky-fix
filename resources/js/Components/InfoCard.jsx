import { useState } from 'react';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const InfoCard = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={`relative ${isOpen ? 'flex' : 'hidden'} my-6 items-start gap-2 rounded-lg border border-gray-300 bg-gray-100 px-6 py-4 shadow dark:border-gray-700 dark:bg-gray-800`}
    >
      <div>
        <InformationCircleIcon className="size-6" />
      </div>

      <div>{children}</div>

      <button
        aria-label="Zavřít"
        onClick={handleClose}
        className="absolute right-1 top-1 rounded-md p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <XMarkIcon className="size-4" />
      </button>
    </div>
  );
};

export default InfoCard;
