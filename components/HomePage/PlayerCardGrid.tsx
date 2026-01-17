import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortablePlayerCard } from './SortablePlayerCard';
import { PlayerCard } from './PlayerCard';
import { service } from '@services/index';
import type { IPlayer } from '@interfaces/IPlayer';
import { gridContainer } from '@modules';
import { useState } from 'react';

export function PlayerCardGrid() {
  const { players, order, notes } = service.useSnapshot();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const playersInOrder = order
    .map((id) => players[id])
    .filter((p): p is IPlayer => p !== undefined);

  const activePlayer = activeId ? players[activeId] : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = order.indexOf(String(active.id));
      const newIndex = order.indexOf(String(over.id));
      const newOrder = arrayMove([...order], oldIndex, newIndex);
      service.player.reorder(newOrder);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={[...order]} strategy={rectSortingStrategy}>
        <div className={gridContainer()}>
          {playersInOrder.map((player) => (
            <SortablePlayerCard
              key={player.id}
              player={player}
              notes={[...(notes[player.id] ?? [])]}
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay
        dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: '0',
              },
            },
          }),
        }}
      >
        {activePlayer ? (
          <div className='cursor-grabbing'>
            <PlayerCard
              player={activePlayer}
              notes={[...(notes[activePlayer.id] ?? [])]}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
