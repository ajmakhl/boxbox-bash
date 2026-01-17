import { useDeleteMode } from '@hooks/useDeleteMode';
import { Checkbox } from '@base-ui/react/checkbox';
import { Check } from 'lucide-react';

interface DeleteModeOverlayProps {
  playerId: string;
}

export function DeleteModeOverlay({ playerId }: DeleteModeOverlayProps) {
  const { isDeleteMode, selectedIds, toggleSelection } = useDeleteMode();
  const isSelected = selectedIds.has(playerId);

  if (!isDeleteMode) return null;

  const handleClick = () => {
    toggleSelection(playerId);
  };

  return (
    <>
      {/* Click overlay for delete mode */}
      <div
        onClick={handleClick}
        className='absolute inset-0 z-20 cursor-pointer'
      />
      {/* Selection indicator */}
      <Checkbox.Root
        checked={isSelected}
        onCheckedChange={() => toggleSelection(playerId)}
        className={`
          absolute top-2 left-2 z-30
          w-5 h-5 rounded-full border-2
          flex items-center justify-center
          transition-colors cursor-pointer
          ${
            isSelected
              ? 'bg-red-500 border-red-500'
              : 'bg-slate-800 border-slate-500'
          }
        `}
      >
        <Checkbox.Indicator>
          <Check className='w-3 h-3 text-white' strokeWidth={3} />
        </Checkbox.Indicator>
      </Checkbox.Root>
    </>
  );
}
