import { useRoute } from 'ziggy-js';
import { Head, useForm, Link } from '@inertiajs/react';
import Breadcrumbs from '@/Components/Navigation/AdminBreadcrumbs';
import NoResults from '@/Components/Misc/NoResults';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { truncate } from 'lodash';
import { ArrowTopRightOnSquareIcon, PencilIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

const Update = ({
  category,
  userEquipment,
  equipmentCount,
  createdBy,
  updatedBy,
  createdAt,
  updatedAt,
}) => {
  const route = useRoute();
  const {
    data,
    setData,
    patch,
    delete: destroy,
    processing,
    errors,
    progress,
  } = useForm({
    categoryName: category.name,
  });

  const breadcrumbs = [
    { href: 'admin.categories.index', label: 'Kategorie' },
    { href: null, label: `${category.name}` },
  ];

  const handleUpdate = (e) => {
    e.preventDefault();
    patch(route('admin.categories.update', { id: category.id }));
  };

  const handleDelete = (e) => {
    e.preventDefault();
    destroy(route('admin.categories.delete', { id: category.id }));
  };

  return (
    <>
      <Head title="Změna kategorie" />
      <div className="container py-4">
        <Breadcrumbs links={breadcrumbs} />
        <div className="mb-8 mt-6">
          <div className="flex flex-col gap-2 text-gray-800 md:flex-row md:gap-6 dark:text-gray-400">
            <p className="flex items-center gap-1">
              <PlusCircleIcon className="size-4" />
              {createdBy} <span>({format(createdAt, 'dd.MM.yyyy', { locale: cs })})</span>
            </p>
            {updatedBy && (
              <p className="flex items-center gap-1">
                <PencilIcon className="size-4" />
                {updatedBy} <span>({format(updatedAt, 'dd.MM.yyyy', { locale: cs })})</span>
              </p>
            )}
          </div>

          <h1 className="fluid-text-4 font-semibold leading-tight text-gray-800 dark:text-gray-100">
            Změna kategorie
          </h1>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2 md:flex-row">
            <label className="sr-only" htmlFor="categoryName">
              Název
            </label>
            <input
              name="categoryName"
              className="input w-full md:w-auto"
              onChange={(e) => setData('categoryName', e.target.value)}
              type="text"
              value={data.categoryName}
              id="categoryName"
              required
            />
            <div className="flex w-full gap-2">
              <button
                disabled={processing}
                className="btn flex-1 bg-green-600 text-white-50 hover:bg-green-700 md:flex-none"
                onClick={handleUpdate}
              >
                Uložit
              </button>
              <button
                disabled={equipmentCount !== 0 || processing}
                className="btn flex-1 bg-red-600 text-white-50 hover:bg-red-700 md:flex-none"
                onClick={handleDelete}
              >
                Odstranit
              </button>
            </div>
          </div>

          {errors.categoryName && <p className="text-red-500">{errors.categoryName}</p>}
        </div>

        <h2 className="fluid-text-3 mb-4 mt-12 font-semibold text-gray-800 dark:text-gray-100">
          Vaše vybavení ({userEquipment.length}/{equipmentCount})
        </h2>

        {userEquipment.length > 0 ? (
          <div className="mt-4 overflow-x-auto rounded-lg border shadow dark:border-gray-700">
            <table className="w-full">
              <thead className="bg-green-600 text-left text-xs font-medium uppercase tracking-wider text-white-50 dark:bg-gray-800 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3">Název</th>
                  <th className="px-6 py-3">Počet</th>
                  <th className="px-6 py-3">Přidáno</th>
                  <th className="px-6 py-3">Aktualizováno</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                {userEquipment.map((singleEquipment, index) => {
                  return (
                    <tr
                      key={singleEquipment.id}
                      className="text-gray-900 transition-colors hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm">{index + 1}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <Link
                          className="flex items-center gap-1 hover:text-green-600 hover:underline"
                          href={route('admin.equipment.edit', { slug: singleEquipment.slug })}
                        >
                          <ArrowTopRightOnSquareIcon className="size-4" />
                          {truncate(singleEquipment.name, { length: 25 })}
                        </Link>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {singleEquipment.quantity}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {format(singleEquipment.created_at, 'dd.MM.yyyy', { locale: cs })}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {format(singleEquipment.updated_at, 'dd.MM.yyyy', { locale: cs })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <NoResults message="Tato kategorie vámi nebyla zatím použita" />
        )}
      </div>
    </>
  );
};

export default Update;
