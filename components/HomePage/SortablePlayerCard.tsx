import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PlayerCard } from './PlayerCard';
import { DeleteModeOverlay } from './DeleteModeOverlay';
import type { IPlayer } from '@interfaces/IPlayer';
import type { INote } from '@interfaces/INote';
import { useDeleteMode } from '@hooks/useDeleteMode';

interface SortablePlayerCardProps {
  player: IPlayer;
  notes: INote[];
}

export function SortablePlayerCard({ player, notes }: SortablePlayerCardProps) {
  const { isDeleteMode } = useDeleteMode();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: player.id, disabled: isDeleteMode });

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
      {...(isDeleteMode ? {} : listeners)}
      className={`
        relative
        ${isDeleteMode ? '' : 'cursor-grab active:cursor-grabbing'}
      `}
    >
      <DeleteModeOverlay playerId={player.id} />
      <PlayerCard player={player} notes={notes} />
    </div>
  );
}
