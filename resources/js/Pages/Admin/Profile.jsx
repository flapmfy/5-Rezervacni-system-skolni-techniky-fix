import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
const Actions = ({ defaultRoom, disabledDays }) => {
  const { data, setData, patch, processing, errors } = useForm({
    default_room: defaultRoom || '',
    disabled_days: disabledDays || '',
  });

  // Form pro změnu hesla
  const { data: passwordData, setData: setPasswordData, post, processing: passwordProcessing, errors: passwordErrors, reset } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const submit = (e) => {
    e.preventDefault();
    patch(route('admin.profile.update'));
  };

  const handleDisabledDaysChange = (e) => {
    const value = e.target.value;

    // Dovolíme pouze čísla 1-5 a čárky
    if (/^[1-5,]*$/.test(value) || value === '') {
      setData('disabled_days', value);
    }
  };

    // Submit pro změnu hesla
  function submitPassword(e) {
    e.preventDefault();
    post(route('admin.profile.password.update'), {
      onSuccess: () => {
        reset('current_password', 'password', 'password_confirmation');
      },
    });
  }

  return (
    <div className="container mb-6">
      <Head title="Nastavení a akce" />
      <h1 className="fluid-text-4 font-bold">Nastavení</h1>

      <form onSubmit={submit} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {/* Defaultní místnost */}
          <div className="border-b border-gray-200 p-5 dark:border-gray-700">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-1">
                <h3 className="dark:text-white text-lg font-medium">Defaultní místnost</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Tento údaj bude použit jako defaultní místnost při vytváření nového vybavení
                </p>
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  id="room"
                  value={data.default_room}
                  onChange={(e) => setData('default_room', e.target.value)}
                  placeholder="Název místnosti"
                  autoComplete="off"
                  className="input w-full"
                />
                {errors.default_room && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.default_room}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Dny nedostupnosti */}
          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-1">
                <h3 className="dark:text-white text-lg font-medium">Dny nedostupnosti</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Zadejte čísla dnů od 1 (pondělí) do 5 (pátek), oddělená čárkami
                </p>
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  id="disabled_days"
                  value={data.disabled_days}
                  onChange={handleDisabledDaysChange}
                  placeholder="1,3,5"
                  autoComplete="off"
                  className="input w-full"
                />
                {errors.disabled_days && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.disabled_days}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tlačítko pro uložení */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={processing}
            className={`btn px-6 py-2 font-medium text-white-50 shadow-sm ${
              processing ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {processing ? 'Odesílání...' : 'Uložit změny'}
          </button>
        </div>
      </form>

            {/* Změna hesla */}
      <h2 className="fluid-text-3 mb-4 font-semibold">Změna hesla</h2>
      <form onSubmit={submitPassword} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {/* Aktuální heslo */}
          <div className="border-b border-gray-200 p-5 dark:border-gray-700">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium dark:text-white">Současné heslo</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Zadejte své současné heslo pro ověření
                </p>
              </div>
              <div className="md:col-span-2">
                <input
                  type="password"
                  id="current_password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData('current_password', e.target.value)}
                  className="input w-full"
                />
                {passwordErrors.current_password && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {passwordErrors.current_password}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Nové heslo */}
          <div className="border-b border-gray-200 p-5 dark:border-gray-700">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium dark:text-white">Nové heslo</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Heslo musí obsahovat minimálně 8 znaků
                </p>
              </div>
              <div className="md:col-span-2">
                <input
                  type="password"
                  id="password"
                  value={passwordData.password}
                  onChange={(e) => setPasswordData('password', e.target.value)}
                  className="input w-full"
                />
                {passwordErrors.password && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {passwordErrors.password}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Potvrzení hesla */}
          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium dark:text-white">Potvrzení nového hesla</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Zadejte heslo znovu pro potvrzení
                </p>
              </div>
              <div className="md:col-span-2">
                <input
                  type="password"
                  id="password_confirmation"
                  value={passwordData.password_confirmation}
                  onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                  className="input w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tlačítko pro změnu hesla */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={passwordProcessing}
            className={`btn px-6 py-2 font-medium text-white-50 shadow-sm ${
              passwordProcessing ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {passwordProcessing ? 'Odesílání...' : 'Změnit heslo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Actions;
