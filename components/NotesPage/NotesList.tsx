import { useState, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { ScrollArea } from '@base-ui/react/scroll-area';
import {
  DndContext,
  closestCenter,
  DragOverlay,
  defaultDropAnimationSideEffects,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from '@dnd-kit/sortable';
import { SortableNote } from './SortableNote';
import { NoteForm } from './NoteForm';
import { formatTimestamp } from '@modules';
import { service, notesPageStore } from '@services/index';

export function NotesList() {
  const { players, notes, generalNotes } = service.useSnapshot();
  const { selectedPlayerId } = useSnapshot(notesPageStore);
  const [newNote, setNewNote] = useState('');
  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);
  const [deletePopoverIndex, setDeletePopoverIndex] = useState<number | null>(
    null,
  );
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const noteInputRef = useRef<HTMLInputElement>(null);

  const isGeneralNotesSelected = selectedPlayerId === 'general';
  const selectedPlayer =
    selectedPlayerId && selectedPlayerId !== 'general'
      ? players[selectedPlayerId]
      : null;
  const playerNotes =
    selectedPlayerId && selectedPlayerId !== 'general'
      ? (notes[selectedPlayerId] ?? [])
      : [];
  const displayNotes = isGeneralNotesSelected ? generalNotes : playerNotes;
  const isEditing = editingNoteIndex !== null;
  const hasSelectedPlayer = isGeneralNotesSelected || selectedPlayer;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    if (isEditing) {
      if (isGeneralNotesSelected) {
        service.generalNote.update(editingNoteIndex, newNote.trim());
      } else if (selectedPlayerId) {
        service.playerNote.update(
          selectedPlayerId,
          editingNoteIndex,
          newNote.trim(),
        );
      }
      setEditingNoteIndex(null);
    } else {
      if (isGeneralNotesSelected) {
        service.generalNote.add(newNote.trim());
      } else if (selectedPlayerId) {
        service.playerNote.add(selectedPlayerId, newNote.trim());
      }
    }
    setNewNote('');
  };

  const handleEditNote = (index: number, noteText: string) => {
    setNewNote(noteText);
    setEditingNoteIndex(index);
    setTimeout(() => noteInputRef.current?.focus(), 0);
  };

  const handleDeleteNote = (index: number) => {
    if (isGeneralNotesSelected) {
      service.generalNote.delete(index);
    } else if (selectedPlayerId) {
      service.playerNote.delete(selectedPlayerId, index);
    }
    if (editingNoteIndex === index) {
      setEditingNoteIndex(null);
      setNewNote('');
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteIndex(null);
    setNewNote('');
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveNoteId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveNoteId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = displayNotes.findIndex((n) => n.timestamp === active.id);
    const newIndex = displayNotes.findIndex((n) => n.timestamp === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(
      displayNotes.map((_, i) => i),
      oldIndex,
      newIndex,
    );

    if (isGeneralNotesSelected) {
      service.generalNote.reorder(newOrder);
    } else if (selectedPlayerId) {
      service.playerNote.reorder(selectedPlayerId, newOrder);
    }
  };

  return (
    <div className='flex flex-col h-full min-h-0 rounded-lg border border-slate-500 overflow-hidden'>
      <div className='shrink-0 px-4 py-3 border-b border-slate-500'>
        <h2 className='text-xl font-semibold text-white'>
          {isGeneralNotesSelected
            ? 'All Notes'
            : selectedPlayer
              ? `Notes for ${selectedPlayer.name}`
              : 'Select a player'}
        </h2>
        <p className='text-sm text-gray-400'>
          {isGeneralNotesSelected
            ? 'Add general notes or select a player'
            : selectedPlayer
              ? `Add notes specific to ${selectedPlayer.name}`
              : 'Select a player from the left to view notes'}
        </p>
      </div>

      {/* Add Note Form */}
      <NoteForm
        newNote={newNote}
        onNewNoteChange={setNewNote}
        isEditing={isEditing}
        isGeneralNotesSelected={isGeneralNotesSelected}
        selectedPlayerName={selectedPlayer?.name}
        onSubmit={handleAddNote}
        onCancelEdit={handleCancelEdit}
        inputRef={noteInputRef}
      />

      <ScrollArea.Root className='flex-1 min-h-0 overflow-hidden'>
        <ScrollArea.Viewport className='h-full w-full overflow-auto p-3'>
          {hasSelectedPlayer ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={displayNotes.map((note) => note.timestamp)}
                strategy={verticalListSortingStrategy}
              >
                <div className='space-y-2'>
                  {displayNotes.length > 0 ? (
                    displayNotes.map((note, index) => (
                      <SortableNote
                        key={note.timestamp}
                        note={note}
                        index={index}
                        isEditing={editingNoteIndex === index}
                        deletePopoverOpen={deletePopoverIndex === index}
                        onEdit={handleEditNote}
                        onDelete={handleDeleteNote}
                        onDeletePopoverChange={setDeletePopoverIndex}
                      />
                    ))
                  ) : (
                    <p className='text-gray-500 italic'>
                      {isGeneralNotesSelected
                        ? 'No general notes yet.'
                        : 'No notes yet for this player.'}
                    </p>
                  )}
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
                {activeNoteId
                  ? (() => {
                      const activeNote = displayNotes.find(
                        (n) => n.timestamp === activeNoteId,
                      );
                      if (!activeNote) return null;
                      return (
                        <div className='px-4 py-3 rounded-lg border border-white/20 bg-slate-800 cursor-grabbing'>
                          <p className='text-white pr-6'>{activeNote.text}</p>
                          <p className='text-xs text-gray-400 mt-1'>
                            {formatTimestamp(activeNote.timestamp)}
                          </p>
                        </div>
                      );
                    })()
                  : null}
              </DragOverlay>
            </DndContext>
          ) : (
            <p className='text-gray-500 italic'>
              Select a player to view their notes.
            </p>
          )}
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar className='flex w-2 touch-none select-none p-0.5 transition-colors ease-out data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:flex-col'>
          <ScrollArea.Thumb className='relative flex-1 rounded-full bg-white/30' />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
}
