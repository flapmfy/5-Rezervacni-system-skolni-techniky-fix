import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useRoute } from 'ziggy-js';
import { debounce } from 'lodash';
import { truncate } from 'lodash';
import Pagination from '@/Components/Navigation/Pagination';
import NoResults from '@/Components/Misc/NoResults';
import ConfirmModal from '@/Components/ConfirmModal';
import Toggle from '@/Components/Controls/Toggle';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

function Index({ equipment, categories, filters, trashedCount }) {
  const route = useRoute();
  const [category, setCategory] = useState(filters.kategori || '');
  const [search, setSearch] = useState(filters.vyhledavani || '');
  const [showDeleted, setShowDeleted] = useState(filters.zobrazit_smazane || false);
  const [sortByPopularity, setSortByPopularity] = useState(filters.od_popularnich || false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);

  // funkce ktera provede vyhledani
  const updateFilters = (newFilters) => {
    router.get(
      route('admin.equipment.index'),
      { ...filters, ...newFilters },
      {
        preserveState: true,
        replace: true,
        preserveScroll: true,
        only: ['equipment', 'filters'],
      }
    );
  };

  // vyhledavani zacne az po ubehnuti 200ms
  const debouncedSearch = debounce((value) => {
    updateFilters({ vyhledavani: value || {} });
  }, 200);

  const handleSearchChange = (event) => {
    const newSearch = event.target.value;
    if (newSearch !== filters.vyhledavani) {
      setSearch(newSearch);
      debouncedSearch(newSearch);
    }
  };

  const handleShowDeletedChange = (event) => {
    const newShowDeleted = event.target.checked;
    if (newShowDeleted !== filters.zobrazit_smazane) {
      setShowDeleted(newShowDeleted);
      updateFilters({ zobrazit_smazane: newShowDeleted || {} });
    }
  };

  const handlePopularityChange = (event) => {
    const newPopularity = event.target.checked;
    if (newPopularity !== filters.od_popularnich) {
      setSortByPopularity(newPopularity);
      updateFilters({ od_popularnich: newPopularity || {} });
    }
  };

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    if (newCategory !== filters.kategorie) {
      setCategory(newCategory);
      updateFilters({ kategorie: newCategory || {} });
    }
  };

  const handleFilterReset = () => {
    if (filters.vyhledavani || filters.kategorie || filters.zobrazit_smazane || showDeleted) {
      setSearch('');
      setCategory('');
      setShowDeleted(false);
      router.get(route('admin.equipment.index'), {}, { only: ['equipment', 'filters'] });
    }
  };

  const handleDelete = (equipment) => {
    setEquipmentToDelete(equipment);
  };

  const handleConfirmDelete = () => {
    if (equipmentToDelete) {
      router.delete(route('admin.equipment.delete', { id: equipmentToDelete }), {
        preserveScroll: true,
        preserveState: true,
      });
      setEquipmentToDelete(null);
    }
  };

  return (
    <>
      <Head title="Vybavení" />
      <ConfirmModal
        isOpen={!!equipmentToDelete}
        onClose={() => setEquipmentToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Odstranit vybavení"
      >
        <div className="space-y-4">
          <p className="font-medium">Doopravdy chcete zrušit tuto rezervaci?</p>
          <div>
            <p className="mb-2 text-sm font-medium">Tato akce způsobí:</p>
            <ul className="list-disc space-y-2 pl-8">
              <li className="">Zneviditelnění vybavení pro žáky</li>
              <li className="">
                Odstranění{' '}
                <span className="font-semibold text-red-600">
                  {equipmentToDelete && equipmentToDelete.waiting_reservations_count}
                </span>{' '}
                neschválených rezervací
              </li>
              <li className="">
                Odstranění{' '}
                <span className="font-semibold text-red-600">
                  {equipmentToDelete && equipmentToDelete.active_reservations_count}
                </span>{' '}
                schválených rezervací
              </li>
            </ul>
          </div>
        </div>
      </ConfirmModal>

      <div className="container mb-4">
        <h1 className="fluid-text-4 font-bold">
          Vybavení <span className="text-gray-400">({equipment.total})</span>
        </h1>

        <div className="mt-4 flex flex-col gap-2">
          <div className="flex flex-wrap gap-4">
            <Toggle
              checked={showDeleted}
              onChange={handleShowDeletedChange}
              name="showDeleted"
              id="showDeleted"
              label={`Zobrazit smazané (${trashedCount})`}
            />

            <Toggle
              checked={sortByPopularity}
              onChange={handlePopularityChange}
              name="sortByPopularity"
              id="sortByPopularity"
              label={`Od nejpopulárnějších`}
            />
          </div>

          <div className="flex flex-1 flex-col justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex flex-1 rounded-md border border-gray-100 shadow dark:border-0">
                <div>
                  <label className="sr-only" htmlFor="category">
                    Kategorie
                  </label>
                  <select
                    onChange={handleCategoryChange}
                    className="h-[40px] cursor-pointer rounded-l-md p-2 hover:bg-gray-100 focus:outline-1 dark:bg-slate-800 dark:hover:bg-slate-700"
                    name="category"
                    autoComplete="off"
                    id="category"
                  >
                    <option value="">Kategorie</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative flex-1">
                  <label className="sr-only" htmlFor="search">
                    Vyhledat
                  </label>
                  <input
                    onChange={handleSearchChange}
                    className="w-full min-w-0 rounded-r-md border-l border-gray-500 p-2 hover:bg-gray-100 focus:outline-1 dark:bg-slate-800 dark:hover:bg-slate-700"
                    type="text"
                    name="search"
                    placeholder="Vyhledat"
                    id="search"
                    autoComplete="off"
                  />
                  <div className="pointer-events-none hidden md:block">
                    <MagnifyingGlassIcon className="absolute right-2 top-2 size-6" />
                  </div>
                </div>
              </div>

              <button
                aria-label="Resetovat filtry"
                name="resetFilters"
                onClick={handleFilterReset}
                className="bg-white rounded-md border border-gray-200 p-2 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <ArrowPathIcon className="size-6" />
              </button>
            </div>
            <Link
              href={route('admin.equipment.create')}
              className="btn w-full text-nowrap bg-green-600 text-center text-white-50 hover:bg-green-700 md:w-auto"
            >
              Přidat vybavení
            </Link>
          </div>
        </div>

        {!equipment.data.length ? (
          <NoResults message="Nic nenalezeno" />
        ) : (
          <>
            <div className="mt-4 overflow-x-auto rounded-lg border shadow dark:border-gray-700">
              <table className="w-full">
                <thead className="bg-green-600 text-left text-xs font-medium uppercase tracking-wider text-white-50 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3"></th>
                    <th className="px-6 py-3">Název</th>
                    <th className="px-6 py-3">Kategorie</th>
                    <th className="px-6 py-3">Počet</th>
                    <th className="px-6 py-3">Rezervace</th>
                    <th className="px-6 py-3">Přidáno</th>
                    <th className="px-6 py-3">Aktualizováno</th>
                    <th className="px-6 py-3">Akce</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                  {equipment.data.map((singleEquipment, index) => {
                    return (
                      <tr
                        key={singleEquipment.id}
                        className="text-gray-900 transition-colors hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800"
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {(equipment.current_page - 1) * equipment.per_page + index + 1}
                        </td>
                        <td className="whitespace-nowrap py-4 text-sm">
                          <img
                            className="h-12 w-12 rounded-md object-cover"
                            src={
                              singleEquipment.image_path
                                ? singleEquipment.image_path
                                : '/images/no-image.jpg'
                            }
                            alt={singleEquipment.name}
                          />
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {truncate(singleEquipment.name, { length: 15 })}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {singleEquipment.category
                            ? singleEquipment.category.name
                            : 'bez kategorie'}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {singleEquipment.quantity} ks
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {singleEquipment.reservations_count}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {format(singleEquipment.created_at, 'dd.MM.yyyy', { locale: cs })}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {format(singleEquipment.updated_at, 'dd.MM.yyyy', { locale: cs })}
                        </td>
                        <td className="mt-1 flex items-center gap-2 whitespace-nowrap px-6 py-4 text-sm">
                          <Link
                            title="Upravit"
                            href={route('admin.equipment.edit', singleEquipment.slug)}
                            label="Upravit vybavení/zobrazit detail"
                            className="inline-flex items-center justify-center rounded-full p-2 text-green-600 transition-colors hover:bg-green-100 hover:text-green-800 dark:text-green-400 dark:hover:bg-green-900 dark:hover:text-green-300"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Link>

                          {singleEquipment.deleted_at ? (
                            <Link
                              title="Obnovit"
                              href={route('admin.equipment.restore', singleEquipment.id)}
                              method="patch"
                              preserveScroll
                              label="Obnovit vybavení"
                              className="inline-flex items-center justify-center rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-300"
                            >
                              <ArrowPathIcon className="h-5 w-5" />
                            </Link>
                          ) : (
                            <button
                              title="Smazat"
                              onClick={() => handleDelete(singleEquipment)}
                              label="Smazat vybavení"
                              className="inline-flex items-center justify-center rounded-full p-2 text-red-600 transition-colors hover:bg-red-100 hover:text-red-800 dark:text-red-400 dark:hover:bg-red-900 dark:hover:text-red-300"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-center">
              <Pagination links={equipment.links} />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Index;
