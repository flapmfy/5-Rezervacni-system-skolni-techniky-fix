import { Head, Link } from '@inertiajs/react';
import Breadcrumbs from '@/Components/Navigation/AdminBreadcrumbs';
import RequestedEquipment from '@/Components/RequestedEquipment';
import Comment from '@/Components/Comment';
import {
  ExclamationTriangleIcon,
  CalendarDateRangeIcon,
  AtSymbolIcon,
  UserIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowLongRightIcon,
} from '@heroicons/react/24/outline';
import { format, formatDistance } from 'date-fns';
import { cs } from 'date-fns/locale';

const Warning = ({ children }) => (
  <div className="flex items-center gap-2 rounded-xl border-2 border-red-700 bg-red-100 px-2 py-3 shadow-md">
    <ExclamationTriangleIcon className="size-6 text-red-700" />
    <p className="font-medium text-red-900">{children}</p>
  </div>
);

const ShowArchived = ({ reservation, student, reservation_issues }) => {
  const breadcrumbs = [
    { href: 'admin.reservations.archived', label: 'Archiv' },
    { href: null, label: `Rezervace #${reservation.id}` },
  ];

  const InfoItem = ({ icon: Icon, label, children }) => (
    <div className="flex items-center gap-2">
      <Icon className="size-4" />
      <p className="flex flex-wrap items-center">
        <span className="block min-w-[85px] font-medium">{label}</span>{' '}
        <span className="flex items-center gap-1">{children}</span>
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

  return (
    <div className="pt-4">
      <Head title={`Rezervace #${reservation.id}`} />
      <div className="container">
        <Breadcrumbs links={breadcrumbs} />
        <h1 className="fluid-text-4 mb-2 font-bold">Rezervace #{reservation.id}</h1>

        {/* vybavení k rezervaci */}
        <RequestedEquipment equipment={reservation.equipment} />

        <section className="mb-4 flex flex-col gap-2">
          {reservation_issues &&
            reservation_issues.map((issue, index) => <Warning key={index}>{issue}</Warning>)}
        </section>

        {/* výpis poznámky k rezervaci  */}
        <section className="mb-6">
          <h2 className="fluid-text-2 mb-1 font-medium">Poznámka správce</h2>
          <Comment comment={reservation.comment} noComment="Nebyla zadána žádná poznámka" />
        </section>

        <section className="mb-6 flex flex-col gap-4">
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

            <div className="mt-4">
              <Comment
                comment={reservation.user_comment}
                noComment="Žák nezadal komentář k rezervaci"
              />
            </div>
          </InfoCard>

          {/* informace o času rezervace  */}
          {reservation.pickup_date && (
            <InfoCard title="Rezervace">
              <InfoItem icon={ClockIcon} label="Začátek">
                <span>{format(new Date(reservation.start_date), 'dd.MM.yyyy')} </span>
                (vyzvednuto {format(new Date(reservation.pickup_date), 'dd.MM.yyyy')})
              </InfoItem>

              <InfoItem icon={ClockIcon} label="Konec">
                <span>{format(new Date(reservation.end_date), 'dd.MM.yyyy')}</span> (vráceno{' '}
                {format(new Date(reservation.return_date), 'dd.MM.yyyy')})
              </InfoItem>

              <InfoItem icon={CalendarDateRangeIcon} label="Délka">
                <span>
                  {formatDistance(
                    new Date(reservation.start_date),
                    new Date(reservation.end_date),
                    {
                      locale: cs,
                      addSuffix: false,
                    }
                  )}
                </span>
              </InfoItem>

              <InfoItem icon={ChartBarIcon} label="Stav">
                <span>{reservation.equipment_condition_start}</span>{' '}
                <ArrowLongRightIcon className="size-4" />
                <span>{reservation.equipment_condition_end}</span>
              </InfoItem>
            </InfoCard>
          )}
        </section>
      </div>
    </div>
  );
};

export default ShowArchived;
