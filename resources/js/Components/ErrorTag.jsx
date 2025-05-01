import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
const ErrorTag = ({ children }) => (
  <span className="flex items-center gap-1 text-nowrap rounded-full border border-red-700 bg-red-100 px-2 py-1 text-sm font-medium text-red-800 dark:bg-red-200">
    <ExclamationTriangleIcon className="size-4" /> {children}
  </span>
);

export default ErrorTag;
