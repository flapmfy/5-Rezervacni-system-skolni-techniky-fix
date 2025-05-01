import { Head, useForm } from '@inertiajs/react';
import { useRoute } from 'ziggy-js';

const Profile = ({ defaultRoom }) => {
  const route = useRoute();
  
  // Form pro aktualizaci třídy
  const { data, setData, patch, processing: profileProcessing, errors: profileErrors } = useForm({
    default_room: defaultRoom || '',
  });

  // Form pro změnu hesla
  const { data: passwordData, setData: setPasswordData, post, processing: passwordProcessing, errors: passwordErrors, reset } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  // Submit pro aktualizaci třídy
  function submitProfile(e) {
    e.preventDefault();
    patch(route('profile.update'));
  }

  // Submit pro změnu hesla
  function submitPassword(e) {
    e.preventDefault();
    post(route('profile.password.update'), {
      onSuccess: () => {
        reset('current_password', 'password', 'password_confirmation');
      },
    });
  }

  return (
    <div className="container mb-6">
      <Head title="Profil uživatele" />
      <h1 className="fluid-text-4 mb-6 font-bold">Profil uživatele</h1>

      {/* Nastavení třídy */}
      <form onSubmit={submitProfile} className="mb-8 space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="p-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium dark:text-white">Vaše třída</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Nastavte třídu, do které chodíte
                </p>
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  id="default_room"
                  value={data.default_room}
                  onChange={(e) => setData('default_room', e.target.value)}
                  placeholder="Název třídy"
                  autoComplete="off"
                  className="input w-full"
                />
                {profileErrors.default_room && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {profileErrors.default_room}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tlačítko pro uložení profilu */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={profileProcessing}
            className={`btn px-6 py-2 font-medium text-white-50 shadow-sm ${
              profileProcessing ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {profileProcessing ? 'Odesílání...' : 'Uložit změny'}
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

export default Profile;
