import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { format, formatDistanceToNow } from 'date-fns';
import { cs } from 'date-fns/locale';
import ReservationNav from '@/Components/Navigation/ReservationNav';
import NoResults from '@/Components/Misc/NoResults';
import ErrorTag from '@/Components/ErrorTag';
import { ArrowPathIcon, ChatBubbleBottomCenterIcon } from '@heroicons/react/24/outline';

const Archived = ({ archivedReservations }) => {
  const [search, setSearch] = useState('');
  const filteredReservations = archivedReservations.filter((reservation) =>
    reservation.equipment.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const resetSearch = () => {
    setSearch('');
  };

  return (
    <div className="container">
      <Head title="Historie rezervací" />

      <h1 className="fluid-text-4 font-bold">Historie</h1>
      <ReservationNav />

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

      {filteredReservations.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-4">
          {filteredReservations.map((reservation) => {
            return (
              <li
                key={reservation.id}
                className={`overflow-hidden rounded border border-gray-200 shadow-md dark:border-gray-600 dark:bg-gray-800`}
              >
                <div className="flex gap-2 px-6 py-4">
                  <img
                    className="hidden aspect-square w-28 rounded-md object-cover md:block"
                    src={reservation.equipment.image || '/images/no-image.jpg'}
                    alt={reservation.equipment.name}
                  />
                  <div>
                    <h3 className="fluid-text-1 font-medium">
                      {reservation.equipment.trashed ? (
                        <>
                          {reservation.equipment.name}{' '}
                          <span className="text-orange-500">(není k dispozici)</span>
                        </>
                      ) : (
                        <Link
                          className="text-green-600 underline hover:no-underline"
                          href={route('equipment.show', reservation.equipment.slug)}
                        >
                          {reservation.equipment.name}
                        </Link>
                      )}
                    </h3>

                    <div className="text-black-800 dark:text-white-500">
                      <p className="flex flex-col gap-2 md:flex-row">
                        <span>
                          {format(reservation.start_date, 'dd.MM.yyyy')} -{' '}
                          {format(reservation.end_date, 'dd.MM.yyyy')}
                        </span>
                        <span className={`font-bold`}>
                          (
                          {formatDistanceToNow(new Date(reservation.end_date), {
                            locale: cs,
                            addSuffix: true,
                          })}
                          )
                        </span>
                      </p>
                      {reservation.issues && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {reservation.issues.map((issue) => (
                            <ErrorTag key={issue}>{issue}</ErrorTag>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-2 bg-green-600 p-3 text-white-50 md:flex-row md:px-6 md:py-1 dark:text-inherit">
                  <span className="flex items-center gap-1 text-nowrap font-bold">
                    <ChatBubbleBottomCenterIcon className="size-4" />{' '}
                    <span>{reservation.teacher}:</span>
                  </span>
                  {reservation.comment ? (
                    <span>{reservation.comment}</span>
                  ) : (
                    <span className="italic">Bez komentáře</span>
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

export default Archived;
