import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useRoute } from 'ziggy-js';
import { debounce } from 'lodash';
import Pagination from '@/Components/Navigation/Pagination';
import { format } from 'date-fns';
import NoResults from '@/Components/Misc/NoResults';
import ConfirmModal from '@/Components/ConfirmModal';
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

const PendingUsers = ({ pendingUsers, filters }) => {
  const route = useRoute();
  const [search, setSearch] = useState(filters.vyhledavani || '');
  const [userToDelete, setUserToDelete] = useState(null);

  const updateFilters = (newFilters) => {
    router.get(
      route('admin.users.pending'),
      { ...filters, ...newFilters },
      {
        preserveState: true,
        replace: true,
        preserveScroll: true,
        only: ['pendingUsers', 'filters'],
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
        route('admin.users.pending'),
        {},
        { only: ['pendingUsers', 'filters'] }
      );
    }
  };

  const handleApprove = (userId) => {
    router.post(
      route('admin.users.approve', { id: userId }),
      {},
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  };

  const handleDelete = (userId) => {
    setUserToDelete(userId);
  };

  const handleConfirmDelete = () => {
    router.post(
      route('admin.users.decline', { id: userToDelete }),
      {},
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
    setUserToDelete(null);
  }

  return (
    <>
      <Head title="Neschválení uživatelé" />
      <ConfirmModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Zamítnout přístup"
      >
        <div className="space-y-4">
          <p className="font-medium">Doopravdy chcete zamítnout přístup tomuto uživateli?</p>
        </div>
      </ConfirmModal>
      <div className="container pb-2">
        <h1 className="fluid-text-4 font-bold">Neschválení uživatelé</h1>

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

        {/* vypis uzivatelu */}
        {!pendingUsers.data.length ? (
          <NoResults message="Nikdo zde není" />
        ) : (
          <>
            <div className="mt-4 overflow-x-auto rounded-lg border shadow dark:border-gray-700">
              <table className="w-full">
                <thead className="bg-green-600 text-left text-xs font-medium uppercase tracking-wider text-white-50 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">Jméno a příjmení</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Třída</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Datum vytvoření</th>
                    <th className="px-6 py-3">Akce</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                  {pendingUsers.data.map((user, index) => {
                    return (
                      <tr
                        key={user.id}
                        className="text-gray-900 transition-colors hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800"
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {(pendingUsers.current_page - 1) * pendingUsers.per_page +
                            index +
                            1}
                        </td>
                        <td className="max-w-[150px] whitespace-nowrap px-6 py-4 text-sm">
                          {user.first_name} {user.last_name} ({user.username})
                        </td>
                        <td className="max-w-[150px] whitespace-nowrap px-6 py-4 text-sm">
                          {user.email}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {user.default_room}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <span className={`rounded-full text-white-50 px-2 py-1 ${user.role === 'student' ? 'bg-green-600' : 'bg-yellow-500'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {format( user.created_at, 'dd.MM.yyyy')}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm flex gap-2 items-center">
                          <button
                            onClick={() => handleApprove(user.id)}
                            title="Schválit"
                            label="Schválit"
                            className="inline-flex items-center justify-center rounded-full p-2 transition-colors hover:scale-110 hover:bg-green-100 hover:text-green-800 dark:text-green-400 dark:hover:bg-green-900 dark:hover:text-green-300"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </button>

                          <button
                            onClick={() => handleDelete(user.id)}
                            title="Odmítnout"
                            label="Odmítnout"
                            className="inline-flex items-center justify-center rounded-full p-2 transition-colors hover:scale-110 hover:bg-red-100 hover:text-red-800 dark:text-red-400 dark:hover:bg-red-900 dark:hover:text-red-300"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex justify-center">
              <Pagination links={pendingUsers.links} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PendingUsers;
