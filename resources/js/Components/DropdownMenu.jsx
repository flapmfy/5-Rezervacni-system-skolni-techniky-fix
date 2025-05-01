import { useState, useRef, useEffect } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const DropdownMenu = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleInertiaPageChange = () => {
      setIsOpen(false);
    };

    document.addEventListener('inertia:navigate', handleInertiaPageChange);

    return () => {
      document.removeEventListener('inertia:navigate', handleInertiaPageChange);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'bg-gray-200 dark:bg-gray-800' : 'hover:text-green-600'} flex w-full items-center justify-between rounded-md px-4 py-2 transition-colors md:justify-normal dark:text-white-50`}
      >
        {title}
        <ChevronRightIcon
          className={`block size-5 ${isOpen ? 'rotate-90' : 'rotate-0'} transition-all`}
        />
      </button>

      {/* Mobile dropdown (animated) */}
      <div className="md:hidden">
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96' : 'max-h-0'
          }`}
        >
          <div ref={contentRef} className="block rounded-sm dark:text-gray-400">
            <div
              role="menu"
              className="pl-4"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop dropdown (conditional rendering) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 hidden w-max origin-top-right rounded-sm bg-gray-100 shadow-lg md:block dark:bg-gray-900 dark:text-gray-400">
          <div role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
