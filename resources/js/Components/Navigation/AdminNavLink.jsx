import { Link } from '@inertiajs/react';
import { useRoute } from 'ziggy-js';

const AdminNavLink = ({ href, otherHrefs, children, classes }) => {
  const route = useRoute();
  const isActive = route().current(href) || otherHrefs?.some((href) => route().current(href));

  return (
    <Link
      href={route(href)}
      className={`nav-link ${classes} flex gap-2 ${isActive ? 'active' : ''}`}
    >
      {children}
    </Link>
  );
};

export default AdminNavLink;
