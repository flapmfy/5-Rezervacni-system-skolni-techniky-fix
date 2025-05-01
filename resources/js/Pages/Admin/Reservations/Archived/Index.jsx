import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useRoute } from 'ziggy-js';
import { debounce } from 'lodash';
import Pagination from '@/Components/Navigation/Pagination';
import { format } from 'date-fns';
import { Truncate } from '@re-dev/react-truncate';
import { cs } from 'date-fns/locale';
import NoResults from '@/Components/Misc/NoResults';
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const Archived = ({ archivedReservations, filters }) => {
  const route = useRoute();
  const [search, setSearch] = useState(filters.vyhledavani || '');

  const updateFilters = (newFilters) => {
    router.get(
      route('admin.reservations.archived'),
      { ...filters, ...newFilters },
      {
        preserveState: true,
        replace: true,
        preserveScroll: true,
        only: ['archivedReservations', 'filters'],
      }
    );
  };

  // vyhledavani zacne az po ubehnuti 200ms
  const debouncedSearch = debounce((value) => {
    updateFilters({ vyhledavani: value || {} });
  }, 200);

  const handleSearchChange = (event) => {
    const newSearch = event.target.value;
    if (newSearch !== filters.vyhledavani) {
      setSearch(newSearch);
      debouncedSearch(newSearch);
    }
  };

  const handleFilterReset = () => {
    if (search || filters.vyhledavani) {
      setSearch('');
      router.get(
        route('admin.reservations.archived'),
        {},
        { only: ['archivedReservations', 'filters'] }
      );
    }
  };

  return (
    <>
      <Head title="Neschválené žádosti" />
      <div className="container pb-2">
        <h1 className="fluid-text-4 font-bold">Archiv rezervací</h1>

        {/* filtrace */}
        <div className="mt-4 flex items-center gap-4">
          <div className="relative flex-1">
            <label className="sr-only" htmlFor="search">
              Vyhledat
            </label>
            <input
              onChange={handleSearchChange}
              className="w-full min-w-0 rounded-md border border-gray-200 p-2 shadow hover:bg-gray-100 focus:outline-1 dark:border-gray-700 dark:bg-slate-800 dark:hover:bg-slate-700"
              type="text"
              name="search"
              placeholder="Vyhledat"
              id="search"
              autoComplete="off"
            />
            <div className="pointer-events-none">
              <MagnifyingGlassIcon className="absolute right-2 top-2 size-6" />
            </div>
          </div>
          <button
            aria-label="Resetovat filtry"
            name="resetFilters"
            onClick={handleFilterReset}
            className="bg-white rounded-md border border-gray-200 p-2 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <ArrowPathIcon className="size-6" />
          </button>
        </div>

        {/* vypis rezervaci */}
        {!archivedReservations.data.length ? (
          <NoResults message="Nic nenalezeno" />
        ) : (
          <>
            <div className="mt-4 overflow-x-auto rounded-lg border shadow dark:border-gray-700">
              <table className="w-full">
                <thead className="bg-green-600 text-left text-xs font-medium uppercase tracking-wider text-white-50 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">Vybavení</th>
                    <th className="px-6 py-3">Jméno žáka</th>
                    <th className="px-6 py-3">Začátek</th>
                    <th className="px-6 py-3">Konec</th>
                    <th className="px-6 py-3"></th>
                    <th className="px-6 py-3">Akce</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                  {archivedReservations.data.map((reservation, index) => {
                    return (
                      <tr
                        key={reservation.id}
                        className="text-gray-900 transition-colors hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800"
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {(archivedReservations.current_page - 1) * archivedReservations.per_page +
                            index +
                            1}
                        </td>

                        <td className="max-w-[150px] whitespace-nowrap px-6 py-4 text-sm">
                          <Link
                            className="flex items-center gap-1 hover:text-green-600 hover:underline"
                            href={route('admin.equipment.edit', {
                              slug: reservation.equipment.slug,
                            })}
                          >
                            <ArrowTopRightOnSquareIcon className="size-4" />
                            <Truncate>{reservation.equipment.name}</Truncate>
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {reservation.student.name}, {reservation.student.class}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {format(reservation.start_date, 'dd. MM. yyyy', { locale: cs })}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {format(reservation.end_date, 'dd. MM. yyyy', { locale: cs })}
                        </td>
                        <td className="whitespace-nowrap px-1 py-4 text-sm text-red-600">
                          {reservation.issues.length > 0 ? (
                            <div
                              title={`Celkem ${reservation.issues.length} problémů`}
                              className="flex items-center gap-1"
                            >
                              <ExclamationTriangleIcon className="size-5" />
                              <span>({reservation.issues.length})</span>
                            </div>
                          ) : (
                            <CheckCircleIcon
                              title="Bez problémů"
                              className="size-5 text-green-600"
                            />
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <Link
                            href={route('admin.reservations.archived.show', { id: reservation.id })}
                            title="Detail"
                            label="Zobrazit informace o rezervaci"
                            className="inline-flex items-center justify-center rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-300"
                          >
                            <InformationCircleIcon className="h-5 w-5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex justify-center">
              <Pagination links={archivedReservations.links} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Archived;
