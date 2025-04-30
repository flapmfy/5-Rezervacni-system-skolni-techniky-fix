import { useState, useEffect } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import { useRoute } from 'ziggy-js';
import { truncate } from 'lodash';
import AdminNavLink from '@/Components/Navigation/AdminNavLink';
import FlashMessages from '@/Components/FlashMessages';
import Logo from '@/Components/Icons/Logo';
import {
  Bars3Icon,
  XMarkIcon,
  ArchiveBoxIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  AdjustmentsHorizontalIcon,
  ArrowLeftEndOnRectangleIcon,
  TagIcon,
  UserIcon,
  CheckBadgeIcon,
  ArrowPathRoundedSquareIcon,
  Squares2X2Icon,
  CalendarIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

const LabelWithCount = ({ label, count }) => {
  if (count > 0) {
    return (
      <div className="flex w-full items-center justify-between">
        <span>{label}</span>
        <span className="ml-1 inline-flex items-center rounded-full bg-red-200 px-2.5 py-0.5 text-xs font-medium text-red-900">
          {count}
        </span>
      </div>
    );
  }
  return label;
};

const AdminPanelLayout = ({ children }) => {
  const route = useRoute();
  const {
    acceptedReservationsCount,
    waitingReservationsCount,
    archivedReservationsCount,
    activeReservationsCount,
    auth,
  } = usePage().props;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const navItems = [
    [
      {
        type: 'link',
        label: 'Dashboard',
        href: 'admin.dashboard',
        icon: Squares2X2Icon,
        id: 'dashboard-link',
      },
      {
        type: 'link',
        label: 'Kalendář',
        href: 'admin.calendar',
        icon: CalendarIcon,
        id: 'calendar-link',
      },
    ],
    [
      {
        type: 'header',
        label: 'Rezervace',
        id: 'rezervace-header',
      },
      {
        type: 'link',
        label: <LabelWithCount label="Neschválené" count={waitingReservationsCount} />,
        href: 'admin.reservations.waiting',
        icon: ClockIcon,
        id: 'neschvalene-link',
      },
      {
        type: 'link',
        label: <LabelWithCount label="Schválené" count={acceptedReservationsCount} />,
        href: 'admin.reservations.accepted',
        icon: CheckBadgeIcon,
        id: 'schvalene-link',
      },
      {
        type: 'link',
        label: <LabelWithCount label="Probíhající" count={activeReservationsCount} />,
        href: 'admin.reservations.active',
        icon: ArrowPathRoundedSquareIcon,
        id: 'aktualni-link',
      },
      {
        type: 'link',
        label: <LabelWithCount label="Archiv" count={archivedReservationsCount} />,
        href: 'admin.reservations.archived',
        icon: ArchiveBoxIcon,
        id: 'historie-link',
      },
    ],
    [
      {
        type: 'header',
        label: 'Ostatní',
        id: 'vybaveni-header',
      },
      {
        type: 'link',
        label: 'Vybavení',
        href: 'admin.equipment.index',
        icon: WrenchScrewdriverIcon,
        id: 'vybaveni-link',
      },
      {
        type: 'link',
        label: 'Kategorie',
        href: 'admin.categories.index',
        icon: TagIcon,
        id: 'kategorie-link',
      },
      {
        type: 'link',
        label: 'Přehled akcí',
        href: 'admin.actions',
        icon: AdjustmentsHorizontalIcon,
        id: 'akce-link',
      },
      {
        type: 'link',
        label: 'Manuál',
        href: 'admin.manual',
        icon: BookOpenIcon,
        id: 'manual-link',
      },
    ],
  ];

  const handleLogout = () => {
    router.get(route('auth.logout'));
  };

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
    <div className="flex h-screen flex-col md:flex-row">
      {/* Sidebar pro široké obrazovky */}
      <aside className="z-100 hidden shadow-md md:flex md:w-64 md:flex-col dark:bg-gray-800">
        <div className="flex justify-center border-b border-black-300 py-4 text-2xl dark:border-white-900">
          <Link
            href={route('admin.dashboard')}
            className="group flex min-w-fit items-center gap-2 text-3xl font-bold hover:text-green-700"
          >
            <Logo className="size-12 group-hover:rotate-[360deg] group-hover:fill-green-700" />
            <span>Admin</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <div className="flex h-full flex-col justify-between">
            <div>
              {navItems.map((menu, menuIndex) => (
                <div className="p-3" key={`menu-${menuIndex}`}>
                  {menu.map((item) => {
                    if (item.type === 'header') {
                      return (
                        <div className="flex select-none items-center pb-1" key={item.id}>
                          <span className="text-lg font-bold">{item.label}</span>
                        </div>
                      );
                    }
                    return (
                      <AdminNavLink key={item.id} href={item.href} classes={'p-2 hover:pl-4'}>
                        <item.icon className="w-6" />
                        {item.label}
                      </AdminNavLink>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 p-3 dark:border-gray-700">
              <AdminNavLink
                href="admin.profile"
                classes="p-2 dark:hover:bg-gray-700 hover:bg-gray-100 flex items-center gap-1"
              >
                <UserIcon className="size-4" />
                {truncate(auth.user.name, { length: 17 })}
              </AdminNavLink>
              <button
                onClick={handleLogout}
                title="Odhlásit se"
                className="rounded p-2 transition-colors hover:bg-gray-100 hover:text-green-600 dark:hover:bg-gray-700"
              >
                <ArrowLeftEndOnRectangleIcon className="size-6" />
              </button>
            </div>
          </div>
        </nav>
      </aside>

      {/* Mobilní navigace */}
      <div
        className={`container ${isMobileMenuOpen ? 'bg-white-250 dark:bg-gray-800' : ''} z-50 flex items-center justify-between border-b py-4 md:hidden dark:border-black-900`}
      >
        <div className="text-white text-2xl font-bold">
          <Link
            href={route('user.reservations.active')}
            className="group flex min-w-fit items-center gap-2 text-3xl font-bold hover:text-green-700"
          >
            <Logo className="size-12 group-hover:rotate-[360deg] group-hover:fill-green-700" />
            <span>Admin</span>
          </Link>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="z-50 size-12 md:hidden"
        >
          {isMobileMenuOpen ? <XMarkIcon /> : <Bars3Icon />}
        </button>
      </div>

      {/* Mobilní menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-white-250 pt-24 md:hidden dark:bg-gray-800">
          <nav className="p-4">
            <div>
              {navItems.map((menu, menuIndex) => (
                <div className="p-3" key={`mobile-menu-${menuIndex}`}>
                  {menu.map((item) => {
                    if (item.type === 'header') {
                      return (
                        <div className="flex items-center py-2" key={item.id}>
                          <span className="text-lg font-bold">{item.label}</span>
                        </div>
                      );
                    }
                    return (
                      <AdminNavLink key={item.id} href={item.href}>
                        <item.icon className="w-6" />
                        {item.label}
                      </AdminNavLink>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 p-3 dark:border-gray-700">
              <AdminNavLink
                href="admin.profile"
                classes="p-2 dark:hover:bg-gray-700 hover:bg-gray-100 flex items-center gap-1"
              >
                <UserIcon className="size-4" />
                {truncate(auth.user.name, { length: 17 })}
              </AdminNavLink>
              <button
                onClick={handleLogout}
                aria-label="Odhlásit se"
                className="rounded p-2 transition-colors hover:bg-gray-100 hover:text-green-600 dark:hover:bg-gray-700"
              >
                <ArrowLeftEndOnRectangleIcon className="size-6" />
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Obsah */}
      <main className="flex-1 overflow-y-auto pt-2">
        <FlashMessages />
        {children}
      </main>
    </div>
  );
};

export default AdminPanelLayout;
