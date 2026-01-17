import { Input } from '@base-ui/react/input';
import { Button } from '@base-ui/react/button';
import { Plus, Pencil } from 'lucide-react';

interface Team {
  readonly id: string;
  readonly name: string;
}

interface TeamFormProps {
  newTeamName: string;
  onNewTeamNameChange: (value: string) => void;
  selectedTeam: Team | null | undefined;
  onSubmit: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function TeamForm({
  newTeamName,
  onNewTeamNameChange,
  selectedTeam,
  onSubmit,
  inputRef,
}: TeamFormProps) {
  const isDisabled = selectedTeam
    ? newTeamName.trim() === selectedTeam.name || !newTeamName.trim()
    : !newTeamName.trim();

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
          value={newTeamName}
          onChange={(e) => onNewTeamNameChange(e.target.value)}
          autoComplete='off'
          placeholder={selectedTeam ? 'Update team name...' : 'New team...'}
          className='flex-1 px-3 py-2 rounded-lg border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-white/40'
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onNewTeamNameChange('');
            }
          }}
        />
        <Button
          type='submit'
          disabled={isDisabled}
          className='px-3 py-2 rounded-lg border border-white/20 text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent'
        >
          {selectedTeam ? (
            <Pencil className='w-5 h-5' />
          ) : (
            <Plus className='w-5 h-5' />
          )}
        </Button>
      </form>
    </div>
  );
}
