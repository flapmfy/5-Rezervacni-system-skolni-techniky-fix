import { useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import Breadcrumbs from '@/Components/Navigation/AdminBreadcrumbs';

const Create = ({ categories, defaultRoom }) => {
  const [preview, setPreview] = useState(null);
  const { data, setData, post, processing, errors, progress } = useForm('CreateEquipment', {
    name: '',
    description: '',
    category_id: '',
    image: null,
    manufacturer: '',
    quantity: 1,
    room: defaultRoom || '',
  });

  const breadcrumbs = [
    { href: 'admin.equipment.index', label: 'Vybavení' },
    { href: null, label: `Nové vybavení` },
  ];

  const submit = (e) => {
    e.preventDefault();
    post(route('admin.equipment.store'));
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

  return (
    <>
      <Head title="Přidat vybavení" />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs links={breadcrumbs} />
        <h1 className="fluid-text-4 mb-4 font-semibold text-gray-800 dark:text-gray-100">
          Přidat vybavení
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
                  value={data.category_id}
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
                    min="1"
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
            <div className="">
              {preview ? (
                <img
                  className="h-[350px] w-full rounded-md border object-cover dark:border-gray-800"
                  src={preview}
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

          <button
            type="submit"
            disabled={processing}
            className={`btn rounded px-4 py-2 font-medium text-white-50 shadow-sm ${
              processing ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {processing ? 'Odesílání...' : 'Přidat vybavení'}
          </button>
          {progress && (
            <progress className="h-2 rounded bg-purple-500" value={progress.percentage} max="100">
              {progress.percentage}%
            </progress>
          )}
        </form>
      </div>
    </>
  );
};

export default Create;
