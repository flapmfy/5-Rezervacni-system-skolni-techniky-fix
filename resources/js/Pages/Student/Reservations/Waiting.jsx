import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { format, formatDistanceToNow } from 'date-fns';
import { cs } from 'date-fns/locale';
import { useRoute } from 'ziggy-js';
import ReservationNav from '@/Components/Navigation/ReservationNav';
import InfoCard from '@/Components/InfoCard';
import ConfirmModal from '@/Components/ConfirmModal';
import NoResults from '@/Components/Misc/NoResults';
import { Truncate } from '@re-dev/react-truncate';
import { ArrowPathIcon, ArrowTopRightOnSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const Waiting = ({ waitingReservations }) => {
  const route = useRoute();
  const [search, setSearch] = useState('');
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const filteredReservations = waitingReservations.filter((reservation) =>
    reservation.equipment.name.toLowerCase().includes(search.toLowerCase())
  );

  const lateWaitingReservations = waitingReservations.filter((reservation) => {
    const now = new Date();
    const reservationDate = new Date(reservation.start_date);
    return reservationDate < now;
  });

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const resetSearch = () => {
    setSearch('');
  };

  const handleDeleteClick = (reservation) => {
    setReservationToDelete(reservation);
  };

  const handleConfirmDelete = () => {
    if (reservationToDelete) {
      router.delete(route('user.reservations.delete', { id: reservationToDelete.id }), {
        preserveScroll: true,
        preserveState: true,
      });
      setReservationToDelete(null);
    }
  };

  return (
    <div className="container">
      <Head title="Čekající na schválení" />

      <h1 className="fluid-text-4 font-bold">Čekající na schválení</h1>
      <ReservationNav />

      <ConfirmModal
        isOpen={!!reservationToDelete}
        onClose={() => setReservationToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Zrušit rezervaci"
      >
        <div>Opravdu chcete zrušit tuto rezervaci?</div>
      </ConfirmModal>

      <div className="flex items-center">
        <label htmlFor="search" className="sr-only">
          Vyhledat
        </label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Hledat..."
          className="w-full rounded-lg border border-gray-200 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
        />

        <button
          aria-label="Resetování hledání"
          onClick={resetSearch}
          className="ml-2 rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <ArrowPathIcon className="size-6" />
        </button>
      </div>

      {lateWaitingReservations.length > 0 && (
        <InfoCard>
          Počet neschválených rezervací, které by měly již probíhat:{' '}
          <span className="font-bold">{lateWaitingReservations.length}</span>. Tyto rezervace budou
          automaticky zrušeny. Pro více informací kontaktujte správce.
        </InfoCard>
      )}

      {filteredReservations.length > 0 ? (
        <div className="mt-4 overflow-x-auto rounded-lg border shadow dark:border-gray-700">
          <table className="w-full">
            <thead className="bg-green-600 text-left text-xs font-medium uppercase tracking-wider text-white-50 dark:bg-gray-800 dark:text-gray-400">
              <tr>
                <th className="py-3"></th>
                <th className="px-6 py-3">Vybavení</th>
                <th className="px-6 py-3">Správce</th>
                <th className="px-6 py-3">Začátek</th>
                <th className="px-6 py-3">Konec</th>
                <th className="px-6 py-3">Zrušit</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
              {filteredReservations.map((reservation) => (
                <tr
                  key={reservation.id}
                  className={`transition-colors ${new Date(reservation.start_date) <= new Date() ? 'text-red-600' : 'text-gray-900 dark:text-gray-100'} dark:hover:bg-gray-800`}
                >
                  <td className="py-4 pl-4">
                    <img
                      className="h-12 w-12 rounded-md object-cover"
                      src={
                        reservation.equipment.image_path
                          ? reservation.equipment.image_path
                          : '/images/no-image.jpg'
                      }
                      alt={reservation.equipment.name}
                    />
                  </td>
                  <td className="max-w-[150px] whitespace-nowrap py-4 pr-6 text-sm">
                    <Link
                      className="flex items-center gap-1 hover:text-green-600 hover:underline"
                      href={route('equipment.show', reservation.equipment.slug)}
                    >
                      <ArrowTopRightOnSquareIcon className="size-4" />
                      <Truncate>{reservation.equipment.name}</Truncate>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {reservation.equipment.admin} ({reservation.equipment.room})
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {format(reservation.start_date, 'dd.MM.yyyy')} (
                    {formatDistanceToNow(reservation.start_date, { locale: cs, addSuffix: true })})
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {format(reservation.end_date, 'dd.MM.yyyy')}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <button
                      className="inline-flex items-center justify-center rounded-full p-2 text-red-600 transition-colors hover:bg-red-100 hover:text-red-800 dark:text-red-400 dark:hover:bg-red-900 dark:hover:text-red-300"
                      onClick={() => handleDeleteClick(reservation)}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <NoResults
          message={`${search === '' ? 'Nemáte žádnou schválenou rezervaci' : 'Nic nenalezeno'}`}
        />
      )}
    </div>
  );
};

export default Waiting;
