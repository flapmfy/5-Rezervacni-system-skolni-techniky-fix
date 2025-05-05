import { Link } from '@inertiajs/react';
import { useRoute } from 'ziggy-js';

const NavLink = ({ href, otherHrefs, children, classes, prefetch = false }) => {
  const route = useRoute();
  const isActive = route().current(href) || otherHrefs?.some((href) => route().current(href));

  return (
    <Link
      {...(prefetch && { prefetch: true })}
      href={route(href)}
      className={`nav-link ${classes} flex gap-2 ${isActive ? 'active' : ''}`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
