import { useState } from 'react';
import { useRoute } from 'ziggy-js';
import { Head, Link, router } from '@inertiajs/react';
import { formatDistance, formatDistanceToNow, format } from 'date-fns';
import { cs } from 'date-fns/locale';
import ReservationNav from '@/Components/Navigation/ReservationNav';
import InfoCard from '@/Components/InfoCard';
import ConfirmModal from '@/Components/ConfirmModal';
import NoResults from '@/Components/Misc/NoResults';
import Modal from '@/Components/Modal';
import { Truncate } from '@re-dev/react-truncate';
import {
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  TrashIcon,
  InformationCircleIcon,
  UserCircleIcon,
  ClockIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

const InfoItem = ({ icon: Icon, label, children }) => (
  <div className="flex items-center gap-2">
    <Icon className="size-4" />
    <p className="flex flex-wrap items-center">
      <span className="block min-w-[100px] font-medium">{label}</span> <span>{children}</span>
    </p>
  </div>
);

const Accepted = ({ acceptedReservations }) => {
  const route = useRoute();
  const [search, setSearch] = useState('');
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const [infoReservation, setInfoReservation] = useState(null);
  const filteredReservations = acceptedReservations.filter((reservation) =>
    reservation.equipment.name.toLowerCase().includes(search.toLowerCase())
  );

  const lateAcceptedReservations = acceptedReservations.filter((reservation) => {
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

  const handleShowInfo = (reservationId) => {
    const reservation = acceptedReservations.find((r) => r.id === reservationId);
    setInfoReservation(reservation);
  };

  const handleInfoClose = () => {
    setInfoReservation(null);
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
      <Head title="Schválené rezervace" />

      <ConfirmModal
        isOpen={!!reservationToDelete}
        onClose={() => setReservationToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Zrušit rezervaci"
      >
        <p>Opravdu chcete zrušit tuto rezervaci?</p>
        {reservationToDelete && new Date(reservationToDelete.start_date) < new Date() && (
          <p className="mt-2 font-bold italic">
            Jelikož nebylo zařízení vyzvednuto včas, bude tato rezervace zaznamenána v systému jako
            nevyzvednutá
          </p>
        )}
      </ConfirmModal>

      <Modal isOpen={!!infoReservation} onClose={handleInfoClose}>
        <h2 className="fluid-text-2 font-medium">Informace o rezervaci</h2>
        {infoReservation && (
          <>
            <div className="flex flex-col gap-2">
              <InfoItem icon={ClockIcon} label="Začátek:">
                {format(new Date(infoReservation.start_date), 'dd. MM. yyyy', { locale: cs })}
              </InfoItem>
              <InfoItem icon={ClockIcon} label="Konec:">
                {format(new Date(infoReservation.end_date), 'dd. MM. yyyy', { locale: cs })}
              </InfoItem>
              <InfoItem icon={ClockIcon} label="Délka:">
                {formatDistance(
                  new Date(infoReservation.start_date),
                  new Date(infoReservation.end_date),
                  { locale: cs }
                )}
              </InfoItem>
              <InfoItem icon={UserCircleIcon} label="Správce:">
                {infoReservation.equipment.admin}
              </InfoItem>
              <InfoItem icon={MapPinIcon} label="Místnost:">
                {infoReservation.equipment.room}
              </InfoItem>
              <InfoItem icon={InformationCircleIcon} label="Status:">
                {infoReservation.status}
              </InfoItem>
            </div>

            <h3 className="fluid-text-1 font-medium">Poznámka správce:</h3>
            {infoReservation.comment ? (
              <p>{infoReservation.comment}</p>
            ) : (
              <p className="italic">Správce vybavení neuvedl žádnou poznámku.</p>
            )}
          </>
        )}
      </Modal>

      <h1 className="fluid-text-4 font-bold">Schválené žádosti</h1>

      <ReservationNav />

      <section className="flex items-center">
        <label htmlFor="search" className="sr-only">
          Vyhledat
        </label>
        <input
          type="text"
          id="search"
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
      </section>

      {lateAcceptedReservations.length > 0 && (
        <InfoCard>
          Počet nevyzvednutých rezervací:{' '}
          <span className="font-bold">{lateAcceptedReservations.length}</span>. Nevyzvednuté
          rezervace budou automaticky zrušeny a zaznamenány v systému.
        </InfoCard>
      )}

      {filteredReservations.length > 0 ? (
        <div className="mt-4 overflow-x-auto rounded-lg border shadow dark:border-gray-700">
          <table className="w-full">
            <thead className="bg-green-600 text-left text-xs font-medium uppercase tracking-wider text-white-50 dark:bg-gray-800 dark:text-gray-400">
              <tr>
                <th></th>
                <th className="py-3"></th>
                <th className="px-6 py-3">Vybavení</th>
                <th className="px-6 py-3">Místnost</th>
                <th className="px-6 py-3">Možné vyzvednout</th>
                <th className="px-6 py-3">Začátek</th>
                <th className="px-6 py-3">Konec</th>
                <th className="px-6 py-3">Akce</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
              {filteredReservations.map((reservation) => (
                <tr
                  key={reservation.id}
                  className="text-gray-900 transition-colors hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800"
                >
                  {new Date(reservation.start_date) <= new Date() ? (
                    <td className="bg-red-600 text-sm text-white-50"></td>
                  ) : (
                    <td></td>
                  )}
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
                  <td className="max-w-[150px] whitespace-nowrap px-6 py-4 text-sm">
                    {reservation.equipment.trashed ? (
                      <>
                        {reservation.equipment.name}{' '}
                        <span className="text-orange-500">(není k dispozici)</span>
                      </>
                    ) : (
                      <Link
                        className="flex items-center gap-1 hover:text-green-600 hover:underline"
                        href={route('equipment.show', reservation.equipment.slug)}
                      >
                        <ArrowTopRightOnSquareIcon className="size-4" />
                        <Truncate>{reservation.equipment.name}</Truncate>
                      </Link>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {reservation.equipment.room}
                  </td>
                  <td
                    className={`whitespace-nowrap px-6 py-4 text-sm ${
                      new Date(reservation.start_date) <= new Date()
                        ? 'text-red-600 dark:text-red-600'
                        : ''
                    } text-gray-900 dark:text-gray-100`}
                  >
                    {formatDistanceToNow(new Date(reservation.start_date), {
                      locale: cs,
                      addSuffix: true,
                    })}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {format(reservation.start_date, 'dd.MM.yyyy')}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {format(reservation.end_date, 'dd.MM.yyyy')}
                  </td>
                  <td className="mt-2 flex gap-2 whitespace-nowrap px-6 py-4 text-sm">
                    <button
                      title="Informace o rezervaci"
                      className="inline-flex items-center justify-center rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-300"
                      onClick={() => handleShowInfo(reservation.id)}
                    >
                      <InformationCircleIcon className="h-5 w-5" />
                    </button>

                    <button
                      title="Zrušit rezervaci"
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

export default Accepted;
