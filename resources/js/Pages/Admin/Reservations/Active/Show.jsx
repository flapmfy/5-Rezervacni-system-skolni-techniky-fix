import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import { useRoute } from 'ziggy-js';
import Breadcrumbs from '@/Components/Navigation/AdminBreadcrumbs';
import ConfirmModal from '@/Components/ConfirmModal';
import RequestedEquipment from '@/Components/RequestedEquipment';
import {
  CalendarDateRangeIcon,
  AtSymbolIcon,
  UserIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { format, formatDistance } from 'date-fns';
import { cs } from 'date-fns/locale';

const ShowActive = ({ reservation, student }) => {
  const route = useRoute();
  const { data, setData, patch, processing, errors } = useForm({
    id: reservation.id,
    message: reservation?.comment,
    equipmentCondition: reservation.equipment_condition_start,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const breadcrumbs = [
    { href: 'admin.reservations.active', label: 'Probíhající rezervace' },
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

  function handleReservationEnd() {
    patch(route('admin.reservations.active.end'));
  }

  return (
    <div className="pt-4">
      <Head title={`Probíhající rezervace #${reservation.id}`} />

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleReservationEnd}
        title="Ukončit rezervaci"
      >
        <div>
          Před ukončením rezervace se přesvědčte, zda žák skutečně vrátil vypůjčené vybavení.
        </div>
      </ConfirmModal>

      <div className="container">
        <Breadcrumbs links={breadcrumbs} />
        <h1 className="fluid-text-4 mb-2 font-bold">Probíhající rezervace #{reservation.id}</h1>

        {/* vybavení k rezervaci */}
        <RequestedEquipment equipment={reservation.equipment} />

        {/* informace o času rezervace  */}
        <section className="mb-6 flex flex-col gap-4 md:flex-row">
          <InfoCard title="Trvání">
            <InfoItem icon={ClockIcon} label="Začátek">
              <span>{format(new Date(reservation.start_date), 'dd.MM.yyyy')} </span>
            </InfoItem>

            <InfoItem icon={ClockIcon} label="Konec">
              <span
                className={`${new Date(reservation.end_date) < new Date() ? 'font-bold text-red-600' : ''}`}
              >
                {format(new Date(reservation.end_date), 'dd.MM.yyyy')}
              </span>
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

        {/* stav vybavení */}
        <section className="mb-6">
          <h2 className="fluid-text-2 mb-1 font-medium">Stav vybavení</h2>
          <div className="flex flex-col gap-2 md:flex-row">
            <div className="flex w-full flex-1 flex-col gap-1 md:w-auto">
              <label htmlFor="equipmentConditionStart" className="select-none">
                Převzetí
              </label>
              <select
                id="equipmentConditionStart"
                disabled
                className="min-w-[200px] rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-800"
              >
                <option>{reservation.equipment_condition_start}</option>
              </select>
            </div>

            <div className="flex w-full flex-1 flex-col gap-1 md:w-auto">
              <label htmlFor="equipmentConditionEnd" className="select-none">
                Vrácení
              </label>
              <select
                id="equipmentConditionEnd"
                className="min-w-[200px] cursor-pointer rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-800"
                onChange={(e) => setData('equipmentCondition', e.target.value)}
                name="equipmentState"
                value={data.equipmentCondition}
              >
                <option value={reservation.equipment_condition_start}>stejné</option>
                <option value="jako nové">jako nové</option>
                <option value="poškozené">poškozené</option>
                <option value="nevráceno">nevráceno</option>
              </select>
              <p className="mt-1 text-sm text-red-500">{errors.equipmentCondition}</p>
            </div>
          </div>
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
        <div className="container flex">
          <button
            disabled={processing}
            label="Přijmout žádost"
            onClick={() => setIsModalOpen(true)}
            className="btn flex-1 bg-green-600 text-white-50 shadow-md hover:bg-green-700"
          >
            Ukončit rezervaci
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowActive;
