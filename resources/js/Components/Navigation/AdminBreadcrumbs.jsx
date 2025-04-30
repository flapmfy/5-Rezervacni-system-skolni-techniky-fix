import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';
import { useRoute } from 'ziggy-js';
import React from 'react';

const Breadcrumbs = ({ links }) => {
  const route = useRoute();

  if (!links || links.length === 0) {
    return null;
  }

  return (
    <nav className="mb-2 flex flex-wrap items-center gap-1 text-sm text-gray-600 dark:text-gray-500">
      <Link
        href={route('admin.dashboard')}
        aria-label="Domovská stránka"
        className="flex items-center transition-colors hover:text-gray-900 dark:hover:text-gray-200"
      >
        <HomeIcon className="size-4" />
      </Link>

      {links.map((item, index) => (
        <div className="flex items-center gap-1" key={index}>
          <ChevronRightIcon className="size-4 text-gray-400 dark:text-gray-300" />

          {index === links.length - 1 || !item.href ? (
            <span className="select-none font-medium text-green-600">{item.label}</span>
          ) : (
            <Link
              href={route(item.href)}
              className="text-nowrap transition-colors hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-200"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
