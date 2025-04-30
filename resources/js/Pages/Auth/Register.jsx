import CenteredLayout from '@/Layouts/CenteredLayout';
import Logo from '@/Components/Icons/Logo';
import { useRoute } from 'ziggy-js';
import { Head, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

const Register = () => {
  const route = useRoute();
  const { data, setData, post, processing, errors } = useForm({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    first_name: '',
    last_name: '',
    role: 'student',
    default_room: '',
  });

  // Clear default_room if role is changed to student
  useEffect(() => {
    if (data.role === 'student') {
      setData('default_room', '');
    }
  }, [data.role]);

  function submit(e) {
    e.preventDefault();
    post(route('register.post'));
  }

  return (
    <>
      <Head title="Registrace" />
      <div className="drop-down w-full max-w-xl rounded-lg bg-white-50 p-6 shadow-md dark:bg-gray-800">
        <div className="mb-6 flex flex-col items-center gap-1 text-2xl font-bold text-gray-800 dark:text-gray-200">
          <Logo className="size-12" />
          <p>Registrace</p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* First name field */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="first_name"
                className="block font-medium text-gray-700 dark:text-gray-300"
              >
                Jméno
              </label>
              <input
                value={data.first_name}
                onChange={(e) => setData('first_name', e.target.value)}
                type="text"
                id="first_name"
                className="input"
                placeholder="Zadejte jméno"
              />
              {errors.first_name && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.first_name}
                </p>
              )}
            </div>

            {/* Last name field */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="last_name"
                className="block font-medium text-gray-700 dark:text-gray-300"
              >
                Příjmení
              </label>
              <input
                value={data.last_name}
                onChange={(e) => setData('last_name', e.target.value)}
                type="text"
                id="last_name"
                className="input"
                placeholder="Zadejte příjmení"
              />
              {errors.last_name && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.last_name}
                </p>
              )}
            </div>
          </div>

          {/* Username field */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="username"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Uživatelské jméno
            </label>
            <input
              value={data.username}
              onChange={(e) => setData('username', e.target.value)}
              type="text"
              id="username"
              className="input"
              placeholder="Zadejte uživatelské jméno"
              autoComplete="username"
            />
            {errors.username && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.username}
              </p>
            )}
          </div>

          {/* Email field */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              type="email"
              id="email"
              className="input"
              placeholder="Zadejte email"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Password field */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="block font-medium text-gray-700 dark:text-gray-300"
              >
                Heslo
              </label>
              <input
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                type="password"
                id="password"
                className="input"
                placeholder="Zadejte heslo"
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Password confirmation field */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="password_confirmation"
                className="block font-medium text-gray-700 dark:text-gray-300"
              >
                Potvrzení hesla
              </label>
              <input
                value={data.password_confirmation}
                onChange={(e) =>
                  setData('password_confirmation', e.target.value)
                }
                type="password"
                id="password_confirmation"
                className="input"
                placeholder="Potvrďte heslo"
                autoComplete="new-password"
              />
              {errors.password_confirmation && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.password_confirmation}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Role selection */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="role"
                className="block font-medium text-gray-700 dark:text-gray-300"
              >
                Role
              </label>
              <select
                value={data.role}
                onChange={(e) => setData('role', e.target.value)}
                id="role"
                className="input cursor-pointer"
              >
                <option value="student">Student</option>
                <option value="admin">Administrátor</option>
              </select>
              {errors.role && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.role}
                </p>
              )}
            </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="default_room"
                  className="block font-medium text-gray-700 dark:text-gray-300"
                >
                  {data.role === 'admin' ? 'Místo výdeje' : 'Třída'}
                </label>
                <input
                  value={data.default_room}
                  onChange={(e) => setData('default_room', e.target.value)}
                  type="text"
                  id="default_room"
                  className="input"
                  placeholder={`${
                    data.role === 'admin'
                      ? '0000'
                      : 'X.X'
                  }`}
                />
                {errors.default_room && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.default_room}
                  </p>
                )}
              </div>
          </div>

          <div className="mt-4">
            <button
              disabled={processing}
              type="submit"
              className="w-full rounded-lg bg-green-700 px-4 py-2 text-white-50 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-opacity-75 focus:ring-white"
            >
              Registrovat se
            </button>
          </div>

          <div className="text-center text-sm">
            <a
              href={route('login')}
              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
            >
              Máte účet? Přihlaste se
            </a>
          </div>
        </form>
      </div>
    </>
  );
};

Register.layout = (page) => <CenteredLayout>{page}</CenteredLayout>;

export default Register;
