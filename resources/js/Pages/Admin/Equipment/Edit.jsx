import { useEffect, useState } from 'react';
import { useRoute } from 'ziggy-js';
import { Head, useForm, router } from '@inertiajs/react';
import Breadcrumbs from '@/Components/Navigation/AdminBreadcrumbs';
import ConfirmModal from '@/Components/ConfirmModal';
import {
  TrashIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  ClockIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline';

const Update = ({ categories, equipment, reservations }) => {
  const route = useRoute();
  const [preview, setPreview] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmModalSoft, setShowConfirmModalSoft] = useState(false);
  const { data, setData, put, post, processing, errors, progress } = useForm({
    name: equipment.name,
    description: equipment.description,
    category_id: equipment.category_id,
    image: '',
    manufacturer: equipment.manufacturer,
    quantity: equipment.quantity,
    room: equipment.room,
  });
  const waitingCount = reservations.filter((reservation) => {
    return reservation.status === 'neschváleno';
  }).length;
  const acceptedCount = reservations.filter((reservation) => {
    return reservation.status === 'schváleno';
  }).length;
  const activeCount = reservations.filter((reservation) => {
    return reservation.status === 'probíhá';
  }).length;
  const archivedCount = reservations.filter((reservation) => {
    return reservation.status === 'archivováno';
  }).length;

  const breadcrumbs = [
    { href: 'admin.equipment.index', label: 'Vybavení' },
    { href: null, label: `Změna vybavení` },
  ];

  const submit = (e) => {
    e.preventDefault();
    post(route('admin.equipment.update', { id: equipment.id }));
  };

  useEffect(() => {
    if (data.image) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreview(reader.result);
      };

      reader.readAsDataURL(data.image);
    }
  }, [data.image]);

  const handleDelete = (e) => {
    e.preventDefault();
    router.delete(route('admin.equipment.delete', { id: equipment.id }), {
      preserveScroll: true,
      preserveState: true,
    });
    setShowConfirmModalSoft(false);
  };

  const handleRestore = (e) => {
    e.preventDefault();
    router.patch(route('admin.equipment.restore', { id: equipment.id }), {
      preserveScroll: true,
      preserveState: true,
    });
  };

  const handlePermanentDelete = (e) => {
    e.preventDefault();
    router.delete(route('admin.equipment.forceDelete', { id: equipment.id }));
  };

  const handleModalOpen = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  return (
    <>
      <Head title={equipment.name} />
      <ConfirmModal
        isOpen={showConfirmModalSoft}
        onClose={() => setShowConfirmModalSoft(false)}
        onConfirm={handleDelete}
        title="Dočasně odstranit"
      >
        <div className="space-y-4">
          <p className="font-medium">Doopravdy chcete zrušit tuto rezervaci?</p>
          <div>
            <p className="mb-2 text-sm font-medium">Tato akce způsobí:</p>
            <ul className="list-disc space-y-2 pl-8">
              <li className="">Zneviditelnění vybavení pro žáky</li>
              <li className="">
                Odstranění <span className="font-semibold text-red-600">{waitingCount}</span>{' '}
                neschválených rezervací
              </li>
              <li className="">
                Odstranění <span className="font-semibold text-red-600">{acceptedCount}</span>{' '}
                schválených rezervací
              </li>
            </ul>
          </div>
        </div>
      </ConfirmModal>
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handlePermanentDelete}
        title="Trvale odstranit"
      >
        <p>
          Při trvalém odstranění vybavení budou smazány všechny rezervace vázané na toto vybavení a
          to včetně archivovaných.
        </p>
        <p>
          Celkem bude odstraněno{' '}
          <span className="font-semibold text-red-600">{reservations.length}</span> rezervací.
        </p>
      </ConfirmModal>

      <div className="container py-4">
        <Breadcrumbs links={breadcrumbs} />
        <h1 className="fluid-text-4 mb-4 font-semibold text-gray-800 dark:text-gray-100">
          Změnit vybavení{' '}
          {equipment.deleted_at && (
            <span className="text-black-700 dark:text-gray-500">(neaktivní)</span>
          )}
        </h1>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              {/* název */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="name"
                  className="block font-medium text-gray-700 dark:text-gray-300"
                >
                  Název
                </label>
                <input
                  type="text"
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  required
                  autoFocus
                  placeholder="Název vybavení"
                  autoComplete="off"
                  className="input"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>

              {/* kategorie */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="category_id"
                  className="block font-medium text-gray-700 dark:text-gray-300"
                >
                  Kategorie
                </label>
                <select
                  id="category_id"
                  value={data.category_id || ''}
                  onChange={(e) => setData('category_id', e.target.value)}
                  className="input cursor-pointer"
                >
                  <option value="">Nezařazeno</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.category_id}</p>
                )}
              </div>

              {/* místnost */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="room"
                  className="block font-medium text-gray-700 dark:text-gray-300"
                >
                  Místnost
                </label>
                <input
                  type="text"
                  id="room"
                  value={data.room}
                  onChange={(e) => setData('room', e.target.value)}
                  required
                  placeholder="Místnost vyzvednutí"
                  autoComplete="off"
                  className="input"
                />
                {errors.room && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.room}</p>
                )}
              </div>

              <div className="flex gap-2">
                {/* výrobce */}
                <div className="flex min-w-[100px] flex-grow flex-col gap-1">
                  <label
                    htmlFor="manufacturer"
                    className="block font-medium text-gray-700 dark:text-gray-300"
                  >
                    Výrobce
                  </label>
                  <input
                    placeholder="Výrobce"
                    type="text"
                    id="manufacturer"
                    value={data.manufacturer}
                    autoComplete="off"
                    onChange={(e) => setData('manufacturer', e.target.value)}
                    className="input"
                  />
                  {errors.manufacturer && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.manufacturer}</p>
                  )}
                </div>

                {/* počet kusů */}
                <div className="flex min-w-[60px] flex-grow flex-col gap-1">
                  <label
                    htmlFor="quantity"
                    className="block font-medium text-gray-700 dark:text-gray-300"
                  >
                    Počet kusů
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    min={1}
                    value={data.quantity}
                    onChange={(e) => setData('quantity', e.target.value)}
                    className="input"
                  />
                  {errors.quantity && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.quantity}</p>
                  )}
                </div>
              </div>

              {/* obrázek */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="image"
                  className="block font-medium text-gray-700 dark:text-gray-300"
                >
                  Obrázek
                </label>
                <input
                  type="file"
                  id="image"
                  onChange={(e) => setData('image', e.target.files[0])}
                  className="text-gray-700 dark:text-gray-200"
                  accept="image/*"
                />
                {errors.image && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.image}</p>
                )}
              </div>
            </div>
            <div>
              {preview || equipment.image_path ? (
                <img
                  className={`h-[350px] w-full rounded-md border object-cover dark:border-gray-800 ${equipment.deleted_at ? 'grayscale' : ''}`}
                  src={preview ? preview : equipment.image_path}
                  alt="Náhled obrázku"
                />
              ) : (
                <img
                  className="h-[350px] w-full rounded object-cover"
                  src="/images/no-image.jpg"
                  alt="Nebyl zvolen obrázek"
                />
              )}
              <p className="mt-1 text-center text-sm dark:text-gray-300">náhled obrázku</p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="description"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Popis
            </label>
            <textarea
              id="description"
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              className="input"
              rows="4"
              placeholder="Popis vybavení"
              required
            ></textarea>
            {errors.description && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.description}</p>
            )}
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            {equipment.deleted_at ? (
              <>
                <button
                  onClick={handleModalOpen}
                  className="btn flex items-center gap-1 rounded bg-red-600 px-4 py-2 font-medium text-white-50 shadow-sm hover:bg-red-700"
                >
                  <TrashIcon className="size-4" /> <span>Trvale odstranit</span>
                </button>

                <button
                  type="button"
                  onClick={handleRestore}
                  className="btn flex items-center gap-1 rounded bg-orange-600 px-4 py-2 font-medium text-white-50 shadow-sm hover:bg-orange-700"
                >
                  <ArrowPathIcon className="size-4" /> <span>Obnovit</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setShowConfirmModalSoft(true)}
                className="btn flex items-center gap-1 bg-red-600 font-medium text-white-50 shadow-sm hover:bg-red-700"
              >
                <TrashIcon className="size-4" /> <span>Odstranit</span>
              </button>
            )}

            <button
              type="submit"
              disabled={processing}
              className={`btn font-medium text-white-50 shadow-sm ${
                processing ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {processing ? 'Odesílání...' : 'Uložit změny'}
            </button>
          </div>
          {progress && (
            <progress className="h-2 rounded bg-purple-500" value={progress.percentage} max="100">
              {progress.percentage}%
            </progress>
          )}
        </form>

        <section className="mt-8 md:mt-4">
          <h2 className="fluid-text-2 mb-2 border-b border-gray-300 font-medium dark:border-gray-600">
            Vázané rezervace
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div className="flex items-center gap-4 rounded-lg border border-gray-300 p-4 shadow transition-colors dark:border-none dark:bg-gray-800">
              <ArrowPathIcon className="size-14 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Probíhající</p>
                <p className="fluid-text-4 font-bold">{activeCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-lg border border-gray-300 p-4 shadow transition-colors dark:border-none dark:bg-gray-800">
              <CheckBadgeIcon className="size-14 text-yellow-400" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Schválené</p>
                <p className="fluid-text-4 font-bold">{acceptedCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-lg border border-gray-300 p-4 shadow transition-colors dark:border-none dark:bg-gray-800">
              <ClockIcon className="size-14 text-orange-400" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Čekající</p>
                <p className="fluid-text-4 font-bold">{waitingCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-lg border border-gray-300 p-4 shadow transition-colors dark:border-none dark:bg-gray-800">
              <ArchiveBoxIcon className="size-14 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Historie</p>
                <p className="fluid-text-4 font-bold">{archivedCount}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Update;
