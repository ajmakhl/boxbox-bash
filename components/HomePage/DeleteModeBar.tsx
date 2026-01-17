import { useDeleteMode } from '@hooks/useDeleteMode';
import { actionButton } from '@modules';
import { Check, X, CheckCheck } from 'lucide-react';
import { service } from '@services/index';
import { Button } from '@base-ui/react/button';

export function DeleteModeBar() {
  const {
    isDeleteMode,
    selectedIds,
    exitDeleteMode,
    confirmDelete,
    selectAll,
    deselectAll,
  } = useDeleteMode();
  const { order } = service.useSnapshot();
  const allSelected = selectedIds.size === order.length && order.length > 0;

  if (!isDeleteMode) return null;

  const handleToggleSelectAll = () => {
    if (allSelected) {
      deselectAll();
    } else {
      selectAll();
    }
  };

  return (
    <div className='fixed bottom-0 left-0 right-0 z-50 bg-slate-800 border-t border-slate-700 p-4'>
      <div className='max-w-7xl mx-auto flex items-center justify-between'>
        <p className='text-slate-300'>
          {selectedIds.size} player{selectedIds.size !== 1 ? 's' : ''} selected
        </p>
        <div className='flex gap-4'>
          <Button
            onClick={handleToggleSelectAll}
            className={actionButton({
              class: `px-4 py-2 flex items-center gap-2 ${allSelected ? 'border-blue-500' : ''}`,
            })}
          >
            <CheckCheck className='w-5 h-5' />
            {allSelected ? 'Deselect All' : 'Select All'}
          </Button>
          <Button
            onClick={exitDeleteMode}
            className={actionButton({
              class: 'px-4 py-2 flex items-center gap-2',
            })}
          >
            <X className='w-5 h-5' />
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            disabled={selectedIds.size === 0}
            className='px-4 py-2 rounded-lg bg-red-600 text-white cursor-pointer hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
          >
            <Check className='w-5 h-5' />
            Delete Selected
          </Button>
        </div>
      </div>
    </div>
  );
}
