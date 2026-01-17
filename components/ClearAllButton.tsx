import { useState } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { Eraser } from 'lucide-react';
import { actionButton } from '@modules';
import { Store } from '@services/Store';

interface ClearAllButtonProps {
  disabled?: boolean;
}

export function ClearAllButton({ disabled }: ClearAllButtonProps) {
  const [open, setOpen] = useState(false);

  const handleClearAll = () => {
    Store.players = {};
    Store.order = [];
    Store.notes = {};
    Store.generalNotes = [];
    Store.teams = [];
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        disabled={disabled}
        className={actionButton({
          class: `p-2 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`,
        })}
      >
        <Eraser className='w-7 h-7 text-red-600' />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className='fixed inset-0 bg-black/50 z-50' />
        <Dialog.Popup className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-800 border border-white/20 rounded-lg p-6 w-[400px] max-w-[90vw] z-50'>
          <Dialog.Title className='text-xl font-semibold text-white mb-2'>
            Clear All Data?
          </Dialog.Title>
          <Dialog.Description className='text-gray-400 mb-4'>
            This will permanently delete all players, notes, and teams. This
            action cannot be undone.
          </Dialog.Description>
          <div className='flex justify-end gap-3'>
            <button
              onClick={() => setOpen(false)}
              className='px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors cursor-pointer'
            >
              Cancel
            </button>
            <button
              onClick={handleClearAll}
              className='px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors cursor-pointer'
            >
              Clear Everything
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
