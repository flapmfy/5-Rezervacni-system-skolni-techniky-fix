import { Head } from '@inertiajs/react';
import EventsCalendar from '@/Components/Libraries/EventsCalendar';
import { useRoute } from 'ziggy-js';
const Calendar = ({ reservations }) => {
  const route = useRoute();
  const events = reservations.map((reservation) => {
    let eventColor = '';
    let routeName = '';
    if (reservation.status === 'neschváleno') {
      eventColor = '#ef4444';
      routeName = 'admin.reservations.waiting.show';
    } else if (reservation.status === 'schváleno') {
      eventColor = '#22c55e';
      routeName = 'admin.reservations.accepted.show';
    } else if (reservation.status === 'probíhá') {
      eventColor = '#f97316';
      routeName = 'admin.reservations.active.show';
    }

    return {
      id: reservation.id,
      title: `${reservation.equipment_name} (${reservation.user_name}, ${reservation.user_class})`,
      start: new Date(reservation.start_date),
      end: new Date(reservation.end_date),
      url: route(routeName, { id: reservation.id }),
      color: eventColor,
    };
  });

  return (
    <div className="container pb-4">
      <Head title="Kalendář" />
      <h1 className="fluid-text-3 py-4 font-medium">Kalendář rezervací</h1>

      <EventsCalendar events={events} />

      <div className="iems-center mt-2 flex flex-wrap justify-center gap-3 md:flex-nowrap">
        <div className="flex items-center gap-1">
          <div className="size-3 rounded-full bg-red-500"></div>
          <p className="text-nowrap">neschválené</p>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-3 rounded-full bg-green-500"></div>
          <p className="text-nowrap">schválené</p>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-3 rounded-full bg-orange-500"></div>
          <p className="text-nowrap">probíhá</p>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
