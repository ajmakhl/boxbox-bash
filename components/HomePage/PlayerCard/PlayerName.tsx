import { Pencil } from 'lucide-react';
import { input, button } from '@modules';
import type { IPlayer } from '@interfaces/IPlayer';
import { service } from '@services/index';
import { useEditableField } from '@hooks/useEditableField';
import { useMemo, useCallback } from 'react';
import { createAvatar } from '@dicebear/core';
import { micah } from '@dicebear/collection';
import { Button } from '@base-ui/react/button';
import { Input } from '@base-ui/react/input';

export interface PlayerNameProps {
  player: IPlayer;
}

export function PlayerName({ player }: PlayerNameProps) {
  const { isEditing, inputRef, startEditing, stopEditing, handleKeyDown } =
    useEditableField();

  const avatarSvg = useMemo(() => {
    return createAvatar(micah, {
      seed: player.avatarSeed,
    }).toDataUri();
  }, [player.avatarSeed]);

  const randomizeAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    service.player.update(player.id, { avatarSeed: crypto.randomUUID() });
  };

  const generateRandomName = () => {
    const adjectives = [
      'Swift',
      'Brave',
      'Mighty',
      'Silent',
      'Dark',
      'Fierce',
      'Noble',
      'Wild',
    ];
    const nouns = [
      'Wolf',
      'Dragon',
      'Phoenix',
      'Shadow',
      'Storm',
      'Blade',
      'Raven',
      'Knight',
    ];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adj}${noun}${Math.floor(Math.random() * 100)}`;
  };

  const handleBlur = useCallback(() => {
    if (!player.name.trim()) {
      service.player.update(player.id, { name: generateRandomName() });
    }
    stopEditing();
  }, [player.name, player.id, stopEditing]);

  const handleInteractiveClick = (
    e: React.MouseEvent,
    callback: () => void,
  ) => {
    e.stopPropagation();
    callback();
  };

  const renderName = useMemo(() => {
    if (isEditing) {
      return (
        <Input
          ref={inputRef}
          type='text'
          maxLength={20}
          value={player.name}
          onChange={(e) =>
            service.player.update(player.id, {
              name: e.target.value.slice(0, 20),
            })
          }
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onPointerDown={(e) => e.stopPropagation()}
          className={input({ size: 'lg' })}
        />
      );
    }

    return (
      <Button
        onClick={(e) => handleInteractiveClick(e, startEditing)}
        onPointerDown={(e) => e.stopPropagation()}
        className={button({
          variant: 'primary',
          size: 'lg',
          class: 'flex items-center gap-2 text-left group/edit',
        })}
      >
        {player.name}
        <Pencil className='w-3 h-3 opacity-0 group-hover/edit:opacity-50' />
      </Button>
    );
  }, [
    isEditing,
    inputRef,
    player.id,
    player.name,
    startEditing,
    handleBlur,
    handleKeyDown,
  ]);

  return (
    <div className='flex flex-col items-start gap-2 my-4'>
      <Button
        onClick={randomizeAvatar}
        onPointerDown={(e) => e.stopPropagation()}
        className='rounded-lg transition-all cursor-pointer'
        title='Click to randomize avatar'
      >
        <img
          src={avatarSvg}
          alt={`${player.name} avatar`}
          className='w-16 h-16 rounded-lg bg-slate-700'
        />
      </Button>
      {renderName}
    </div>
  );
}
