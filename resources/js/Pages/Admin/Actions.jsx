import { Head } from '@inertiajs/react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { useForm } from '@inertiajs/react';
const Actions = ({ defaultRoom, disabledDays }) => {
  const { data, setData, patch, processing, errors } = useForm({
    default_room: defaultRoom || '',
    disabled_days: disabledDays || '',
  });

  const submit = (e) => {
    e.preventDefault();
    patch(route('admin.actions.update'));
  };

  const handleDisabledDaysChange = (e) => {
    const value = e.target.value;

    // Dovolíme pouze čísla 1-5 a čárky
    if (/^[1-5,]*$/.test(value) || value === '') {
      setData('disabled_days', value);
    }
  };

  const actions = [
    {
      id: 1,
      name: 'Neschválené rezervace',
      description: 'Rezervace, které nebudou všas schváleny, budou automaticky odstraněny.',
      interval: 'každý den',
    },
    {
      id: 2,
      name: 'Nevyzvednuté rezervace',
      description:
        'Vybavení, které si žák včas nevyzvedne, bude odstraněno, aby si ho mohli rezervovat ostatní.',
      interval: 'každý den',
    },
    {
      id: 3,
      name: 'Historie',
      description: 'Historie rezervací bude promazána každé 4 roky, aby nepřekážely v databázi.',
      interval: 'každé 4 roky',
    },
  ];

  return (
    <div className="container mb-6">
      <Head title="Nastavení a akce" />
      <h1 className="fluid-text-4 font-bold">Akce</h1>

      <p className="fluid-text-0 pb-4">Seznam akcí, které jsou automaticky provedeny</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {actions.map((action) => (
          <div
            key={action.id}
            className="darkk:bg-gray-900 flex flex-col items-start gap-2 rounded-md border p-4 shadow-md dark:border-gray-700"
          >
            <h2 className="fluid-text-2 font-medium">{action.name}</h2>
            <p>{action.description}</p>
            <div className="flex items-center gap-2 rounded-md bg-gray-200 px-4 py-2 font-medium dark:bg-gray-800">
              <ClockIcon className="inline-block size-4" /> <span>{action.interval}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Actions;
