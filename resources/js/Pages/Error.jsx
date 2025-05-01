import { Head, usePage } from '@inertiajs/react';
import { useRoute } from 'ziggy-js';
import NoLayout from '@/Layouts/NoLayout';

function ErrorPage({ status }) {
  const route = useRoute();
  const { auth } = usePage().props;
  const title = {
    503: 'Služba není dostupná',
    500: 'Chyba serveru',
    404: 'Stránka nenalezena',
    403: 'Přístup zakázán',
  }[status];

  const description = {
    503: 'Omlouváme se, provádíme údržbu. Prosím, zkuste to později.',
    500: 'Jejda, něco se pokazilo na našich serverech.',
    404: 'Omlouváme se, hledaná stránka nebyla nalezena.',
    403: 'Omlouváme se, nemáte oprávnění k přístupu na tuto stránku.',
  }[status];

  return (
    <>
      <Head title={title} />

      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto w-full max-w-xl p-8">
          <div className="text-center">
            <div className="mb-3 font-mono text-9xl font-bold tracking-wider text-green-500">
              {status}
            </div>

            <h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              {title}
            </h1>

            <div className="text-lg text-gray-600 dark:text-gray-400">{description}</div>
          </div>
        </div>
      </div>
    </>
  );
}

ErrorPage.layout = (page) => <NoLayout>{page}</NoLayout>;

export default ErrorPage;
