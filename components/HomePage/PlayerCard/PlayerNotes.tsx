import { Plus, X, Pencil } from 'lucide-react';
import { input, button } from '@modules';
import type { IPlayer } from '@interfaces/IPlayer';
import { service } from '@services/index';
import { useEditableIndex } from '@hooks/useEditableField';
import { Button } from '@base-ui/react/button';
import { Input } from '@base-ui/react/input';

interface PlayerNotesProps {
  player: IPlayer;
  notes: string[];
}

export function PlayerNotes({ player, notes }: PlayerNotesProps) {
  const { editingIndex, inputRef, startEditing, stopEditing, handleKeyDown } =
    useEditableIndex();

  const handleInteractiveClick = (
    e: React.MouseEvent,
    callback: () => void,
  ) => {
    e.stopPropagation();
    callback();
  };

  return (
    <div className='pt-2 border-t border-slate-700/50 space-y-2'>
      <div className='flex items-center justify-between'>
        <span className='text-xs text-slate-400 uppercase tracking-wide'>
          Notes
        </span>
        <Button
          onClick={(e) =>
            handleInteractiveClick(e, () =>
              service.playerNote.add(player.id, ''),
            )
          }
          onPointerDown={(e) => e.stopPropagation()}
          className={button({ variant: 'ghost' })}
          title='Add note'
        >
          <Plus className='w-3 h-3' />
        </Button>
      </div>

      {notes.length === 0 ? (
        <Button
          onClick={(e) =>
            handleInteractiveClick(e, () =>
              service.playerNote.add(player.id, ''),
            )
          }
          onPointerDown={(e) => e.stopPropagation()}
          className={button({
            variant: 'muted',
            size: 'sm',
            class: 'italic text-slate-500/50',
          })}
        >
          Click to add a note...
        </Button>
      ) : (
        <div className='space-y-1.5'>
          {notes.map((note: string, index: number) => (
            <div key={index} className='flex items-center gap-1 group/note'>
              {editingIndex === index ? (
                <Input
                  ref={inputRef}
                  type='text'
                  value={note}
                  onChange={(e) =>
                    service.playerNote.update(player.id, index, e.target.value)
                  }
                  onBlur={stopEditing}
                  onKeyDown={handleKeyDown}
                  onPointerDown={(e) => e.stopPropagation()}
                  className={input({ color: 'muted', class: 'flex-1' })}
                  placeholder='Enter note...'
                />
              ) : (
                <Button
                  onClick={(e) =>
                    handleInteractiveClick(e, () => startEditing(index))
                  }
                  onPointerDown={(e) => e.stopPropagation()}
                  className={button({
                    variant: 'muted',
                    size: 'sm',
                    class: 'flex-1 italic text-left flex items-center gap-1',
                  })}
                >
                  <span className='text-slate-500/50'>•</span>
                  {note || (
                    <span className='text-slate-500/50'>Empty note</span>
                  )}
                  <Pencil className='w-2.5 h-2.5 opacity-0 group-hover/note:opacity-50' />
                </Button>
              )}
              <Button
                onClick={(e) =>
                  handleInteractiveClick(e, () =>
                    service.playerNote.delete(player.id, index),
                  )
                }
                onPointerDown={(e) => e.stopPropagation()}
                className={button({
                  variant: 'danger',
                  class: 'opacity-0 group-hover/note:opacity-100',
                })}
                title='Delete note'
              >
                <X className='w-3 h-3' />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
