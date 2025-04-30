import { Link } from '@inertiajs/react';
import { useRoute } from 'ziggy-js';

const GenericLink = ({ href, children }) => {
  const route = useRoute();
  return (
    <Link className="text-green-600 hover:underline" href={route(href)}>
      {children}
    </Link>
  );
};

export default GenericLink;
