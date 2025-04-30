import { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useRoute } from 'ziggy-js';
import { debounce } from 'lodash';
import Pagination from '@/Components/Navigation/Pagination';
import Modal from '@/Components/Modal';
import NoResults from '@/Components/Misc/NoResults';
import Toggle from '@/Components/Controls/Toggle';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import ConfirmModal from '@/Components/ConfirmModal';
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

function Index({ categories, filters }) {
  const route = useRoute();
  const { data, setData, post, processing, errors, reset } = useForm({
    categoryName: '',
  });
  const [isOwner, setIsOwner] = useState(filters.isOwner || false);
  const [search, setSearch] = useState(filters.search || '');
  const [showModal, setShowModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // funkce ktera provede vyhledani
  const updateFilters = (newFilters) => {
    router.get(
      route('admin.categories.index'),
      { ...filters, ...newFilters },
      {
        preserveState: true,
        replace: true,
        preserveScroll: true,
        only: ['categories', 'filters'],
      }
    );
  };

  // vyhledavani zacne az po ubehnuti 200ms
  const debouncedSearch = debounce((value) => {
    updateFilters({ vyhledavani: value || {} });
  }, 200);

  const handleSearchChange = (event) => {
    const newSearch = event.target.value;
    if (newSearch !== filters.search) {
      setSearch(newSearch);
      debouncedSearch(newSearch);
    }
  };

  const handleOwnershipChange = (event) => {
    const newIsOwner = event.target.checked;
    if (newIsOwner !== filters.isOwner) {
      setIsOwner(newIsOwner);
      updateFilters({ jeVlastnik: newIsOwner || {} });
    }
    setIsOwner(event.target.checked);
  };

  const handleFilterReset = () => {
    if (category || search || filters.vyhledavani || filters.kategorie) {
      setSearch('');
      setIsOwner(false);
      router.get(route('admin.categories.index'), {}, { only: ['categories', 'filters'] });
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const createCategory = (e) => {
    e.preventDefault();
    post(route('admin.categories.create'), {
      onSuccess: () => {
        setShowModal(false);
        reset('categoryName');
      },
    });
  };

  const handleDelete = (category) => {
    setCategoryToDelete(category);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      router.delete(route('admin.categories.delete', { id: categoryToDelete }), {
        preserveScroll: true,
        preserveState: true,
      });
      setCategoryToDelete(null);
    }
  };

  return (
    <>
      <Head title="Kategorie" />

      <ConfirmModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Odstranit kategorii"
      >
        <div>Opravdu chcete smazat tuto kategorii?</div>
      </ConfirmModal>

      <Modal isOpen={showModal} onClose={handleCloseModal}>
        <form onSubmit={createCategory} className="flex flex-col gap-4">
          <label htmlFor="category" className="fluid-text-1 font-bold">
            Vytvořit kategorii
          </label>
          <input
            className="input"
            type="text"
            name="category"
            id="category"
            placeholder="název kategorie"
            autoComplete="off"
            autoFocus
            required
            value={data.categoryName}
            onChange={(e) => setData('categoryName', e.target.value)}
          />
          {errors.categoryName && <span className="text-red-500">{errors.categoryName}</span>}
          <button
            disabled={processing}
            className="btn bg-green-600 text-white-50 hover:bg-green-700"
          >
            Přidat
          </button>
        </form>
      </Modal>

      <div className="container">
        <h1 className="fluid-text-4 font-bold">
          Kategorie <span className="text-gray-400">({categories.total})</span>
        </h1>

        <div className="mt-4 flex flex-col gap-2">
          <Toggle
            checked={isOwner}
            onChange={handleOwnershipChange}
            name="isOwner"
            id="isOwner"
            label="mé kategorie"
          />

          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 md:max-w-[400px]">
                <label className="sr-only" htmlFor="search">
                  Vyhledat
                </label>
                <input
                  onChange={handleSearchChange}
                  className="w-full min-w-0 rounded-md border border-gray-200 p-2 shadow hover:bg-gray-100 focus:outline-1 dark:border-gray-700 dark:bg-slate-800 dark:hover:bg-slate-700"
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

              <button
                aria-label="Resetovat filtry"
                name="resetFilters"
                onClick={handleFilterReset}
                className="bg-white rounded-md border border-gray-200 p-2 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <ArrowPathIcon className="size-6" />
              </button>
            </div>

            <button
              onClick={handleShowModal}
              className="btn text-nowrap bg-green-600 text-white-50 hover:bg-green-700"
            >
              Přidat kategorii
            </button>
          </div>
        </div>

        {!categories.data.length ? (
          <NoResults message="Nic nenalezeno" />
        ) : (
          <>
            <div className="mt-4 overflow-x-auto rounded-lg border shadow dark:border-gray-700">
              <table className="w-full">
                <thead className="bg-green-600 text-left text-xs font-medium uppercase tracking-wider text-white-50 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">Název</th>
                    <th className="px-6 py-3">Počet výskytů</th>
                    <th className="px-6 py-3">Přidáno</th>
                    <th className="px-6 py-3">Aktualizováno</th>
                    <th className="px-6 py-3">Akce</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                  {categories.data.map((singleCategory, index) => {
                    return (
                      <tr
                        key={singleCategory.id}
                        className="text-gray-900 transition-colors hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800"
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {(categories.current_page - 1) * categories.per_page + index + 1}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {singleCategory.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {singleCategory.equipment_count}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {format(singleCategory.created_at, 'dd.MM.yyyy', { locale: cs })}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          {format(singleCategory.updated_at, 'dd.MM.yyyy', { locale: cs })}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <Link
                            title="Upravit"
                            href={route('admin.categories.edit', singleCategory.id)}
                            label="Upravit kategorii/zobrazit detail"
                            className="inline-flex items-center justify-center rounded-full p-2 text-green-600 transition-colors hover:bg-green-100 hover:text-green-800 dark:text-green-400 dark:hover:bg-green-900 dark:hover:text-green-300"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Link>
                          {singleCategory.equipment_count === 0 && (
                            <button
                              title="Smazat"
                              onClick={() => handleDelete(singleCategory.id)}
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
              <Pagination links={categories.links} />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Index;
