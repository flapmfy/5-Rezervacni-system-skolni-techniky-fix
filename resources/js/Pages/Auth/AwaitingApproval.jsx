import CenteredLayout from '@/Layouts/CenteredLayout';
import Logo from '@/Components/Icons/Logo';
import { useRoute } from 'ziggy-js';
import { Head, useForm } from '@inertiajs/react';

const AwaitingApproval = () => {
  const route = useRoute();
  const { post, processing } = useForm();

  const resendEmail = (e) => {
    e.preventDefault();
    post(route('verification.send'));
  };

  return (
    <>
      <Head title="Neschváleno správcem" />
      <div className="drop-down w-full max-w-md rounded-lg bg-white-50 p-6 shadow-md dark:bg-gray-800">
        <div className="mb-4 flex flex-col items-center gap-1 text-2xl font-bold text-gray-800 dark:text-gray-200">
          <Logo className="size-12" />
          <p>Neschváleno správcem</p>
        </div>

        <div className="mb-6 text-center">
          <p className="text-gray-700 dark:text-gray-300">
            Vyčkejte na to, až správce schválí váš účet. Jakmile tak učiní, obdržíte email a budete moci používat systém.
          </p>
        </div>

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

AwaitingApproval.layout = (page) => <CenteredLayout>{page}</CenteredLayout>;

export default AwaitingApproval
