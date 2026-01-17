import { useState, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSnapshot } from 'valtio';
import { Input } from '@base-ui/react/input';
import { Store } from '@services/Store';
import { service } from '@services/index';
import { input } from '@modules';
import { createAvatar } from '@dicebear/core';
import { micah } from '@dicebear/collection';
import { Coins, Pencil, X } from 'lucide-react';

interface SortableTeamMemberProps {
  playerId: string;
  gold: number;
  teamId: string;
  onGoldChange: (playerId: string, gold: number) => void;
}

export function SortableTeamMember({
  playerId,
  gold,
  teamId,
  onGoldChange,
}: SortableTeamMemberProps) {
  const { players } = useSnapshot(Store);
  const player = players[playerId];
  const [isEditingGold, setIsEditingGold] = useState(false);
  const goldInputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: playerId });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging && { opacity: 0 }),
  };

  if (!player) return null;

  const avatarSvg = createAvatar(micah, {
    seed: player.avatarSeed,
  }).toDataUri();

  const handleStartEditGold = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingGold(true);
    setTimeout(() => {
      goldInputRef.current?.focus();
      goldInputRef.current?.select();
    }, 0);
  };

  const handleGoldBlur = () => {
    setIsEditingGold(false);
  };

  const handleGoldKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      setIsEditingGold(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className='flex items-center gap-3 px-4 py-3 rounded-lg border border-transparent hover:border-white/20 cursor-grab active:cursor-grabbing'
    >
      <img
        src={avatarSvg}
        alt={`${player.name}'s avatar`}
        className='w-10 h-10 rounded-full bg-white/10 shrink-0'
      />
      <div className='flex flex-col flex-1 min-w-0'>
        <span className='font-medium text-white truncate'>{player.name}</span>
        <span className='text-xs text-gray-400'>
          {player.rank} • {player.lp} LP
        </span>
      </div>
      {isEditingGold ? (
        <div className='flex items-center gap-1 text-yellow-500'>
          <Coins className='w-4 h-4' />
          <Input
            ref={goldInputRef}
            type='number'
            min={0}
            max={999}
            value={gold}
            onChange={(e) => {
              const value = Math.min(
                999,
                Math.max(0, Number.parseInt(e.target.value) || 0),
              );
              onGoldChange(playerId, value);
            }}
            onBlur={handleGoldBlur}
            onKeyDown={handleGoldKeyDown}
            onPointerDown={(e) => e.stopPropagation()}
            className={input({ size: 'sm', color: 'amber' })}
          />
          <span className='text-sm'>G</span>
        </div>
      ) : (
        <button
          onClick={handleStartEditGold}
          className='flex items-center gap-1 text-yellow-500 hover:text-yellow-400 transition-colors group'
        >
          <span className='font-mono font-semibold'>{gold}</span>
          <span>G</span>
          <Pencil className='w-3 h-3 opacity-0 group-hover:opacity-50' />
        </button>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          service.team.removeMember(teamId, playerId);
        }}
        className='shrink-0 flex items-center justify-center rounded hover:bg-white/10 text-gray-500 hover:text-red-400 transition-colors cursor-pointer p-1'
      >
        <X className='w-4 h-4' />
      </button>
    </div>
  );
}
