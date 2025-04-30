import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // Needed for click events
import csLocale from '@fullcalendar/core/locales/cs';
import { router } from '@inertiajs/react';
import { useRoute } from 'ziggy-js';

const EventsCalendar = ({ events }) => {
  const route = useRoute();
  const handleEventClick = (info) => {
    console.log(info);
    window.location.href = route(info.event.url, { id: info.event.id });
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={csLocale}
        events={events}
        eventClick={handleEventClick}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek',
        }}
        height="auto"
      />
    </div>
  );
};

export default EventsCalendar;
