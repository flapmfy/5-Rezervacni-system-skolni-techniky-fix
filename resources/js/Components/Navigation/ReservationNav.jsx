import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { useRoute } from 'ziggy-js';

const ReservationNav = () => {
  const route = useRoute();
  const {
    activeReservationsCount,
    acceptedReservationsCount,
    waitingReservationsCount,
    archivedReservationsCount,
  } = usePage().props;

  const tabs = [
    {
      id: 'active',
      label: 'Probíhající',
      count: activeReservationsCount,
      href: 'user.reservations.active',
      isActive: route().current('user.reservations.active'),
    },
    {
      id: 'accepted',
      label: 'Schválené',
      count: acceptedReservationsCount,
      href: 'user.reservations.accepted',
      isActive: route().current('user.reservations.accepted'),
    },
    {
      id: 'waiting',
      label: 'Neschválené',
      count: waitingReservationsCount,
      href: 'user.reservations.waiting',
      isActive: route().current('user.reservations.waiting'),
    },
    {
      id: 'archived',
      label: 'Historie',
      count: archivedReservationsCount,
      href: 'user.reservations.archived',
      isActive: route().current('user.reservations.archived'),
    },
  ];
  return (
    <div className="mb-6 mt-4">
      <div
        role="tablist"
        className="flex overflow-x-auto overflow-y-hidden border-b border-gray-200 dark:border-gray-400"
      >
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={route(tab.href)}
            className={`-mb-0.5 flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              tab.isActive
                ? 'border-b-4 border-green-600 text-green-600'
                : 'text-black-950 hover:text-black-900 dark:text-white-300 dark:hover:text-gray-400'
            }`}
            role="tab"
            aria-selected={tab.isActive}
            aria-controls={`${tab.id}-panel`}
          >
            <span className="py-1">{tab.label}</span>
            {tab.count && (
              <span
                className={`rounded-sm border ${tab.lateCount > 0 ? 'text-orange-600' : ''} border-gray-200 px-2 py-1 text-xs font-bold dark:border-gray-800`}
              >
                {tab.count}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ReservationNav;
