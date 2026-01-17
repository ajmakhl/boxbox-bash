import { Trophy } from 'lucide-react';
import { badge, input, rankLabels, ranks } from '@modules';
import type { IPlayer } from '@interfaces/IPlayer';
import type { IRank } from '@interfaces/IRank';
import { service } from '@services/index';
import { useEditableField } from '@hooks/useEditableField';
import { Button } from '@base-ui/react/button';
import { Input } from '@base-ui/react/input';

const TIER_LABELS = ['I', 'II', 'III', 'IV'] as const;
const RANKS_WITH_TIERS: IRank[] = [
  'iron',
  'bronze',
  'silver',
  'gold',
  'platinum',
  'emerald',
  'diamond',
];

export interface RankBadgeProps {
  player: IPlayer;
}

export function RankBadge({ player }: RankBadgeProps) {
  const { isEditing, inputRef, startEditing, stopEditing, handleKeyDown } =
    useEditableField();
  const rank = player.rank as IRank;
  const hasTiers = RANKS_WITH_TIERS.includes(rank);

  const cycleRank = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = ranks.indexOf(rank);
    const nextIndex = (currentIndex + 1) % ranks.length;
    service.player.update(player.id, { rank: ranks[nextIndex] });
  };

  const cycleTier = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentTier = player.tier || 1;
    const nextTier = (currentTier % 4) + 1;
    service.player.update(player.id, { tier: nextTier });
  };

  const handleInteractiveClick = (
    e: React.MouseEvent,
    callback: () => void,
  ) => {
    e.stopPropagation();
    callback();
  };

  return (
    <div className={badge({ rank })}>
      <div className='flex items-center gap-2'>
        <Button
          onClick={cycleRank}
          onPointerDown={(e) => e.stopPropagation()}
          className='flex items-center gap-1 transition-opacity cursor-pointer hover:opacity-80'
          title='Click to change rank'
        >
          <Trophy className='w-3.5 h-3.5' />
          {rankLabels[rank]}
        </Button>
        {hasTiers && (
          <>
            <Button
              onClick={cycleTier}
              onPointerDown={(e) => e.stopPropagation()}
              className='font-mono transition-opacity cursor-pointer hover:opacity-80'
              title='Click to change tier'
            >
              {TIER_LABELS[(player.tier || 1) - 1]}
            </Button>
          </>
        )}
        <span className='text-slate-100/30'>|</span>
        {isEditing ? (
          <Input
            ref={inputRef}
            type='number'
            min={0}
            max={9999}
            value={player.lp}
            onChange={(e) => {
              const value = Math.min(
                9999,
                Math.max(0, Number.parseInt(e.target.value) || 0),
              );
              service.player.update(player.id, { lp: value });
            }}
            onBlur={stopEditing}
            onKeyDown={handleKeyDown}
            onPointerDown={(e) => e.stopPropagation()}
            className={input({ size: 'sm' })}
          />
        ) : (
          <Button
            onClick={(e) => handleInteractiveClick(e, startEditing)}
            onPointerDown={(e) => e.stopPropagation()}
            className='font-mono transition-opacity hover:opacity-80'
            title='Click to edit LP'
          >
            {player.lp}LP
          </Button>
        )}
      </div>
    </div>
  );
}
