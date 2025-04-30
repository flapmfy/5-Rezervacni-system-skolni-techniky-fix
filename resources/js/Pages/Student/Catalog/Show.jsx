import { useState } from 'react';
import { Head } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import BookingCalendar from '@/Components/Libraries/BookingCalendar';
import GoBackBtn from '@/Components/GoBackBtn';
import NoResults from '@/Components/Misc/NoResults';
import ProfileIcon from '@/Components/Icons/ProfileIcon';
import { format } from 'date-fns';
import { ArrowLeftIcon, TagIcon, MapPinIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const Show = ({ equipment, category, bookedRanges, disabledDays }) => {
  const [showModal, setShowModal] = useState(false);
  const active = bookedRanges.filter((reservation) => {
    return reservation.status === 'probíhá';
  });
  const accepted = bookedRanges.filter((reservation) => {
    return reservation.status === 'schváleno';
  });
  const waiting = bookedRanges.filter((reservation) => {
    return reservation.status === 'neschváleno';
  });
  const [activeTab, setActiveTab] = useState('active');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const getReservations = () => {
    switch (activeTab) {
      case 'active':
        return active;
      case 'accepted':
        return accepted;
      case 'waiting':
        return waiting;
      default:
        return active;
    }
  };

  const selectedReservations = getReservations();

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const TabButton = ({ status, children }) => {
    return (
      <button
        onClick={() => handleTabChange(status)}
        className={`${activeTab === status ? 'bg-black-950 text-white-50 hover:bg-black-950 dark:bg-white-50 dark:text-black-950 dark:hover:bg-white-50' : 'hover:bg-gray-100 dark:hover:bg-gray-700'} rounded-full border-2 px-4 py-2 font-bold transition-colors`}
      >
        {children}
      </button>
    );
  };

  return (
    <>
      <Head title={equipment.name} />

      <Modal isOpen={showModal} onClose={handleCloseModal} closeButtonOnly={true}>
        <BookingCalendar
          bookedRanges={bookedRanges}
          daysDisabled={disabledDays}
          equipment={equipment}
        />
      </Modal>

      <div className="container">
        <div>
          <GoBackBtn
            classes={
              'mb-4 inline-flex items-center gap-1 rounded-lg font-bold transition-all hover:gap-3'
            }
          >
            <ArrowLeftIcon className="inline-flex size-4 fill-white-50" />
            Zpět
          </GoBackBtn>
        </div>
        <section className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <img
              className="max-h-[450px] w-full rounded-md object-cover shadow"
              src={equipment.image_path || '/images/no-image.jpg'}
              alt={equipment.name}
            />
          </div>

          <div className="flex flex-1 flex-col justify-between gap-8">
            <div className="flex flex-col gap-4">
              <div>
                <p className="flex items-center gap-1 font-medium text-gray-700 dark:text-gray-400">
                  <TagIcon className="size-4" />
                  <span>
                    {category ? category.name : 'nezařazeno'} &bull; {equipment.manufacturer}
                  </span>
                </p>
                <h1 className="fluid-text-4 font-bold leading-none">{equipment.name}</h1>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1 text-nowrap rounded-md bg-gray-200 px-4 py-1 dark:bg-gray-800">
                  <MapPinIcon className="size-4" />
                  {equipment.room}
                </div>

                <div className="flex items-center gap-1 text-nowrap rounded-md bg-gray-200 px-4 py-1 dark:bg-gray-800">
                  <AcademicCapIcon className="size-4" />
                  {equipment.owner}
                </div>
              </div>

              <p>{equipment.description}</p>
            </div>

            <button
              onClick={handleShowModal}
              className="rounded-lg bg-green-700 px-4 py-2 font-bold text-white-50 transition-colors hover:bg-green-600"
            >
              Rezervovat
            </button>
          </div>
        </section>

        <section className="mt-4">
          <h2 className="fluid-text-3 font-bold">Rezervace</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <TabButton status="active">Probíhající ({active.length})</TabButton>
            <TabButton status="accepted">Nadcházející ({accepted.length})</TabButton>
            <TabButton status="waiting">Neschválené ({waiting.length})</TabButton>
          </div>

          {selectedReservations.length > 0 ? (
            <ul className="mt-4 flex flex-col gap-2">
              {selectedReservations.map((reservation) => (
                <li
                  className="flex items-start gap-2 rounded-md border p-4 shadow dark:border-gray-700 dark:bg-gray-800"
                  key={reservation.id}
                >
                  <ProfileIcon username={reservation.user_name} />
                  <div>
                    <h3 className="text-xl font-medium">{reservation.user_name}, 4.H</h3>
                    <p className="text-sm text-black-600 dark:text-white-950">
                      {format(new Date(reservation.start_date), 'dd.MM.yyyy')} -{' '}
                      {format(new Date(reservation.end_date), 'dd.MM.yyyy')}
                    </p>
                    <p>
                      {reservation.user_comment ? reservation.user_comment : 'Bez udání důvodu'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <NoResults message="Nic zde není" />
          )}
        </section>
      </div>
    </>
  );
};

export default Show;
