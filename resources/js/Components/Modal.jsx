import { useRef, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Modal = ({ isOpen, onClose, children, closeButtonOnly = false }) => {
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
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          closeButtonOnly ? undefined : onClose();
        }
      }}
      className="w-full max-w-md rounded-lg bg-white-50 p-6 shadow-lg backdrop:bg-black-950/50 dark:bg-gray-800"
    >
      <button
        onClick={onClose}
        className="absolute right-2 top-2 rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
        aria-label="Close Modal"
      >
        <XMarkIcon className="size-6" />
      </button>

      <div className="flex flex-col gap-4 dark:text-gray-300">{children}</div>
    </dialog>
  );
};

export default Modal;
