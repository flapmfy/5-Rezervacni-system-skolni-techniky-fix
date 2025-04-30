import { Link, Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useRoute } from 'ziggy-js';
import Breadcrumbs from '@/Components/Navigation/AdminBreadcrumbs';
import RequestedEquipment from '@/Components/RequestedEquipment';
import Comment from '@/Components/Comment';
import ErrorTag from '@/Components/ErrorTag';
import ProfileIcon from '@/Components/Icons/ProfileIcon';
import {
  CalendarDateRangeIcon,
  AtSymbolIcon,
  UserIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { format, formatDistance, formatDistanceToNow, isSameDay } from 'date-fns';
import { cs } from 'date-fns/locale';
import NoResults from '@/Components/Misc/NoResults';

const ShowWaiting = ({ reservation, student }) => {
  const route = useRoute();
  const [showTextInput, setShowTextInput] = useState(false);

  const {
    data,
    setData,
    patch,
    delete: destroy,
    processing,
    errors,
  } = useForm({
    id: reservation.id,
    message: '',
  });

  const breadcrumbs = [
    { href: 'admin.reservations.waiting', label: 'Neschválené žádosti' },
    { href: null, label: `Žádost #${reservation.id}` },
  ];

  const InfoItem = ({ icon: Icon, label, children }) => (
    <div className="flex items-center gap-2">
      <Icon className="size-4" />
      <p className="flex flex-wrap items-center">
        <span className="block min-w-[85px] font-medium">{label}</span> <span>{children}</span>
      </p>
    </div>
  );

  const InfoCard = ({ title, children }) => (
    <div className="flex-1 rounded-md border p-4 shadow-md dark:border-gray-700">
      <h2 className="fluid-text-2 mb-2 border-b border-gray-300 font-medium dark:border-gray-600">
        {title}
      </h2>
      <div className="flex flex-col gap-1 py-1">{children}</div>
    </div>
  );

  function handleAccept() {
    patch(route('admin.reservations.waiting.accept'));
  }

  function handleDecline() {
    destroy(route('admin.reservations.waiting.decline'));
  }

  return (
    <div className="pt-4">
      <Head title={`Žádost #${reservation.id}`} />
      <div className="container">
        <Breadcrumbs links={breadcrumbs} />
        <h1 className="fluid-text-4 mb-2 font-bold">Žádost #{reservation.id}</h1>

        {/* vybavení k rezervaci */}
        <RequestedEquipment equipment={reservation.equipment} />

        {/* info o rezervaci */}
        <section className="mb-6 flex flex-col gap-4 md:flex-row">
          {/* informace o času rezervace  */}
          <InfoCard title="Trvání">
            <InfoItem icon={ClockIcon} label="Začátek">
              <span>
                {format(new Date(reservation.start_date), 'dd.MM.yyyy')}{' '}
                <span
                  className={`${new Date(reservation.start_date) >= new Date() ? 'text-green-600' : 'text-red-500'} font-medium`}
                >
                  (
                  {isSameDay(new Date(reservation.start_date), new Date())
                    ? 'dnes'
                    : formatDistanceToNow(new Date(reservation.start_date), {
                        locale: cs,
                        addSuffix: true,
                      })}
                  )
                </span>
              </span>
            </InfoItem>

            <InfoItem icon={ClockIcon} label="Konec">
              <span>{format(new Date(reservation.end_date), 'dd.MM.yyyy')}</span>
            </InfoItem>

            <InfoItem icon={CalendarDateRangeIcon} label="Délka">
              <span>
                {formatDistance(new Date(reservation.start_date), new Date(reservation.end_date), {
                  locale: cs,
                  addSuffix: false,
                })}
              </span>
            </InfoItem>
          </InfoCard>

          {/* informace o žákovi  */}
          <InfoCard title="Žák">
            <InfoItem icon={UserIcon} label="Jméno">
              <span>
                {student.name}, {student.class}
              </span>
            </InfoItem>

            <InfoItem icon={AtSymbolIcon} label="Email">
              <span>{student.email}</span>
            </InfoItem>
          </InfoCard>
        </section>

        {/* zpráva od žáka  */}
        <section className="mb-6">
          <h2 className="fluid-text-2 mb-1 font-medium">Zpráva od žáka</h2>
          <Comment comment={reservation.user_comment} noComment="Nebyla přidána žádná zpráva" />
        </section>

        {/* výpis archivovaných rezervací žáka  */}
        <section className="mb-6">
          <h2 className="fluid-text-2 mb-1 font-medium">
            Historie žáka &#40;
            {student.past_reservations_managed.length + student.past_reservations_other.length}
            &#41;
          </h2>

          {student.past_reservations_managed.length > 0 ||
          student.past_reservations_other.length > 0 ? (
            <>
              {student.past_reservations_managed.length > 0 && (
                <div>
                  <h3 className="mb-1 text-center text-sm font-medium uppercase text-gray-400">
                    Rezervace na vaše vybavení
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {student.past_reservations_managed.map((reservation) => {
                      return (
                        <li className="overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all hover:scale-[1.01] hover:shadow-md dark:border-gray-700">
                          <Link
                            href={route('admin.reservations.archived.show', reservation.id)}
                            className="block p-5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          >
                            <div className="space-y-2">
                              <div>
                                <p className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                                  {reservation.equipment.name}
                                </p>
                                <p className="mt-1.5 text-sm font-medium text-gray-600 dark:text-gray-400">
                                  {format(new Date(reservation.start_date), 'dd.MM.yyyy')} –{' '}
                                  {format(new Date(reservation.end_date), 'dd.MM.yyyy')}
                                </p>
                              </div>
                              {reservation.comment && (
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {reservation.comment}
                                </p>
                              )}
                              {!reservation.comment && (
                                <p className="text-sm italic text-gray-500 dark:text-gray-400">
                                  Nebyla uvedena poznámka
                                </p>
                              )}
                              {reservation.issues && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {reservation.issues.map((issue) => (
                                    <ErrorTag key={issue}>{issue}</ErrorTag>
                                  ))}
                                </div>
                              )}
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {student.past_reservations_other.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-1 text-center text-sm font-medium uppercase text-gray-400">
                    Rezervace na vybavení jiných
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {student.past_reservations_other.map((reservation) => {
                      return (
                        <li className="flex items-start gap-4 overflow-hidden rounded-lg border border-gray-200 p-3 shadow-sm dark:border-gray-700">
                          <div className="hidden md:block">
                            <ProfileIcon username={reservation.equipment.owner.name} />
                          </div>
                          <div className="space-y-2">
                            <p>
                              <span className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                                {reservation.equipment.owner.name}
                              </span>
                              <span className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                {' '}
                                {formatDistanceToNow(new Date(reservation.return_date), {
                                  addSuffix: true,
                                  locale: cs,
                                })}
                              </span>
                            </p>
                            {reservation.issues && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {reservation.issues.map((issue) => (
                                  <ErrorTag key={issue}>{issue}</ErrorTag>
                                ))}
                              </div>
                            )}
                            {reservation.comment && (
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {reservation.comment}
                              </p>
                            )}
                            {!reservation.comment && (
                              <p className="text-sm italic text-gray-500 dark:text-gray-400">
                                Nebyla uvedena poznámka
                              </p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <NoResults message="Žádná předchozí rezervace" />
          )}
        </section>
      </div>

      {/* sticky menu pro akce */}
      <div className="sticky bottom-0 z-0 border-t bg-white-150 py-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="container flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <input
              onClick={(e) => setShowTextInput(e.target.checked)}
              type="checkbox"
              className="cursor-pointer"
              name=""
              id="check"
            />
            <label htmlFor="check" className="cursor-pointer select-none">
              Přidat poznámku
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={processing}
              label="Odmítnout žádost"
              onClick={handleDecline}
              className="btn bg-red-600 text-white-50 shadow-md hover:bg-red-700"
            >
              Odmítnout
            </button>
            <button
              disabled={processing}
              label="Přijmout žádost"
              onClick={handleAccept}
              className="btn bg-green-600 text-white-50 shadow-md hover:bg-green-700"
            >
              Přijmout
            </button>
          </div>
        </div>

        {showTextInput && (
          <div className="container mt-4">
            <label htmlFor="message" className="sr-only"></label>
            <textarea
              name="message"
              className="w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-800"
              placeholder="Přidat poznámku, důvod odmítnutí ..."
              onChange={(e) => setData('message', e.target.value)}
              value={data.message}
            ></textarea>
            <p className="mt-1 text-sm text-red-500">{errors.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowWaiting;
