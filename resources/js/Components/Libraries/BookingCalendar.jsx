import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { useRoute } from 'ziggy-js';
import { DayPicker } from 'react-day-picker';
import { cs } from 'react-day-picker/locale';
import { addDays, isWithinInterval, format, eachDayOfInterval } from 'date-fns';
import 'react-day-picker/style.css';

export default function BookingCalendar({ bookedRanges, equipment, daysDisabled }) {
  const route = useRoute();
  const [selectedRange, setSelectedRange] = useState();
  const [error, setError] = useState();
  const { data, setData, post, processing, errors } = useForm({
    equipmentId: equipment.id,
    comment: '',
    startDate: null,
    endDate: null,
  });

  // znemožnění vytvoření rezervace na aktuální den a víkend
  const disabledDays = [
    { before: addDays(new Date(), 2) },
    { dayOfWeek: [0, 6] },
    { dayOfWeek: daysDisabled },
  ];

  // callback zjišťující, zda je daný datum plně rezervovaný
  const isFullyBooked = (bookingsOnDate, equipmentQuantity) => {
    return bookingsOnDate >= equipmentQuantity;
  };

  // callback zjišťující, zda je daný datum částečně obsazený
  const isPartiallyBooked = (bookingsOnDate, equipmentQuantity) => {
    return bookingsOnDate > 0 && bookingsOnDate < equipmentQuantity - 1;
  };

  const isAlmostBooked = (bookingsOnDate, equipmentQuantity) => {
    return bookingsOnDate === equipmentQuantity - 1;
  };

  // funkce vracející pole dnů, které odpovídají podmínce v callbacku
  function findBookedDates(bookings, equipmentQuantity, callback) {
    if (bookings.length === 0) {
      return [];
    }

    // převod na datum objekty a vytvoření skutečných rozsahů dnů pro každou rezervaci
    const bookingDates = [];

    bookings.forEach((booking) => {
      const start = new Date(booking.start_date);
      const end = new Date(booking.end_date);

      // Pro každou rezervaci získáme jednotlivé dny
      const daysInRange = eachDayOfInterval({ start: start, end: end });
      daysInRange.forEach((date) => {
        const dateStr = format(date, 'yyyy-MM-dd');

        // Používáme objekt pro sledování počtu rezervací na konkrétní den
        if (!bookingDates[dateStr]) {
          bookingDates[dateStr] = 0;
        }
        bookingDates[dateStr]++;
      });
    });

    // Nyní vytvoříme pole s daty podle callbacku
    const resultDates = [];
    for (const dateStr in bookingDates) {
      const bookingsOnDate = bookingDates[dateStr];
      if (callback(bookingsOnDate, equipment.quantity)) {
        resultDates.push(new Date(dateStr));
      }
    }

    return resultDates;
  }

  const bookedDates = findBookedDates(bookedRanges, equipment.quantity, isFullyBooked);
  const partiallyBookedDates = findBookedDates(bookedRanges, equipment.quantity, isPartiallyBooked);
  const almostBookedDates = findBookedDates(bookedRanges, equipment.quantity, isAlmostBooked);

  // kontrola, zda se vybraný rozsah nekryje s rezervacemi
  const doesIntersectWithBooked = (range) => {
    if (!range?.from || !range?.to) return false;

    // pokud se ve vybraném rozsahu nachází alespoň 1 obsazený den, vrací true
    return bookedDates.some((bookedDate) => {
      return isWithinInterval(bookedDate, {
        start: range.from,
        end: range.to,
      });
    });
  };

  // validace a nastavení error zpráv
  const isValidRange = (range) => {
    if (!range?.from || !range?.to) return false;

    if (doesIntersectWithBooked(range)) {
      setError('Rezervace se kryje s jinou rezervací');
      return false;
    }

    setError(null);
    return true;
  };

  // zpracování vybraného rozsahu
  const handleSelect = (range) => {
    if (!isValidRange(range)) {
      setData({
        ...data,
        startDate: null,
        endDate: null,
      });
      setSelectedRange(null);
      return;
    }

    setData({
      ...data,
      startDate: format(range.from, 'yyyy-MM-dd'),
      endDate: format(range.to, 'yyyy-MM-dd'),
    });
    setSelectedRange(range);
  };

  // odeslání formuláře
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValidRange(selectedRange)) return;

    post(route('user.reservations.store'), {});
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex min-h-[400px] flex-col items-center overflow-x-auto">
        <DayPicker
          required
          startMonth={new Date()}
          mode="range"
          selected={selectedRange}
          onSelect={handleSelect}
          disabled={disabledDays}
          modifiers={{
            bookedDates: bookedDates,
            partiallyBookedDates: partiallyBookedDates,
            almostBookedDates: almostBookedDates,
          }}
          locale={cs}
          showOutsideDays
          classNames={{
            today: 'text-orange-400 font-bold',
            selected: 'rdp-day_selected',
            chevron: 'fill-green-600',
            range_start: 'rdp-day_range_start',
            range_middle: 'rdp-day_range_middle',
            range_end: 'rdp-day_range_end',
          }}
          modifiersClassNames={{
            bookedDates: 'bg-red-500 rounded-full',
            partiallyBookedDates: 'rdp-day_partially-booked',
            almostBookedDates: 'rdp-day_almost-booked',
          }}
          footer={
            selectedRange && (
              <p className="mt-6 text-center font-medium">
                <span className="rounded-lg bg-gray-200 p-2 dark:bg-gray-900">
                  {format(selectedRange?.from, 'dd.MM.yyyy')}
                </span>{' '}
                -{' '}
                <span className="rounded-lg bg-gray-200 p-2 dark:bg-gray-900">
                  {format(selectedRange?.to, 'dd.MM.yyyy')}
                </span>
              </p>
            )
          }
        />
        {error && <p className="text-red-600">{error}</p>}
        {errors.startDate && <p className="text-red-600">{errors.startDate}</p>}
        {errors.endDate && <p className="text-red-600">{errors.endDate}</p>}
        {errors.equipmentId && <p className="text-red-600">{errors.equipmentId}</p>}
      </div>

      <div className="iems-center mt-2 flex flex-wrap justify-center gap-3 md:flex-nowrap">
        <div className="flex items-center gap-1">
          <div className="size-3 rounded-full bg-red-500"></div>
          <p className="text-nowrap">obsazené</p>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-3 rounded-full bg-orange-500"></div>
          <p className="text-nowrap">téměř obsazené</p>
        </div>
        <div className="flex items-center gap-1">
          <div className="size-3 rounded-full bg-yellow-500"></div>
          <p className="text-nowrap">částečně obsazené</p>
        </div>
      </div>

      <div>
        <label className="sr-only" htmlFor="user_comment">
          Poznámka k žádosti
        </label>

        <textarea
          id="user_comment"
          name="user_comment"
          onChange={(e) => setData('comment', e.target.value)}
          className="mt-4 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-900"
          placeholder="Důvod rezervace, místo ..."
          value={data.comment}
        ></textarea>

        <p className="text-red-600">{errors.comment}</p>
      </div>

      <button
        type="submit"
        label="Odeslat žádost"
        disabled={!data.comment || !selectedRange || processing}
        className="mt-4 w-full rounded-lg bg-green-600 px-4 py-2 font-bold text-white-50 transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-500"
      >
        Odeslat žádost
      </button>
    </form>
  );
}
