import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { formatDistance, formatDistanceToNow, format } from 'date-fns';
import { cs } from 'date-fns/locale';
import ReservationNav from '@/Components/Navigation/ReservationNav';
import InfoCard from '@/Components/InfoCard';
import Modal from '@/Components/Modal';
import { truncate } from 'lodash';
import NoResults from '@/Components/Misc/NoResults';
import {
  ArrowPathIcon,
  ExclamationCircleIcon,
  ArrowTopRightOnSquareIcon,
  ClockIcon,
  MapPinIcon,
  InformationCircleIcon,
  WrenchIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const InfoItem = ({ icon: Icon, label, children }) => (
  <div className="flex items-center gap-2">
    <Icon className="size-4" />
    <p className="flex flex-wrap items-center">
      <span className="block min-w-[100px] font-medium">{label}</span> <span>{children}</span>
    </p>
  </div>
);

const Active = ({ activeReservations }) => {
  const [search, setSearch] = useState('');
  const [infoReservation, setInfoReservation] = useState(null);
  const filteredReservations = activeReservations.filter((reservation) =>
    reservation.equipment.name.toLowerCase().includes(search.toLowerCase())
  );

  const lateActiveReservations = activeReservations.filter((reservation) => {
    const now = new Date();
    const reservationDate = new Date(reservation.end_date);
    return reservationDate < now;
  });

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const resetSearch = () => {
    setSearch('');
  };

  const handleShowInfo = (reservationId) => {
    const reservation = activeReservations.find((r) => r.id === reservationId);
    setInfoReservation(reservation);
  };

  const handleCloseInfo = () => {
    setInfoReservation(null);
  };

  return (
    <div className="container">
      <Head title="Probíhající rezervace" />

      <Modal isOpen={!!infoReservation} onClose={handleCloseInfo}>
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
              <InfoItem icon={WrenchIcon} label="Stav:">
                {infoReservation.condition}
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

      <h1 className="fluid-text-4 font-bold">Probíhající rezervace</h1>
      <ReservationNav />

      <div className="flex items-center">
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
      </div>

      {lateActiveReservations.length > 0 && (
        <InfoCard>
          Počet neodevzdaných zařízení:{' '}
          <span className="font-bold">{lateActiveReservations.length}</span>. Co nejdříve je vraťte.
        </InfoCard>
      )}

      {filteredReservations.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-4">
          {filteredReservations.map((reservation) => {
            const isLate = new Date(reservation.end_date) < new Date();
            return (
              <li
                key={reservation.id}
                className={`flex items-center gap-4 overflow-hidden rounded border ${
                  isLate
                    ? 'border-red-200 bg-red-100 dark:border-red-500 dark:bg-gray-900'
                    : 'border-gray-200 dark:border-gray-600 dark:bg-gray-800'
                } shadow-md`}
              >
                <div className="hidden h-[165px] max-w-[250px] md:block">
                  <img
                    className="aspect-video h-full w-full object-cover"
                    src={
                      reservation.equipment.image
                        ? reservation.equipment.image
                        : '/images/no-image.jpg'
                    }
                    alt={reservation.equipment.name}
                  />
                </div>

                <div className="flex flex-grow items-center justify-between p-2">
                  <div className="w-full md:w-auto">
                    {reservation.equipment.trashed ? (
                      <div className="fluid-text-1 font-medium">
                        {truncate(reservation.equipment.name, { length: 30 })}{' '}
                        <span className="text-orange-500">(není k dispozici)</span>
                      </div>
                    ) : (
                      <Link
                        className="text-green-500 hover:underline"
                        href={route('equipment.show', reservation.equipment.slug)}
                      >
                        <h2 className="fluid-text-1 flex items-center gap-1 font-medium">
                          <ArrowTopRightOnSquareIcon className="size-6" />
                          {truncate(reservation.equipment.name, { length: 30 })}
                        </h2>
                      </Link>
                    )}

                    <div className="flex flex-col items-start gap-1 text-black-800 dark:text-white-500">
                      <p>Místnost: {reservation.equipment.room}</p>
                      <p>
                        <span>Končí </span>
                        <span className={`${isLate ? 'text-red-500' : ''} font-bold`}>
                          {new Date(reservation.end_date).toLocaleDateString('cs')} (
                          {formatDistanceToNow(new Date(reservation.end_date), {
                            locale: cs,
                            addSuffix: false,
                          })}
                          )
                        </span>
                      </p>
                      <button
                        aria-label="Zobrazit detail rezervace"
                        onClick={() => handleShowInfo(reservation.id)}
                        className="btn mt-2 w-full border-2 border-gray-900 hover:bg-gray-900 hover:text-white-50 md:w-auto dark:border-gray-500 dark:hover:bg-gray-500"
                      >
                        Detail
                      </button>
                    </div>
                  </div>
                  {isLate && (
                    <div className="hidden md:block" title="Pozdní odevzdání">
                      <ExclamationCircleIcon className="size-12 text-red-500" />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <NoResults
          message={`${search === '' ? 'Nemáte žádnou schválenou rezervaci' : 'Nic nenalezeno'}`}
        />
      )}
    </div>
  );
};

export default Active;
