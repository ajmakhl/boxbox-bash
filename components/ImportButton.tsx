import { useState } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { Download } from 'lucide-react';
import { actionButton } from '@modules';
import { dataTransfer } from '@services/dataTransfer';

export function ImportButton() {
  const [open, setOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleImport = () => {
    const result = dataTransfer.import(importText);
    if (result.success) {
      setOpen(false);
      setImportText('');
      setError(null);
    } else {
      setError(result.error || 'Import failed');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setImportText('');
    setError(null);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={actionButton({ class: 'p-2 cursor-pointer' })}>
        <Download className='w-7 h-7' />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className='fixed inset-0 bg-black/50 z-50' />
        <Dialog.Popup className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 border border-slate-500 rounded-lg p-6 w-[500px] max-w-[90vw] z-50'>
          <Dialog.Title className='text-xl font-semibold text-white mb-2'>
            Import Data
          </Dialog.Title>
          <Dialog.Description className='text-sm text-gray-400 mb-4'>
            Paste the exported JSON data below. This will replace all existing
            data.
          </Dialog.Description>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder='Paste JSON data here...'
            className='w-full h-40 bg-slate-700 border border-slate-500 rounded-lg p-3 text-white text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          {error && <p className='text-red-400 text-sm mt-2'>{error}</p>}
          <div className='flex justify-end gap-3 mt-4'>
            <button
              onClick={handleClose}
              className='px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors cursor-pointer'
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={!importText.trim()}
              className='px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer'
            >
              Import
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
