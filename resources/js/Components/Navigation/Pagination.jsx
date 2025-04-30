import { Link } from '@inertiajs/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const PaginationLink = ({ link, children }) => {
  const commonClasses = 'rounded-md px-3 py-1 text-base';

  if (link.url === null) {
    return (
      <span
        className={`${commonClasses} cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500`}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      preserveScroll
      preserveState
      href={link.url}
      aria-label="Tento odkaz vede na stránku {{ link.url }}"
      className={`${commonClasses} flex items-center justify-center ${
        link.active
          ? 'bg-green-600 text-white-50'
          : 'bg-white-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {children}
    </Link>
  );
};

const getLinkContent = (label) => {
  switch (label) {
    case 'pagination.previous':
      return <ChevronLeftIcon className="size-6" />;
    case 'pagination.next':
      return <ChevronRightIcon className="size-6" />;
    default:
      return <span dangerouslySetInnerHTML={{ __html: label }} />;
  }
};

const Pagination = ({ links }) => {
  if (links.length <= 3) return null;

  return (
    <div className="mt-4 flex items-center justify-center space-x-1">
      {links.map((link, key) => (
        <PaginationLink key={key} link={link}>
          {getLinkContent(link.label)}
        </PaginationLink>
      ))}
    </div>
  );
};

export default Pagination;
