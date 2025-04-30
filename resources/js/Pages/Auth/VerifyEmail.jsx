import CenteredLayout from '@/Layouts/CenteredLayout';
import Logo from '@/Components/Icons/Logo';
import { useRoute } from 'ziggy-js';
import { Head, useForm } from '@inertiajs/react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

const VerifyEmail = () => {
  const route = useRoute();
  const { post, processing } = useForm();

  const resendEmail = (e) => {
    e.preventDefault();
    post(route('verification.send'));
  };

  return (
    <>
      <Head title="Ověření emailu" />
      <div className="drop-down w-full max-w-md rounded-lg bg-white-50 p-6 shadow-md dark:bg-gray-800">
        <div className="mb-8 flex flex-col items-center gap-1 text-2xl font-bold text-gray-800 dark:text-gray-200">
          <Logo className="size-12" />
          <p>Ověření emailu</p>
        </div>

        <div className="mb-6 text-center">
          <EnvelopeIcon className="mx-auto mb-4 h-12 w-12 text-green-500" />
          <p className="text-gray-700 dark:text-gray-300">
            Na váš email byl odeslán ověřovací odkaz. Prosím klikněte na něj pro
            dokončení registrace.
          </p>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Pokud jste email neobdrželi, můžete si jej nechat poslat znovu.
          </p>
        </div>

        <button
          onClick={resendEmail}
          disabled={processing}
          className="focus:ring-white w-full rounded-lg bg-green-700 px-4 py-2 text-white-50 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-opacity-75"
        >
          Odeslat znovu
        </button>

        <div className="mt-4 text-center text-sm">
          <a
            href={route('auth.logout')}
            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
          >
            Odhlásit se
          </a>
        </div>
      </div>
    </>
  );
};

VerifyEmail.layout = (page) => <CenteredLayout>{page}</CenteredLayout>;

export default VerifyEmail;
