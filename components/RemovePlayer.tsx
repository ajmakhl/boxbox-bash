import { UserRoundX } from 'lucide-react';
import { actionButton } from '@modules';
import { useDeleteMode } from '@hooks/useDeleteMode';
import { service } from '@services/index';
import { Button } from '@base-ui/react/button';

export function RemovePlayer() {
  const { isDeleteMode, enterDeleteMode, exitDeleteMode } = useDeleteMode();
  const { order } = service.useSnapshot();
  const hasPlayers = order.length > 0;

  return (
    <Button
      onClick={isDeleteMode ? exitDeleteMode : enterDeleteMode}
      disabled={!hasPlayers && !isDeleteMode}
      className={actionButton({
        class: `p-2 ${isDeleteMode ? 'border-red-600 bg-slate-700' : ''} ${!hasPlayers && !isDeleteMode ? 'opacity-50 cursor-not-allowed' : ''}`,
      })}
      title={
        !hasPlayers
          ? 'No players to remove'
          : isDeleteMode
            ? 'Exit delete mode'
            : 'Enter delete mode'
      }
    >
      <UserRoundX className='w-7 h-7 text-red-600' />
    </Button>
  );
}
