import { format } from 'date-fns';
import { useRoute } from 'ziggy-js';
import { Link } from '@inertiajs/react';
import { truncate } from 'lodash';
import {
  TagIcon,
  ArchiveBoxIcon,
  RectangleStackIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

const RequestedEquipment = ({ equipment }) => {
  const route = useRoute();
  return (
    <div className="mb-4 flex flex-col overflow-hidden rounded border border-gray-200 shadow-md transition-colors hover:bg-gray-100 md:flex-row md:items-center md:gap-4 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-800">
      <img
        className={`h-full max-h-[200px] md:w-64 ${equipment.deleted_at ? 'grayscale' : ''} w-full object-cover`}
        src={equipment.image_path || '/images/no-image.jpg'}
        alt={equipment.name}
      />

      <div className="w-full px-2 py-4">
        <div>
          <Link
            className="text-green-500 hover:underline"
            href={route('admin.equipment.edit', { slug: equipment.slug })}
          >
            <h2 className="fluid-text-2 font-medium dark:border-gray-600">
              {truncate(equipment.name, { length: 35 })}
            </h2>
          </Link>

          <div className="flex flex-col gap-1 text-black-800 dark:text-white-500">
            <div className="flex items-center gap-2">
              <TagIcon className="size-4" />
              <p className="flex items-center">
                <span className="block min-w-[85px] font-medium">Kategorie:</span>
                <span>
                  {equipment.category ? equipment.category.name : 'nezařazeno'} &bull;{' '}
                  {equipment.manufacturer}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <ArchiveBoxIcon className="size-4" />
              <p className="flex items-center">
                <span className="block min-w-[85px] font-medium">Přidáno:</span>{' '}
                <span>{format(new Date(equipment.created_at), 'dd.MM.yyyy')}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <RectangleStackIcon className="size-4" />
              <p className="flex items-center">
                <span className="block min-w-[85px] font-medium">Množství:</span>{' '}
                <span>{equipment.quantity} ks</span>
              </p>
            </div>

            {equipment.deleted_at && (
              <div className="flex items-center justify-center gap-1 rounded-md border border-orange-500 px-2 py-1 text-center text-orange-500">
                <InformationCircleIcon className="size-4" /> <span>Vybavení odstraněno</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestedEquipment;
