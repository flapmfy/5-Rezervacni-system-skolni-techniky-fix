import { useEffect, useRef } from 'react';

// Komponenta pro zobrazení potvrzovacího okna
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className="w-full max-w-md rounded-lg bg-white-50 p-6 shadow-lg backdrop:bg-black-950/50 dark:bg-gray-800"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          onClose();
        }
      }}
    >
      <div className="mb-4 text-xl font-bold dark:text-white-50">{title}</div>
      <div className="mb-6 dark:text-gray-300">{children}</div>

      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="rounded px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Zrušit
        </button>

        <button
          onClick={onConfirm}
          className="rounded bg-red-600 px-4 py-2 text-white-50 hover:bg-red-700"
        >
          Potvrdit
        </button>
      </div>
    </dialog>
  );
};

export default ConfirmModal;
