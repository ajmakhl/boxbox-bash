import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Popover } from '@base-ui/react/popover';
import { Button } from '@base-ui/react/button';
import { X } from 'lucide-react';
import type { INote } from '@interfaces/INote';
import { formatTimestamp } from '@modules';

interface SortableNoteProps {
  note: INote;
  index: number;
  isEditing: boolean;
  deletePopoverOpen: boolean;
  onEdit: (index: number, text: string) => void;
  onDelete: (index: number) => void;
  onDeletePopoverChange: (index: number | null) => void;
}

export function SortableNote({
  note,
  index,
  isEditing,
  deletePopoverOpen,
  onEdit,
  onDelete,
  onDeletePopoverChange,
}: SortableNoteProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.timestamp });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging && { opacity: 0 }),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onEdit(index, note.text)}
      className={`relative px-4 py-3 rounded-lg text-gray-300 cursor-grab active:cursor-grabbing hover:ring-1 ring-white/40 transition-colors ${
        isEditing ? 'ring-1 ring-white/40' : ''
      }`}
    >
      <div className='pr-6'>
        <span className='leading-6'>{note.text}</span>
        <p className='text-xs text-gray-500 mt-1'>
          {formatTimestamp(note.timestamp)}
        </p>
      </div>
      <Popover.Root
        open={deletePopoverOpen}
        onOpenChange={(open) => onDeletePopoverChange(open ? index : null)}
      >
        <Popover.Trigger
          onClick={(e) => e.stopPropagation()}
          className='absolute top-3 right-3 flex items-center justify-center rounded hover:bg-white/10 text-gray-500 hover:text-red-400 transition-colors cursor-pointer'
        >
          <X className='w-6 h-6' />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner sideOffset={8}>
            <Popover.Popup className='bg-zinc-800 border border-white/20 rounded-lg p-4 shadow-xl'>
              <p className='text-white text-sm mb-3'>Delete this note?</p>
              <div className='flex gap-2 justify-end'>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePopoverChange(null);
                  }}
                  className='px-3 py-1.5 text-sm rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors'
                >
                  Cancel
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePopoverChange(null);
                    onDelete(index);
                  }}
                  className='px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors'
                >
                  Delete
                </Button>
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
