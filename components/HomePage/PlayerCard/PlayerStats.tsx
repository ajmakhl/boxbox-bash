import { Gamepad2, Coins, Pencil } from 'lucide-react';
import { input, button } from '@modules';
import type { IPlayer } from '@interfaces/IPlayer';
import { service } from '@services/index';
import { useEditableField } from '@hooks/useEditableField';
import { Button } from '@base-ui/react/button';
import { Input } from '@base-ui/react/input';

export interface PlayerStatsProps {
  player: IPlayer;
}

export function PlayerStats({ player }: PlayerStatsProps) {
  const {
    isEditing: isEditingGames,
    inputRef: gamesInputRef,
    startEditing: startEditingGames,
    stopEditing: stopEditingGames,
    handleKeyDown: handleGamesKeyDown,
  } = useEditableField();
  const {
    isEditing: isEditingGold,
    inputRef: goldInputRef,
    startEditing: startEditingGold,
    stopEditing: stopEditingGold,
    handleKeyDown: handleGoldKeyDown,
  } = useEditableField();

  const handleInteractiveClick = (
    e: React.MouseEvent,
    callback: () => void,
  ) => {
    e.stopPropagation();
    callback();
  };

  return (
    <div className='space-y-3'>
      {/* Games Played */}
      <div className='flex items-center justify-between'>
        <span className='flex items-center gap-2 text-slate-400 text-sm'>
          <Gamepad2 className='w-4 h-4' />
          Games
        </span>
        {isEditingGames ? (
          <Input
            ref={gamesInputRef}
            type='number'
            min={0}
            max={9999}
            value={player.games}
            onChange={(e) => {
              const value = Math.min(
                9999,
                Math.max(0, Number.parseInt(e.target.value) || 0),
              );
              service.player.update(player.id, { games: value });
            }}
            onBlur={stopEditingGames}
            onKeyDown={handleGamesKeyDown}
            onPointerDown={(e) => e.stopPropagation()}
            className={input({ size: 'md' })}
          />
        ) : (
          <Button
            onClick={(e) => handleInteractiveClick(e, startEditingGames)}
            onPointerDown={(e) => e.stopPropagation()}
            className={button({
              variant: 'primary',
              class:
                'font-mono font-semibold group/edit flex items-center gap-1',
            })}
          >
            {player.games}
            <Pencil className='w-3 h-3 opacity-0 group-hover/edit:opacity-50' />
          </Button>
        )}
      </div>

      {/* Gold */}
      <div className='flex items-center justify-between'>
        <span className='flex items-center gap-2 text-slate-400 text-sm'>
          <Coins className='w-4 h-4' />
          Gold
        </span>
        {isEditingGold ? (
          <Input
            ref={goldInputRef}
            type='number'
            min={0}
            max={100}
            value={player.gold}
            onChange={(e) => {
              const value = Math.min(
                100,
                Math.max(0, Number.parseInt(e.target.value) || 0),
              );
              service.player.update(player.id, { gold: value });
            }}
            onBlur={stopEditingGold}
            onKeyDown={handleGoldKeyDown}
            onPointerDown={(e) => e.stopPropagation()}
            className={input({ size: 'md', color: 'amber' })}
          />
        ) : (
          <Button
            onClick={(e) => handleInteractiveClick(e, startEditingGold)}
            onPointerDown={(e) => e.stopPropagation()}
            className={button({
              variant: 'amber',
              class:
                'font-mono font-semibold group/edit flex items-center gap-1',
            })}
          >
            {player.gold}G
            <Pencil className='w-3 h-3 opacity-0 group-hover/edit:opacity-50' />
          </Button>
        )}
      </div>
    </div>
  );
}
