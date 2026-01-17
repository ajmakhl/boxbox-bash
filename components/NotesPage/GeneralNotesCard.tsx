import { StickyNote } from 'lucide-react';

interface GeneralNotesCardProps {
  isSelected: boolean;
  onSelect: () => void;
}

export function GeneralNotesCard({
  isSelected,
  onSelect,
}: GeneralNotesCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 border mb-3 cursor-pointer ${
        isSelected
          ? 'border-amber-500 text-white'
          : 'border-white/20 text-gray-300 hover:border-white/30'
      }`}
    >
      <div className='w-10 h-10 rounded-full bg-white/10 shrink-0 flex items-center justify-center'>
        <StickyNote
          className={`w-5 h-5 ${isSelected ? 'text-amber-500' : 'text-gray-400'}`}
        />
      </div>
      <div className='flex flex-col flex-1'>
        <span className='font-medium text-white'>General Notes</span>
        <span className='text-xs text-gray-400'>
          Notes not tied to any player
        </span>
      </div>
    </button>
  );
}
