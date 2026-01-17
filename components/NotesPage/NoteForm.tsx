import { Input } from '@base-ui/react/input';
import { Button } from '@base-ui/react/button';
import { Plus, Pencil, X } from 'lucide-react';

interface NoteFormProps {
  newNote: string;
  onNewNoteChange: (value: string) => void;
  isEditing: boolean;
  isGeneralNotesSelected: boolean;
  selectedPlayerName?: string;
  onSubmit: () => void;
  onCancelEdit: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function NoteForm({
  newNote,
  onNewNoteChange,
  isEditing,
  isGeneralNotesSelected,
  selectedPlayerName,
  onSubmit,
  onCancelEdit,
  inputRef,
}: NoteFormProps) {
  return (
    <div className='shrink-0 px-4 py-3 border-b border-slate-500'>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className='flex gap-2'
      >
        <Input
          ref={inputRef}
          value={newNote}
          onChange={(e) => onNewNoteChange(e.target.value)}
          autoComplete='off'
          placeholder={
            isGeneralNotesSelected
              ? 'Add a general note...'
              : `Add a note for ${selectedPlayerName ?? 'player'}...`
          }
          className='flex-1 px-3 py-2 rounded-lg border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-white/40'
          onKeyDown={(e) => {
            if (e.key === 'Escape' && isEditing) {
              onCancelEdit();
            }
          }}
        />
        {isEditing && (
          <Button
            type='button'
            onClick={onCancelEdit}
            className='px-3 py-2 rounded-lg border border-white/20 text-white hover:bg-white/20 transition-colors'
          >
            <X className='w-5 h-5' />
          </Button>
        )}
        <Button
          type='submit'
          className='px-3 py-2 rounded-lg border border-white/20 text-white hover:bg-white/20 transition-colors'
        >
          {isEditing ? (
            <Pencil className='w-5 h-5' />
          ) : (
            <Plus className='w-5 h-5' />
          )}
        </Button>
      </form>
    </div>
  );
}
