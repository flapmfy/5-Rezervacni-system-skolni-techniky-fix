import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { useRoute } from 'ziggy-js';
import Breadcrumbs from '@/Components/Navigation/AdminBreadcrumbs';
import RequestedEquipment from '@/Components/RequestedEquipment';
import Comment from '@/Components/Comment';
import ConfirmModal from '@/Components/ConfirmModal';
import {
  CalendarDateRangeIcon,
  AtSymbolIcon,
  UserIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { format, formatDistance, formatDistanceToNow, isToday } from 'date-fns';
import { cs } from 'date-fns/locale';

const ShowAccepted = ({ reservation, student }) => {
  const route = useRoute();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data,
    setData,
    patch,
    delete: destroy,
    processing,
    errors,
  } = useForm({
    id: reservation.id,
    message: reservation?.comment,
    equipmentCondition: 'jako nové',
  });

  const breadcrumbs = [
    { href: 'admin.reservations.accepted', label: 'Schválené žádosti' },
    { href: null, label: `Rezervace #${reservation.id}` },
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
    patch(route('admin.reservations.accepted.accept'));
  }

  function handleDecline() {
    destroy(route('admin.reservations.accepted.decline'));
  }

  return (
    <div className="pt-4">
      <Head title={`Schválená rezervace #${reservation.id}`} />
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDecline}
        title="Zrušit rezervaci"
      >
        <div>Doopravdy chcete zrušit tuto rezervaci?</div>
      </ConfirmModal>
      <div className="container">
        <Breadcrumbs links={breadcrumbs} />
        <h1 className="fluid-text-4 mb-2 font-bold">Schválená rezervace #{reservation.id}</h1>

        {/* vybavení k rezervaci */}
        <RequestedEquipment equipment={reservation.equipment} />

        {/* info  */}
        <section className="mb-6 flex flex-col gap-4 md:flex-row">
          {/* informace o času rezervace  */}
          <InfoCard title="Trvání">
            <InfoItem icon={ClockIcon} label="Začátek">
              <span>
                {format(new Date(reservation.start_date), 'dd.MM.yyyy')}{' '}
                <span
                  className={`${isToday(new Date(reservation.start_date)) ? 'text-green-600' : 'text-red-500'} font-medium`}
                >
                  (
                  {isToday(new Date(reservation.start_date))
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
              <Link href={route('admin.users.show', student.id)} className="text-green-600 underline">
                {student.name}, {student.class}
              </Link>
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

        {/* výpis poznámky k rezervaci  */}
        <section className="mb-6">
          <h2 className="fluid-text-2 mb-1 font-medium">Poznámka</h2>
          <textarea
            label="Poznámka správce vybavení"
            onChange={(e) => setData('message', e.target.value)}
            name="message"
            rows={3}
            className="w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-800"
            placeholder={`${data.message ? '' : 'Nebyla přidána žádná poznámka'}`}
            value={data.message || ''}
          ></textarea>
          <p className="mt-1 text-sm text-red-500">{errors.message}</p>
        </section>
      </div>

      {/* sticky menu pro akce */}
      <div className="sticky bottom-0 z-0 border-t bg-white-150 py-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="container flex flex-wrap items-center justify-between gap-2">
          <div className="flex w-full flex-col gap-1 md:w-auto">
            <label htmlFor="equipmentCondition" className="select-none">
              Stav při převzetí
            </label>

            <select
              className="min-w-[200px] cursor-pointer rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-800"
              onChange={(e) => setData('equipmentCondition', e.target.value)}
              name="equipmentCondition"
              id="equipmentCondition"
              value={data.equipmentCondition}
            >
              <option value="nové">nové</option>
              <option value="jako nové">jako nové</option>
              <option value="opotřebené">opotřebené</option>
            </select>
            <p className="mt-1 text-sm text-red-500">{errors.equipmentCondition}</p>
          </div>

          <div className="flex w-full items-center gap-2 md:w-auto">
            <button
              disabled={processing}
              label="Odmítnout žádost"
              onClick={() => setIsModalOpen(true)}
              className="btn flex-1 bg-red-600 text-white-50 shadow-md hover:bg-red-700"
            >
              Zrušit
            </button>
            <button
              title={new Date(reservation.start_date) > new Date() ? 'Nelze zahájit' : 'Zahájit'}
              disabled={processing || new Date(reservation.start_date) > new Date()}
              label={
                new Date(reservation.start_date) > new Date()
                  ? 'Nelze zahájit dříve než v den začátku rezervace'
                  : 'Zahájit'
              }
              onClick={handleAccept}
              className="btn flex-1 bg-green-600 text-white-50 shadow-md hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Zahájit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowAccepted;
