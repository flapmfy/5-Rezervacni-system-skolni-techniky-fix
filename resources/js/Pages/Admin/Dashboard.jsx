import { Head, usePage, Link, router } from '@inertiajs/react';
import { useRoute } from 'ziggy-js';
import { truncate } from 'lodash';
import ChartComponent from '@/Components/Libraries/ReservationsChart';
import {
  ArrowPathIcon,
  CheckBadgeIcon,
  ClockIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline';

const Dashboard = ({ popularEquipment, chartData }) => {
  const route = useRoute();
  const {
    auth,
    activeReservationsCount,
    acceptedReservationsCount,
    archivedReservationsCount,
    waitingReservationsCount,
  } = usePage().props;

  const onDaysChange = (e) => {
    const days = e.target.value;
    router.get(
      route('admin.dashboard'),
      { days },
      { only: ['chartData'], preserveScroll: true, preserveState: true }
    );
  };

  return (
    <div className="container">
      <Head title="Dashboard" />
      <h1 className="fluid-text-3 mt-8 border-b border-gray-400 py-4 font-medium dark:border-gray-700">
        Vítáme uživatele <span className="text-nowrap">{auth.user.name}</span>
      </h1>

      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Link
          href={route('admin.reservations.active')}
          className="flex items-center gap-4 rounded-lg border border-gray-300 p-4 shadow transition-colors hover:bg-gray-100 dark:border-none dark:bg-gray-800 dark:hover:bg-gray-900"
        >
          <ArrowPathIcon className="size-14 text-green-500" />
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Probíhající</p>
            <p className="fluid-text-4 font-bold">{activeReservationsCount}</p>
          </div>
        </Link>

        <Link
          href={route('admin.reservations.accepted')}
          className="flex items-center gap-4 rounded-lg border border-gray-300 p-4 shadow transition-colors hover:bg-gray-100 dark:border-none dark:bg-gray-800 dark:hover:bg-gray-900"
        >
          <CheckBadgeIcon className="size-14 text-yellow-400" />
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Schválené</p>
            <p className="fluid-text-4 font-bold">{acceptedReservationsCount}</p>
          </div>
        </Link>

        <Link
          href={route('admin.reservations.waiting')}
          className="flex items-center gap-4 rounded-lg border border-gray-300 p-4 shadow transition-colors hover:bg-gray-100 dark:border-none dark:bg-gray-800 dark:hover:bg-gray-900"
        >
          <ClockIcon className="size-14 text-orange-400" />
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Čekající</p>
            <p className="fluid-text-4 font-bold">{waitingReservationsCount}</p>
          </div>
        </Link>

        <Link
          href={route('admin.reservations.archived')}
          className="flex items-center gap-4 rounded-lg border border-gray-300 p-4 shadow transition-colors hover:bg-gray-100 dark:border-none dark:bg-gray-800 dark:hover:bg-gray-900"
        >
          <ArchiveBoxIcon className="size-14 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Historie</p>
            <p className="fluid-text-4 font-bold">{archivedReservationsCount}</p>
          </div>
        </Link>
      </div>

      <section className="mt-6 overflow-hidden rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex flex-col items-center justify-between gap-1 md:flex-row">
          <h2 className="fluid-text-2 px-6 py-2 font-medium dark:border-gray-600">
            Nové rezervace
          </h2>
          <div className="flex items-center gap-2 px-6 py-2">
            <span>za poslední</span>
            <label className="sr-only" htmlFor="chart-range">
              rozsah grafu
            </label>
            <select
              onChange={onDaysChange}
              className="block rounded border border-gray-200 bg-gray-50 p-2 text-gray-900 shadow focus:border-green-500 focus:ring-green-500 disabled:cursor-not-allowed disabled:select-none disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 disabled:dark:bg-gray-700 disabled:dark:text-gray-400"
              defaultValue={7}
              name="chart-range"
            >
              <option value="7">týden</option>
              <option value="30">měsíc</option>
              <option value="365">rok</option>
            </select>
          </div>
        </div>
        <ChartComponent data={chartData} />
      </section>

      {/* popularí vybavení */}
      {popularEquipment.length > 0 && (
        <section className="mt-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 className="fluid-text-2 font-medium dark:border-gray-600">Populární vybavení</h2>
            <Link
              className="btn btn-primary"
              href={route('admin.equipment.index', { od_popularnich: true })}
            >
              Zobrazit žebříček
            </Link>
          </div>

          <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-3">
            {popularEquipment[0] && (
              <Link
                className="group"
                href={route('admin.equipment.edit', popularEquipment[0].slug)}
              >
                <div className="transition-transform group-hover:translate-y-[-10px]">
                  <div className="relative h-48">
                    <div className="absolute right-2 top-2 z-10 flex size-12 items-center justify-center rounded-full bg-yellow-400 px-2 py-1 text-lg text-white-50">
                      1
                    </div>
                    <img
                      className="h-full w-full rounded-lg object-cover group-hover:shadow-md"
                      src={popularEquipment[0].image_path || '/images/no-image.jpg'}
                      alt={popularEquipment[0].name}
                    />
                  </div>
                  <p className="mb-4 text-center text-sm">
                    {truncate(popularEquipment[0].name, 20)}
                  </p>
                </div>
                <div className="hidden min-h-[300px] flex-col items-center justify-center rounded-t bg-black-400 p-4 text-white-50 transition-colors group-hover:bg-black-800 sm:flex dark:bg-gray-700 dark:group-hover:bg-gray-800">
                  <p className="fluid-text-4">{popularEquipment[0].reservations_count}</p>
                  <p>Počet rezervací</p>
                </div>
              </Link>
            )}

            {popularEquipment[1] && (
              <Link
                className="group"
                href={route('admin.equipment.edit', popularEquipment[1].slug)}
              >
                <div className="transition-transform group-hover:translate-y-[-10px]">
                  <div className="relative h-48">
                    <div className="absolute right-2 top-2 z-10 flex size-12 items-center justify-center rounded-full bg-gray-500 px-2 py-1 text-lg text-white-50">
                      2
                    </div>
                    <img
                      className="h-full w-full rounded-lg object-cover group-hover:shadow-md"
                      src={popularEquipment[1].image_path || '/images/no-image.jpg'}
                      alt={popularEquipment[1].name}
                    />
                  </div>
                  <p className="mb-4 text-center text-sm">
                    {truncate(popularEquipment[1].name, 20)}
                  </p>
                </div>
                <div className="hidden min-h-[250px] flex-col items-center justify-center rounded-t bg-black-400 p-4 text-white-50 transition-colors group-hover:bg-black-800 sm:flex dark:bg-gray-700 dark:group-hover:bg-gray-800">
                  <p className="fluid-text-4">{popularEquipment[1].reservations_count}</p>
                  <p>Počet rezervací</p>
                </div>
              </Link>
            )}

            {popularEquipment[2] && (
              <Link
                className="group order-3"
                href={route('admin.equipment.edit', popularEquipment[2].slug)}
              >
                <div className="transition-transform group-hover:translate-y-[-10px]">
                  <div className="relative h-48">
                    <div className="absolute right-2 top-2 z-10 flex size-12 items-center justify-center rounded-full bg-orange-800 px-2 py-1 text-lg text-white-50">
                      3
                    </div>
                    <img
                      className="h-full w-full rounded-lg object-cover group-hover:shadow-md"
                      src={popularEquipment[2].image_path || '/images/no-image.jpg'}
                      alt={popularEquipment[2].name}
                    />
                  </div>
                  <p className="mb-4 text-center text-sm">
                    {truncate(popularEquipment[2].name, 20)}
                  </p>
                </div>
                <div className="hidden min-h-[200px] flex-col items-center justify-center rounded-t bg-black-400 p-4 text-white-50 transition-colors group-hover:bg-black-800 sm:flex dark:bg-gray-700 dark:group-hover:bg-gray-800">
                  <p className="fluid-text-4">{popularEquipment[2].reservations_count}</p>
                  <p>Počet rezervací</p>
                </div>
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
