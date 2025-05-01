import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useRoute } from 'ziggy-js';
import Breadcrumbs from '@/Components/Navigation/AdminBreadcrumbs';
import ConfirmModal from '@/Components/ConfirmModal';
import {
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  AcademicCapIcon,
  ShieldExclamationIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const Show = ({ user }) => {
  const route = useRoute();
  const [showBanModal, setShowBanModal] = useState(false);
  const [showUnbanModal, setShowUnbanModal] = useState(false);

  const { data, setData, post, reset, processing } = useForm({
    ban_reason: '',
  });

  const breadcrumbs = [
    { href: 'admin.users', label: 'Uživatelé' },
    { href: null, label: `${user.first_name} ${user.last_name}` },
  ];

  const handleBanUser = () => {
    post(route('admin.users.ban', user.id), {
      onSuccess: () => {
        setShowBanModal(false);
        reset();
      },
    });
  };

  const handleUnbanUser = () => {
    post(route('admin.users.unban', user.id), {
      onSuccess: () => {
        setShowUnbanModal(false);
      },
    });
  };

  return (
    <>
      <Head title={`${user.first_name || ''} ${user.last_name || ''}`} />
      
      {/* Ban Modal */}
      <ConfirmModal
        isOpen={showBanModal}
        onClose={() => setShowBanModal(false)}
        onConfirm={handleBanUser}
        title="Zabanovat uživatele"
      >
        <div className="space-y-4">
          <p className="font-medium">
            Opravdu chcete zabanovat uživatele {user.first_name} {user.last_name}?
          </p>
          <div className="space-y-2">
            <label htmlFor="banReason" className="block text-sm font-medium">
              Důvod banování:
            </label>
            <textarea
              id="banReason"
              name="banReason"
              value={data.ban_reason}
              onChange={(e) => setData('ban_reason', e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800"
              rows="3"
              placeholder="Zadejte důvod banování"
              required
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Tato akce způsobí:</p>
            <ul className="list-disc space-y-2 pl-8">
              <li>Znemožnění přihlášení do systému</li>
              <li>Zrušení přístupu ke všem funkcím systému</li>
            </ul>
          </div>
        </div>
      </ConfirmModal>
      
      {/* Unban Modal */}
      <ConfirmModal
        isOpen={showUnbanModal}
        onClose={() => setShowUnbanModal(false)}
        onConfirm={handleUnbanUser}
        title="Odbanovat uživatele"
      >
        <p className="font-medium">
          Opravdu chcete odbanovat uživatele {user.first_name} {user.last_name}?
        </p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Uživatel bude znovu moci přistupovat ke všem funkcím systému.
        </p>
      </ConfirmModal>
      
      <div className="container pt-4">
        <Breadcrumbs links={breadcrumbs} />
        
        {/* User Profile Card */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="fluid-text-3 font-bold">Profil uživatele</h1>
            {user.is_banned && (
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                Zabanován
              </span>
            )}
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <UserIcon className="size-5 text-gray-600 dark:text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Jméno</div>
                <div>{user.first_name} {user.last_name}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <EnvelopeIcon className="size-5 text-gray-600 dark:text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</div>
                <div>{user.email}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <AcademicCapIcon className="size-5 text-gray-600 dark:text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</div>
                <div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs text-white-50 ${
                    user.role === 'student' ? 'bg-green-600' : 'bg-yellow-500'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <AcademicCapIcon className="size-5 text-gray-600 dark:text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Třída</div>
                <div>{user.class || "—"}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <CalendarIcon className="size-5 text-gray-600 dark:text-gray-400" />
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Zaregistrován</div>
                <div>{format(new Date(user.created_at), 'dd.MM.yyyy')}</div>
              </div>
            </div>
            
            {user.is_banned && (
              <div className="flex items-center gap-3">
                <ShieldExclamationIcon className="size-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Zabanován</div>
                  <div>{user.banned_at ? format(new Date(user.banned_at), 'dd.MM.yyyy HH:mm') : "—"}</div>
                </div>
              </div>
            )}
          </div>
          
          {user.is_banned && (
            <div className="mt-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Důvod banování:</h3>
              <p className="mt-2 text-sm text-red-700 dark:text-red-200">
                {user.ban_reason || 'Nebyl uveden důvod'}
              </p>
            </div>
          )}
          
          {user.role !== 'admin' && (
            <div className="mt-6">
              {user.is_banned ? (
                <button
                  onClick={() => setShowUnbanModal(true)}
                  disabled={processing}
                  className="flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  <ShieldCheckIcon className="size-5" />
                  Odbanovat uživatele
                </button>
              ) : (
                <button
                  onClick={() => setShowBanModal(true)}
                  disabled={processing}
                  className="flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  <ShieldExclamationIcon className="size-5" />
                  Zabanovat uživatele
                </button>
              )}
            </div>
          )}
        </div>
        

      </div>
    </>
  );
};

export default Show;
