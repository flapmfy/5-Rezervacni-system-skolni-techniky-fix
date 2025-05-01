import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useRoute } from 'ziggy-js';
import { debounce } from 'lodash';
import Pagination from '@/Components/Navigation/Pagination';
import { format } from 'date-fns';
import NoResults from '@/Components/Misc/NoResults';
import Toggle from '@/Components/Controls/Toggle';
import ConfirmModal from '@/Components/ConfirmModal';
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ShieldExclamationIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const Users = ({ users, filters, bannedCount }) => {
  const route = useRoute();
  const [search, setSearch] = useState(filters.vyhledavani || '');
  const [showBanned, setShowBanned] = useState(filters.zobrazit_zabanovane || false);
  const [userToBan, setUserToBan] = useState(null);
  const [banReason, setBanReason] = useState('');

  const updateFilters = (newFilters) => {
    router.get(
      route('admin.users'),
      { ...filters, ...newFilters },
      {
        preserveState: true,
        replace: true,
        preserveScroll: true,
        only: ['users', 'filters'],
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

  const handleShowBannedChange = (event) => {
    const newShowBanned = event.target.checked;
    if (newShowBanned !== filters.zobrazit_zabanovane) {
      setShowBanned(newShowBanned);
      updateFilters({ zobrazit_zabanovane: newShowBanned || {} });
    }
  };

  const handleFilterReset = () => {
    if (search || filters.vyhledavani || filters.zobrazit_zabanovane) {
      setSearch('');
      setShowBanned(false);
      router.get(
        route('admin.users'),
        {},
        { only: ['users', 'filters'] }
      );
    }
  };

  const handleBanUser = (user) => {
    setUserToBan(user);
    setBanReason('');
  };

  const handleConfirmBan = () => {
    if (userToBan && banReason) {
      router.post(
        route('admin.users.ban', userToBan.id), 
        { ban_reason: banReason },
        { 
          preserveScroll: true,
          onSuccess: () => {
            setUserToBan(null);
            setBanReason('');
          }
        }
      );
    }
  };

  const handleUnban = (userId) => {
    router.post(
      route('admin.users.unban', userId),
      {},
      { preserveScroll: true }
    );
  };

  return (
    <>
      <Head title="Přehled uživatelů" />
      
      <ConfirmModal
        isOpen={!!userToBan}
        onClose={() => setUserToBan(null)}
        onConfirm={handleConfirmBan}
        title="Zabanovat uživatele"
      >
        <div className="space-y-4">
          <p className="font-medium">
            Opravdu chcete odepřít přístup uživateli {userToBan?.first_name} {userToBan?.last_name}?
          </p>
          <div className="space-y-2">
            <label htmlFor="banReason" className="block text-sm font-medium">
              <span className="text-red-500">*</span> Důvod banování:
            </label>
            <textarea
              id="banReason"
              name="banReason"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 input"
              rows="3"
              placeholder="Zadejte důvod banování"
            />
            {banReason.error && (
              <p className="text-red-500 text-sm mt-1">
                {banReason.error}
              </p>
            )}
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Tato akce způsobí:</p>
            <ul className="list-disc space-y-2 pl-8">
              <li>Znemožnění přihlášení do systému</li>
              <li>Zrušení přístupu ke všem funkcím systému</li>
            </ul>
          </div>
        </div>
      </ConfirmModal>
      
      <div className="container pb-2">
        <h1 className="fluid-text-4 font-bold">
          Uživatelé <span className="text-gray-400">({users.data.length})</span>
        </h1>

        {/* filtrace */}
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex flex-wrap gap-4">
            <Toggle
              checked={showBanned}
              onChange={handleShowBannedChange}
              name="showBanned"
              id="showBanned"
              label={`Zobrazit zabanované (${bannedCount})`}
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <label className="sr-only" htmlFor="search">
                Vyhledat
              </label>
              <input
                onChange={handleSearchChange}
                value={search}
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
        </div>

        {/* vypis uzivatelu */}
        {!users.data.length ? (
          <NoResults message="Nikdo nenalezen" />
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
                  {users.data.map((user, index) => {
                    return (
                      <tr
                        key={user.id}
                        className={`text-gray-900 transition-colors hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800 ${
                          user.is_banned ? 'bg-red-50 dark:bg-red-900/20' : ''
                        }`}
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {(users.current_page - 1) * users.per_page +
                            index +
                            1}
                        </td>
                        <td className="max-w-[150px] whitespace-nowrap px-6 py-4 text-sm">
                          <Link
                            href={route('admin.users.show', user.id)}
                            className="font-medium text-green-600 hover:underline dark:text-green-500"
                          >
                            {user.first_name} {user.last_name} ({user.username})
                          </Link>
                        </td>
                        <td className="max-w-[150px] whitespace-nowrap px-6 py-4 text-sm">
                          {user.email}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {user.class}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <span className={`rounded-full text-white-50 px-2 py-1 ${user.role === 'student' ? 'bg-green-600' : 'bg-yellow-500'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {format(user.created_at, 'dd.MM.yyyy')}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm flex gap-2 items-center">
                          {user.role !== 'admin' && (
                            user.is_banned ? (
                              <button
                                onClick={() => handleUnban(user.id)}
                                title="Odbanovat"
                                className="inline-flex items-center justify-center rounded-full p-2 text-green-600 transition-colors hover:bg-green-100 hover:text-green-800 dark:text-green-400 dark:hover:bg-green-900 dark:hover:text-green-300"
                              >
                                <ShieldCheckIcon className="h-5 w-5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBanUser(user)}
                                title="Zabanovat"
                                className="inline-flex items-center justify-center rounded-full p-2 text-red-600 transition-colors hover:bg-red-100 hover:text-red-800 dark:text-red-400 dark:hover:bg-red-900 dark:hover:text-red-300"
                              >
                                <ShieldExclamationIcon className="h-5 w-5" />
                              </button>
                            )
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex justify-center">
              <Pagination links={users.links} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Users;
