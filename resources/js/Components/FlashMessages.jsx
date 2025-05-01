import { useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function FlashMessages() {
  const [isOpen, setIsOpen] = useState(true);
  const [progress, setProgress] = useState(100);
  const { flash } = usePage().props;
  // čas, po kterém se automaticky zavře zprává
  const CLOSE_TIMEOUT = 3000;
  // po kolika milisekundách se aktualizuje animace
  const UPDATE_INTERVAL = 10;
  // maximální stáří zprávy
  const FLASH_MAX_AGE_SECONDS = 2;

  const progressTimerRef = useRef(null);

  const handleCloseFlash = () => {
    setIsOpen(false);
    setProgress(100);
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }
  };

  useEffect(() => {
    if (flash?.message && flash?.timestamp) {
      const startTime = Date.now();

      // zrušení existujících intervalů
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }

      // interval pro animaci zbyvajícího času
      const updateProgress = () => {
        const elapsedTime = Date.now() - startTime;
        const newProgress = Math.max(0, 100 - (elapsedTime / CLOSE_TIMEOUT) * 100);

        if (elapsedTime >= CLOSE_TIMEOUT) {
          handleCloseFlash();
        } else {
          setProgress(newProgress);
          setIsOpen(true);
        }
      };

      // spuštění intervalu animace
      progressTimerRef.current = setInterval(updateProgress, UPDATE_INTERVAL);

      // iniciální stav
      setIsOpen(true);
      setProgress(100);

      return () => {
        if (progressTimerRef.current) {
          clearInterval(progressTimerRef.current);
        }
      };
    }
  }, [flash?.timestamp]);

  // kontrola, zda se nejedná o starou zprávu
  useEffect(() => {
    if (flash?.message && flash?.timestamp) {
      const messageAgeInSeconds = Date.now() / 1000 - flash.timestamp;
      if (messageAgeInSeconds > FLASH_MAX_AGE_SECONDS) {
        handleCloseFlash();
      }
    }
  }, [flash]);

  if (!flash?.message) {
    return null;
  }

  return (
    <div className="container relative">
      <div className="drop-down fixed left-8 right-8 top-4 z-50">
        <div
          className={`relative ${isOpen ? 'opacity-100' : 'hidden opacity-0'} overflow-hidden rounded-lg bg-opacity-95 shadow backdrop-blur transition-opacity flash-${flash.type}`}
          role="alert"
        >
          <div className="px-6 py-4">{flash.message}</div>

          <button
            aria-label="Zavřít"
            onClick={handleCloseFlash}
            className={`absolute right-1 top-1 rounded-md p-1 flash-close-${flash.type}`}
          >
            <XMarkIcon className="size-[20px]" />
          </button>

          <div className={`h-[2px] w-full flash-progress-${flash.type} bg-opacity-40`}>
            <div
              className="h-full bg-white-50 transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
