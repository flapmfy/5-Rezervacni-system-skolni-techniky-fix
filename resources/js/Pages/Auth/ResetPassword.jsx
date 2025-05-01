import CenteredLayout from '@/Layouts/CenteredLayout';
import Logo from '@/Components/Icons/Logo';
import { useRoute } from 'ziggy-js';
import { Head, useForm } from '@inertiajs/react';
import { EnvelopeIcon, KeyIcon } from '@heroicons/react/24/outline';

const ResetPassword = ({ token, email }) => {
  const route = useRoute();
  const { data, setData, post, processing, errors } = useForm({
    token: token,
    email: email || '',
    password: '',
    password_confirmation: '',
  });

  function submit(e) {
    e.preventDefault();
    post(route('password.update'));
  }

  return (
    <>
      <Head title="Obnovení hesla" />
      <form
        onSubmit={submit}
        className="drop-down w-full max-w-[450px] rounded-lg bg-white-50 p-6 shadow-md dark:bg-gray-800"
      >
        <div className="mb-8 flex flex-col items-center gap-1 text-2xl font-bold text-gray-800 dark:text-gray-200">
          <Logo className="size-12" />
          <p>Obnovení hesla</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <input
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              type="email"
              id="email"
              className={`${
                errors.email
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              } peer w-full border-b-2 bg-transparent py-2 text-gray-700 placeholder-transparent transition-all duration-300 focus:border-green-500 focus:outline-none dark:text-gray-300 dark:focus:border-green-400`}
              placeholder="E-mail"
              autoComplete="email"
            />

            {errors.email && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.email}
              </p>
            )}

            <EnvelopeIcon
              className="absolute right-0 top-2 h-5 w-5 text-gray-400 peer-focus:text-green-500 dark:peer-focus:text-green-400"
              aria-hidden="true"
            />

            <label
              htmlFor="email"
              className="absolute left-0 top-2 select-none text-sm text-gray-600 transition-all duration-150 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-green-500 peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-xs dark:text-gray-400"
            >
              E-mailová adresa
            </label>
          </div>

          <div className="relative mt-2">
            <input
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              type="password"
              id="password"
              className={`${
                errors.password
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              } peer w-full border-b-2 bg-transparent py-2 text-gray-700 placeholder-transparent transition-all duration-300 focus:border-green-500 focus:outline-none dark:text-gray-300 dark:focus:border-green-400`}
              placeholder="Heslo"
            />

            {errors.password && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.password}
              </p>
            )}

            <KeyIcon
              className="absolute right-0 top-2 h-5 w-5 text-gray-400 peer-focus:text-green-500 dark:peer-focus:text-green-400"
              aria-hidden="true"
            />

            <label
              htmlFor="password"
              className="absolute left-0 top-2 select-none text-sm text-gray-600 transition-all duration-150 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-green-500 peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-xs dark:text-gray-400"
            >
              Nové heslo
            </label>
          </div>

          <div className="relative mt-2">
            <input
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              type="password"
              id="password_confirmation"
              className={`peer w-full border-b-2 bg-transparent py-2 text-gray-700 placeholder-transparent transition-all duration-300 focus:border-green-500 focus:outline-none dark:text-gray-300 dark:focus:border-green-400 border-gray-300 dark:border-gray-600`}
              placeholder="Potvrzení hesla"
            />

            <KeyIcon
              className="absolute right-0 top-2 h-5 w-5 text-gray-400 peer-focus:text-green-500 dark:peer-focus:text-green-400"
              aria-hidden="true"
            />

            <label
              htmlFor="password_confirmation"
              className="absolute left-0 top-2 select-none text-sm text-gray-600 transition-all duration-150 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-green-500 peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-xs dark:text-gray-400"
            >
              Potvrzení hesla
            </label>
          </div>
        </div>

        <button
          disabled={processing}
          type="submit"
          className="mt-6 w-full rounded-lg bg-green-700 px-4 py-2 text-white-50 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-opacity-75 focus:ring-white"
        >
          Obnovit heslo
        </button>

        <div className="mt-4 text-center text-sm">
          <a
            href={route('login')}
            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
          >
            Zpět na přihlášení
          </a>
        </div>
      </form>
    </>
  );
};

ResetPassword.layout = (page) => <CenteredLayout>{page}</CenteredLayout>;

export default ResetPassword;
