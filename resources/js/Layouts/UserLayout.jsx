import FlashMessages from '@/Components/FlashMessages';
import { useState, useEffect } from 'react';
import { useRoute } from 'ziggy-js';
import { Link, usePage } from '@inertiajs/react';
import NavLink from '@/Components/Navigation/NavLink';
import DropdownMenu from '@/Components/DropdownMenu';
import Logo from '@/Components/Icons/Logo';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  RectangleStackIcon,
  ArrowLeftEndOnRectangleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const BaseLayout = ({ children }) => {
  const route = useRoute();
  const { auth } = usePage().props;
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu(!showMenu);
  const closeMenu = () => setShowMenu(false);

  const primaryNavItems = [
    {
      label: 'Rezervace',
      href: 'user.reservations.active',
      otherHrefs: [
        'user.reservations.accepted',
        'user.reservations.waiting',
        'user.reservations.archived',
      ],
      icon: HomeIcon,
    },
    {
      label: 'Katalog',
      href: 'equipment.index',
      icon: RectangleStackIcon,
      prefetch: false,
    },
  ];

  useEffect(() => {
    const handleInertiaPageChange = () => {
      closeMenu();
    };

    document.addEventListener('inertia:navigate', handleInertiaPageChange);

    return () => {
      document.removeEventListener('inertia:navigate', handleInertiaPageChange);
    };
  }, []);

  return (
    <div className="layout-grid">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white-50 shadow-md dark:border-gray-900 dark:bg-gray-950 dark:shadow-none">
        <nav className="container flex items-center justify-between gap-6 py-4">
          <Link
            href={route('user.reservations.active')}
            className="group flex min-w-fit items-center gap-2 text-3xl font-bold hover:text-green-700"
          >
            <Logo className="size-8 group-hover:rotate-[360deg] group-hover:fill-green-700" />
            <span>ToolBox</span>
          </Link>

          <button className="z-50 size-12 md:hidden" aria-expanded={showMenu} onClick={toggleMenu}>
            {showMenu ? <XMarkIcon /> : <Bars3Icon />}
          </button>

          <div
            className={`bg-white-50 text-2xl opacity-100 transition-all md:text-base dark:bg-gray-950 ${
              showMenu ? 'translate-x-0 transform' : 'translate-x-full'
            } fixed inset-0 flex w-full flex-col gap-10 px-8 pt-40 md:relative md:translate-x-0 md:flex-row md:items-start md:justify-between md:gap-4 md:px-0 md:pt-0 md:text-base`}
          >
            <ul className="flex flex-col gap-3 md:flex-row md:items-start md:gap-4">
              {primaryNavItems.map((item, index) => (
                <li key={index}>
                  <NavLink href={item.href} prefetch={item?.prefetch} otherHrefs={item?.otherHrefs}>
                    <item.icon className="w-6 md:hidden" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>

            <ul className="flex flex-col gap-3 md:flex-row md:items-start md:gap-4">
              <li>
                <DropdownMenu title={`${auth.user.name}, ${auth.user.class}`}>
                  <NavLink href={'profile'}>
                    <UserIcon className="w-6" />
                    <span>Profil</span>
                  </NavLink>
                  <NavLink href={'auth.logout'}>
                    <ArrowLeftEndOnRectangleIcon className="w-6" />
                    <span>Odhlásit se</span>
                  </NavLink>
                  
                </DropdownMenu>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Obsah */}
      <main className="py-6">
        <FlashMessages />
        {children}
      </main>

      <footer className="mt-8 bg-black-950 py-4 text-center text-white-50">
        <div className="container flex flex-col items-center gap-2">
          <Link href={route('user.manual')} className="link">
            Návod k použití
          </Link>
          <p className="text-sm text-gray-300">© {new Date().getFullYear()} VOŠ a SPŠE Plzeň</p>
        </div>
      </footer>
    </div>
  );
};

export default BaseLayout;
