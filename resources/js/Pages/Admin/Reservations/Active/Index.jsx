import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useRoute } from 'ziggy-js';
import { debounce } from 'lodash';
import Pagination from '@/Components/Navigation/Pagination';
import { formatDistanceToNow, isSameDay, format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Truncate } from '@re-dev/react-truncate';
import NoResults from '@/Components/Misc/NoResults';
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline';

const Active = ({ activeReservations, filters }) => {
  const route = useRoute();
  const [search, setSearch] = useState(filters.vyhledavani || '');

  const updateFilters = (newFilters) => {
    router.get(
      route('admin.reservations.active'),
      { ...filters, ...newFilters },
      {
        preserveState: true,
        replace: true,
        preserveScroll: true,
        only: ['activeReservations', 'filters'],
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
        route('admin.reservations.active'),
        {},
        { only: ['activeReservations', 'filters'] }
      );
    }
  };

  return (
    <>
      <Head title="Probíhající rezervace" />
      <div className="container pb-2">
        <h1 className="fluid-text-4 font-bold">Probíhající rezervace</h1>

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
        {!activeReservations.data.length ? (
          <NoResults message="Nic nenalezeno" />
        ) : (
          <>
            <div className="mt-4 overflow-x-auto rounded-lg border shadow dark:border-gray-700">
              <table className="w-full">
                <thead className="bg-green-600 text-left text-xs font-medium uppercase tracking-wider text-white-50 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th></th>
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">Vybavení</th>
                    <th className="px-6 py-3">Jméno žáka</th>
                    <th className="px-6 py-3">Nutné vrátit</th>
                    <th className="px-6 py-3">Akce</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                  {activeReservations.data.map((reservation, index) => {
                    const isLate = new Date(reservation.end_date) < new Date();

                    return (
                      <tr
                        key={reservation.id}
                        className="text-gray-900 transition-colors hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800"
                      >
                        <td className={isLate ? 'bg-red-600 text-sm text-white-50' : ''}></td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {(activeReservations.current_page - 1) * activeReservations.per_page +
                            index +
                            1}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
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
                        <td
                          className={`whitespace-nowrap px-6 py-4 text-sm ${
                            isLate
                              ? 'text-red-600 dark:text-red-600'
                              : 'text-gray-900 dark:text-gray-100'
                          }`}
                        >
                          {format(new Date(reservation.end_date), 'dd.MM.yyyy')} (
                          {isSameDay(new Date(reservation.end_date), new Date())
                            ? 'dnes'
                            : formatDistanceToNow(new Date(reservation.end_date), {
                                locale: cs,
                                addSuffix: true,
                              })}
                          )
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <Link
                            href={route('admin.reservations.active.show', { id: reservation.id })}
                            label="Ukončit rezervaci"
                            title="Ukončit"
                            className="inline-flex items-center justify-center rounded-full p-2 text-green-600 transition-colors hover:bg-green-100 hover:text-green-800 dark:text-green-400 dark:hover:bg-green-900 dark:hover:text-green-300"
                          >
                            <ArrowUturnLeftIcon className="h-5 w-5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex justify-center">
              <Pagination links={activeReservations.links} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Active;
