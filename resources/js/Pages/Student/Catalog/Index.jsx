import { useState, useEffect } from 'react';
import { Head, Link, router, Deferred } from '@inertiajs/react';
import { useRoute } from 'ziggy-js';
import { debounce } from 'lodash';
import Pagination from '@/Components/Navigation/Pagination';
import { Truncate } from '@re-dev/react-truncate';
import NoResults from '@/Components/Misc/NoResults';
import GridSkeleton from '@/Components/Misc/GridSkeleton';
import { differenceInDays } from 'date-fns';
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  HomeModernIcon,
  FunnelIcon,
  MapPinIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

function NewStatus({ dateCreated }) {
  if (differenceInDays(new Date(), dateCreated) < 7) {
    return (
      <div className="absolute left-4 top-4 rounded-3xl border border-black-300 bg-white-50 bg-opacity-20 px-2 py-1 font-bold text-black-950 backdrop-blur-sm">
        Novinka
      </div>
    );
  }
}

function Tag({ children }) {
  return (
    <div className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-700 dark:text-gray-300">
      {children}
    </div>
  );
}

const AvailabilityStatus = ({ status }) => {
  let color;
  let statusMessage;
  if (status === 1) {
    color = 'bg-green-500';
    statusMessage = 'volné';
  } else if (status === 2) {
    color = 'bg-yellow-500';
    statusMessage = 'obsazované';
  } else if (status === 3) {
    color = 'bg-red-500';
    statusMessage = 'nedostupné';
  } else {
    color = 'bg-gray-500';
    statusMessage = 'neznámo';
  }

  return (
    <Tag>
      <span>{statusMessage}</span>
      <div className={`size-2 rounded-full ${color}`}></div>
    </Tag>
  );
};

function Index({ equipment, equipmentCount, categories, filters }) {
  const route = useRoute();
  const [category, setCategory] = useState(filters.kategorie || '');
  const [search, setSearch] = useState(filters.vyhledavani || '');
  const [manufacturer, setManufacturer] = useState(filters.vyrobce || '');
  const [room, setRoom] = useState(filters.mistnost || '');
  const [availability, setAvailability] = useState(filters.dostupnost || '');
  const [sortBy, setSortBy] = useState(filters.razeni || 'name_asc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(filters.pouze_novinky === 'true');

  // Seznam výrobců a místností (získáme je z dostupných dat)
  const [manufacturers, setManufacturers] = useState([]);
  const [rooms, setRooms] = useState([]);

  // Extrahujeme všechny výrobce a místnosti z dat pro filtraci
  useEffect(() => {
    if (equipment && equipment.data) {
      // Získáme unikátní výrobce
      const uniqueManufacturers = [...new Set(equipment.data.map((item) => item.manufacturer))];
      setManufacturers(uniqueManufacturers);

      // Získáme unikátní místnosti
      const uniqueRooms = [...new Set(equipment.data.map((item) => item.room))];
      setRooms(uniqueRooms);
    }
  }, [equipment]);

  // funkce ktera provede vyhledani
  const updateFilters = (newFilters) => {
    router.get(
      route('equipment.index'),
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

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    if (newCategory !== filters.kategorie) {
      setCategory(newCategory);
      updateFilters({ kategorie: newCategory || {} });
    }
  };

  const handleManufacturerChange = (event) => {
    const newManufacturer = event.target.value;
    if (newManufacturer !== filters.vyrobce) {
      setManufacturer(newManufacturer);
      updateFilters({ vyrobce: newManufacturer || {} });
    }
  };

  const handleRoomChange = (event) => {
    const newRoom = event.target.value;
    if (newRoom !== filters.mistnost) {
      setRoom(newRoom);
      updateFilters({ mistnost: newRoom || {} });
    }
  };

  const handleAvailabilityChange = (event) => {
    const newAvailability = event.target.value;
    if (newAvailability !== filters.dostupnost) {
      setAvailability(newAvailability);
      updateFilters({ dostupnost: newAvailability || {} });
    }
  };

  const handleSortChange = (event) => {
    const newSortBy = event.target.value;
    if (newSortBy !== filters.razeni) {
      setSortBy(newSortBy);
      updateFilters({ razeni: newSortBy || {} });
    }
  };

  const handleNewOnlyChange = (event) => {
    const checked = event.target.checked;
    setShowNewOnly(checked);
    updateFilters({ pouze_novinky: checked ? 'true' : {} });
  };

  const handleFilterReset = () => {
    if (
      category ||
      search ||
      manufacturer ||
      room ||
      availability ||
      sortBy !== 'name_asc' ||
      showNewOnly ||
      filters.vyhledavani ||
      filters.kategorie ||
      filters.vyrobce ||
      filters.mistnost ||
      filters.dostupnost ||
      filters.razeni ||
      filters.pouze_novinky === 'true'
    ) {
      setSearch('');
      setCategory('');
      setManufacturer('');
      setRoom('');
      setAvailability('');
      setSortBy('name_asc');
      setShowNewOnly(false);
      router.get(route('equipment.index'), {}, { only: ['equipment', 'filters'] });
    }
  };

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const toggleSortOptions = () => {
    setShowSortOptions(!showSortOptions);
  };

  return (
    <div className="container">
      <Head title="Katalog" />
      <h1 className="fluid-text-4 font-bold">Vítej v katalogu!</h1>

      <section className="mt-4 flex flex-col items-center gap-4 md:flex-row">
        <div className="flex w-full min-w-0 flex-1 rounded-md border border-gray-100 shadow-md dark:border-0">
          <div>
            <label className="sr-only" htmlFor="category">
              Kategorie
            </label>
            <select
              onChange={handleCategoryChange}
              value={category}
              className="h-[40px] rounded-l-md p-2 hover:bg-gray-100 focus:outline-1 dark:bg-slate-800 dark:hover:bg-slate-700"
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
          <div className="relative min-w-0 flex-1">
            <label className="sr-only" htmlFor="search">
              Vyhledat
            </label>
            <input
              onChange={handleSearchChange}
              value={search}
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
          aria-label="Filtrovat"
          name="toggleFilters"
          title="Filtry"
          onClick={toggleAdvancedFilters}
          className={`${showAdvancedFilters ? 'bg-green-600 text-white-50' : 'bg-white-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700'} flex w-full justify-center rounded-md p-2 shadow-md md:w-auto`}
        >
          <FunnelIcon className="size-6" />
        </button>
        <button
          aria-label="Řadit"
          title="Řazení"
          name="toggleSort"
          onClick={toggleSortOptions}
          className={`${showSortOptions ? 'bg-green-600 text-white-50' : 'bg-white-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700'} flex w-full justify-center rounded-md p-2 shadow-md md:w-auto`}
        >
          <AdjustmentsHorizontalIcon className="size-6" />
        </button>
        <button
          aria-label="Resetovat filtry"
          name="resetFilters"
          title="Resetovat filtry"
          onClick={handleFilterReset}
          className="bg-white flex w-full justify-center rounded-md p-2 shadow-md hover:bg-gray-100 md:w-auto dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          <ArrowPathIcon className="size-6" />
        </button>
      </section>

      {/* Rozšířené filtry */}
      {showAdvancedFilters && (
        <section className="bg-white mt-4 rounded-md border border-gray-100 p-4 shadow-md dark:border-0 dark:bg-slate-800">
          <h2 className="mb-3 text-lg font-bold">Rozšířené filtry</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <label htmlFor="manufacturer" className="mb-1 block text-sm font-medium">
                Výrobce
              </label>
              <select
                id="manufacturer"
                name="manufacturer"
                value={manufacturer}
                onChange={handleManufacturerChange}
                className="w-full rounded-md border border-gray-300 p-2 hover:bg-gray-100 focus:outline-1 dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                <option value="">Všichni výrobci</option>
                {manufacturers.map((mfr, index) => (
                  <option key={index} value={mfr}>
                    {mfr}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="room" className="mb-1 block text-sm font-medium">
                Místnost
              </label>
              <select
                id="room"
                name="room"
                value={room}
                onChange={handleRoomChange}
                className="w-full rounded-md border border-gray-300 p-2 hover:bg-gray-100 focus:outline-1 dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                <option value="">Všechny místnosti</option>
                {rooms.map((r, index) => (
                  <option key={index} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="availability" className="mb-1 block text-sm font-medium">
                Dostupnost
              </label>
              <select
                id="availability"
                name="availability"
                value={availability}
                onChange={handleAvailabilityChange}
                className="w-full rounded-md border border-gray-300 p-2 hover:bg-gray-100 focus:outline-1 dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                <option value="">Vše</option>
                <option value="1">Volné</option>
                <option value="2">Obsazované</option>
                <option value="3">Nedostupné</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              id="newOnly"
              name="newOnly"
              checked={showNewOnly}
              onChange={handleNewOnlyChange}
              className="size-4 rounded-sm border-gray-300 focus:ring-2 focus:ring-green-500"
            />
            <label htmlFor="newOnly" className="ml-2 text-sm">
              Zobrazit pouze novinky (posledních 7 dní)
            </label>
          </div>
        </section>
      )}

      {/* Možnosti řazení */}
      {showSortOptions && (
        <section className="bg-white mt-4 rounded-md border border-gray-100 p-4 shadow-md dark:border-0 dark:bg-slate-800">
          <h2 className="mb-3 text-lg font-bold">Řazení</h2>
          <div>
            <div className="flex flex-col gap-4 md:flex-row">
              <label className="flex cursor-pointer select-none items-center gap-2 rounded border-2 border-gray-300 px-4 py-2 transition-colors hover:bg-gray-200 has-[input:checked]:border-green-600 has-[input:checked]:bg-green-600 has-[input:checked]:text-white-50 dark:border-gray-500 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  name="sort"
                  value="name_asc"
                  checked={sortBy === 'name_asc'}
                  onChange={handleSortChange}
                  className="hidden"
                />
                Název (A-Z)
              </label>
              <label className="flex cursor-pointer select-none items-center gap-2 rounded border-2 border-gray-300 px-4 py-2 transition-colors hover:bg-gray-200 has-[input:checked]:border-green-600 has-[input:checked]:bg-green-600 has-[input:checked]:text-white-50 dark:border-gray-500 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  name="sort"
                  value="name_desc"
                  checked={sortBy === 'name_desc'}
                  onChange={handleSortChange}
                  className="hidden"
                />
                Název (Z-A)
              </label>
              <label className="flex cursor-pointer select-none items-center gap-2 rounded border-2 border-gray-300 px-4 py-2 transition-colors hover:bg-gray-200 has-[input:checked]:border-green-600 has-[input:checked]:bg-green-600 has-[input:checked]:text-white-50 dark:border-gray-500 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  name="sort"
                  value="date_desc"
                  checked={sortBy === 'date_desc'}
                  onChange={handleSortChange}
                  className="hidden"
                />
                Nejnovější
              </label>
              <label className="flex cursor-pointer select-none items-center gap-2 rounded border-2 border-gray-300 px-4 py-2 transition-colors hover:bg-gray-200 has-[input:checked]:border-green-600 has-[input:checked]:bg-green-600 has-[input:checked]:text-white-50 dark:border-gray-500 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  name="sort"
                  value="date_asc"
                  checked={sortBy === 'date_asc'}
                  onChange={handleSortChange}
                  className="hidden"
                />
                Nejstarší
              </label>
            </div>
          </div>
        </section>
      )}

      {/* Aktivní filtry */}
      {(category ||
        search ||
        manufacturer ||
        room ||
        availability ||
        sortBy !== 'name_asc' ||
        showNewOnly) && (
        <section className="bg-white mt-4 rounded-md border border-gray-100 p-2 px-4 shadow-md dark:border-0 dark:bg-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">Aktivní filtry:</span>
            {category && (
              <Tag>Kategorie: {categories.find((c) => c.slug === category)?.name || category}</Tag>
            )}
            {search && <Tag>Hledání: {search}</Tag>}
            {manufacturer && <Tag>Výrobce: {manufacturer}</Tag>}
            {room && <Tag>Místnost: {room}</Tag>}
            {availability && (
              <Tag>
                Dostupnost:{' '}
                {availability === '1'
                  ? 'Volné'
                  : availability === '2'
                    ? 'Obsazované'
                    : availability === '3'
                      ? 'Nedostupné'
                      : ''}
              </Tag>
            )}
            {sortBy !== 'name_asc' && (
              <Tag>
                Řazení:{' '}
                {sortBy === 'name_desc'
                  ? 'Název (Z-A)'
                  : sortBy === 'date_desc'
                    ? 'Nejnovější'
                    : sortBy === 'date_asc'
                      ? 'Nejstarší'
                      : ''}
              </Tag>
            )}
            {showNewOnly && <Tag>Pouze novinky</Tag>}
          </div>
        </section>
      )}

      <Deferred
        data="equipment"
        fallback={<GridSkeleton cardWidth="250px" count={equipmentCount} className="mt-8" />}
      >
        {equipment === undefined || equipment.data.length === 0 ? (
          <NoResults message="Nic nenalezeno" />
        ) : (
          <section>
            <div className="equipment-grid mt-8">
              {equipment.data.map((singleEquipment) => (
                <Link
                  prefetch
                  cacheFor={5000}
                  key={singleEquipment.id}
                  href={route('equipment.show', singleEquipment.slug)}
                  className="equipment-card focus:outline-6 bg-white relative rounded-lg border border-gray-100 p-2 shadow-md transition-all hover:scale-[1.02] hover:bg-gray-100 focus:outline-green-700 dark:border-0 dark:bg-gray-800 dark:shadow-none dark:hover:bg-gray-900"
                >
                  <NewStatus dateCreated={singleEquipment.created_at} />
                  <img
                    src={singleEquipment.image_path || '/images/no-image.jpg'}
                    alt={singleEquipment.name}
                    className="h-60 w-full rounded-md object-cover md:h-56"
                  />
                  <div className="equipment-card__description">
                    <h2 className="mt-1 text-xl font-bold">
                      <Truncate lines={2}>{singleEquipment.name}</Truncate>
                    </h2>
                    <p className="text-sm text-black-700 dark:text-gray-300">
                      <Truncate lines={2}>{singleEquipment.description}</Truncate>
                    </p>
                    <div className="flex flex-wrap items-start justify-start gap-2">
                      <Tag>
                        <HomeModernIcon className="size-4" />
                        {singleEquipment.manufacturer}
                      </Tag>
                      {singleEquipment.room && (
                        <Tag>
                          {' '}
                          <MapPinIcon className="size-4" />
                          {singleEquipment.room}
                        </Tag>
                      )}
                      <AvailabilityStatus status={singleEquipment.availability} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Pagination links={equipment.links} />
            </div>
          </section>
        )}
      </Deferred>
    </div>
  );
}

export default Index;
