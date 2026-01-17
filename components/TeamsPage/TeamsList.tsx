import { useState, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { ScrollArea } from '@base-ui/react/scroll-area';
import { Button } from '@base-ui/react/button';
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
import { Users, Coins } from 'lucide-react';
import { createAvatar } from '@dicebear/core';
import { micah } from '@dicebear/collection';
import { SortableTeamCard } from './SortableTeamCard';
import { SortableTeamMember } from './SortableTeamMember';
import { TeamForm } from './TeamForm';
import { service, teamsPageStore, teamsPageActions } from '@services/index';

export function TeamsList() {
  const { players, teams } = service.useSnapshot();
  const { selectedTeamId } = useSnapshot(teamsPageStore);
  const [newTeamName, setNewTeamName] = useState('');
  const [deletePopoverTeamId, setDeletePopoverTeamId] = useState<string | null>(
    null,
  );
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);
  const teamInputRef = useRef<HTMLInputElement>(null);

  const selectedTeam = selectedTeamId
    ? teams.find((t) => t.id === selectedTeamId)
    : null;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleCreateOrUpdateTeam = () => {
    if (!newTeamName.trim()) return;

    if (selectedTeamId) {
      service.team.update(selectedTeamId, { name: newTeamName.trim() });
    } else {
      const teamId = service.team.create(newTeamName.trim());
      teamsPageActions.selectTeam(teamId);
      setNewTeamName('');
    }
  };

  const handleDeleteTeam = (teamId: string) => {
    service.team.delete(teamId);
    if (selectedTeamId === teamId) {
      teamsPageActions.clearSelection();
    }
  };

  const handleGoldChange = (playerId: string, gold: number) => {
    if (!selectedTeamId) return;
    service.team.updateMemberGold(selectedTeamId, playerId, gold);
  };

  const handleTeamDragStart = (event: DragStartEvent) => {
    setActiveTeamId(event.active.id as string);
  };

  const handleTeamDragEnd = (event: DragEndEvent) => {
    setActiveTeamId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = teams.findIndex((t) => t.id === active.id);
    const newIndex = teams.findIndex((t) => t.id === over.id);
    const newOrder = arrayMove(
      teams.map((t) => t.id),
      oldIndex,
      newIndex,
    );
    service.team.reorder(newOrder);
  };

  const handleMemberDragStart = (event: DragStartEvent) => {
    setActiveMemberId(event.active.id as string);
  };

  const handleMemberDragEnd = (event: DragEndEvent) => {
    setActiveMemberId(null);
    const { active, over } = event;
    if (!over || !selectedTeamId || !selectedTeam) return;

    if (active.id !== over.id) {
      const oldIndex = selectedTeam.members.findIndex(
        (m) => m.playerId === active.id,
      );
      const newIndex = selectedTeam.members.findIndex(
        (m) => m.playerId === over.id,
      );
      const newOrder = arrayMove(
        selectedTeam.members.map((m) => m.playerId),
        oldIndex,
        newIndex,
      );
      service.team.reorderMembers(selectedTeamId, newOrder);
    }
  };

  // Sync newTeamName when selectedTeam changes
  const handleSelectTeam = (teamId: string, teamName: string) => {
    setNewTeamName(teamName);
    teamsPageActions.selectTeam(teamId);
  };

  return (
    <div className='flex flex-col h-full min-h-0 rounded-lg border border-slate-500 overflow-hidden'>
      <div className='shrink-0 px-4 py-3 border-b border-slate-500'>
        <h2 className='text-xl font-semibold text-white'>
          {selectedTeam ? selectedTeam.name : 'Teams'}
        </h2>
        <p className='text-sm text-gray-400'>
          {selectedTeam
            ? `${selectedTeam.members.length} members • Drag to reorder`
            : 'Create or select a team'}
        </p>
      </div>

      {/* Create/Edit Team Form */}
      <TeamForm
        newTeamName={newTeamName}
        onNewTeamNameChange={setNewTeamName}
        selectedTeam={selectedTeam}
        onSubmit={handleCreateOrUpdateTeam}
        inputRef={teamInputRef}
      />

      <ScrollArea.Root className='flex-1 min-h-0 overflow-hidden'>
        <ScrollArea.Viewport className='h-full w-full overflow-auto p-3'>
          {/* Team List */}
          {!selectedTeam && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleTeamDragStart}
              onDragEnd={handleTeamDragEnd}
            >
              <SortableContext
                items={teams.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className='space-y-2 mb-4'>
                  {teams.length > 0 ? (
                    teams.map((team) => (
                      <SortableTeamCard
                        key={team.id}
                        team={team}
                        isSelected={selectedTeamId === team.id}
                        deletePopoverOpen={deletePopoverTeamId === team.id}
                        onSelect={handleSelectTeam}
                        onDelete={handleDeleteTeam}
                        onDeletePopoverChange={setDeletePopoverTeamId}
                        players={players}
                      />
                    ))
                  ) : (
                    <p className='text-gray-500 italic'>
                      No teams yet. Create one above.
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
                {activeTeamId
                  ? (() => {
                      const activeTeam = teams.find(
                        (t) => t.id === activeTeamId,
                      );
                      if (!activeTeam) return null;
                      return (
                        <div className='px-4 py-3 rounded-lg border border-white/20 bg-slate-800 text-gray-300 cursor-grabbing'>
                          <div className='pr-6'>
                            <div className='flex items-center gap-2'>
                              <Users className='w-5 h-5 text-gray-400' />
                              <span className='font-medium text-white'>
                                {activeTeam.name}
                              </span>
                            </div>
                            <p className='text-xs text-gray-500 mt-1'>
                              {activeTeam.members.length} members
                            </p>
                            {activeTeam.members.length > 0 && (
                              <div className='flex flex-wrap gap-2 mt-2'>
                                {activeTeam.members.map((member) => {
                                  const memberPlayer = players[member.playerId];
                                  if (!memberPlayer) return null;
                                  const memberAvatar = createAvatar(micah, {
                                    seed: memberPlayer.avatarSeed,
                                  }).toDataUri();
                                  return (
                                    <div
                                      key={member.playerId}
                                      className='flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-sm'
                                    >
                                      <img
                                        src={memberAvatar}
                                        alt={memberPlayer.name}
                                        className='w-8 h-8 rounded-full'
                                      />
                                      <div className='flex flex-col'>
                                        <span className='text-white'>
                                          {memberPlayer.name}
                                        </span>
                                        <span className='text-xs text-gray-400'>
                                          {memberPlayer.rank} •{' '}
                                          {memberPlayer.lp} LP
                                        </span>
                                      </div>
                                      <span className='text-yellow-500 font-mono'>
                                        {member.gold}G
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()
                  : null}
              </DragOverlay>
            </DndContext>
          )}

          {/* Selected Team Members */}
          {selectedTeam && (
            <div>
              <div className='flex items-center justify-between mb-3'>
                <Button
                  onClick={() => {
                    setNewTeamName('');
                    teamsPageActions.clearSelection();
                  }}
                  className='text-sm text-gray-400 hover:text-white transition-colors'
                >
                  ← Back to teams
                </Button>
                <div className='flex items-center gap-2 text-yellow-500'>
                  <Coins className='w-4 h-4' />
                  <span className='font-mono font-semibold'>
                    {selectedTeam.members.reduce((sum, m) => sum + m.gold, 0)}G
                  </span>
                  <span className='text-gray-400 text-sm'>total</span>
                </div>
              </div>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleMemberDragStart}
                onDragEnd={handleMemberDragEnd}
              >
                <SortableContext
                  items={selectedTeam.members.map((m) => m.playerId)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className='space-y-2'>
                    {selectedTeam.members.length > 0 ? (
                      selectedTeam.members.map((member) => (
                        <SortableTeamMember
                          key={member.playerId}
                          playerId={member.playerId}
                          gold={member.gold}
                          teamId={selectedTeamId!}
                          onGoldChange={handleGoldChange}
                        />
                      ))
                    ) : (
                      <p className='text-gray-500 italic'>
                        No members yet. Click players on the left to add them.
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
                  {activeMemberId
                    ? (() => {
                        const member = selectedTeam.members.find(
                          (m) => m.playerId === activeMemberId,
                        );
                        const memberPlayer = players[activeMemberId];
                        if (!member || !memberPlayer) return null;
                        const avatarSvg = createAvatar(micah, {
                          seed: memberPlayer.avatarSeed,
                        }).toDataUri();
                        return (
                          <div className='flex items-center gap-3 px-4 py-3 rounded-lg border border-white/20 bg-slate-800 cursor-grabbing'>
                            <img
                              src={avatarSvg}
                              alt={`${memberPlayer.name}'s avatar`}
                              className='w-10 h-10 rounded-full bg-white/10 shrink-0'
                            />
                            <div className='flex flex-col flex-1 min-w-0'>
                              <span className='font-medium text-white truncate'>
                                {memberPlayer.name}
                              </span>
                              <span className='text-xs text-gray-400'>
                                {memberPlayer.rank} • {memberPlayer.lp} LP
                              </span>
                            </div>
                            <div className='flex items-center gap-1 text-yellow-500'>
                              <Coins className='w-4 h-4' />
                              <span className='font-mono'>{member.gold}G</span>
                            </div>
                          </div>
                        );
                      })()
                    : null}
                </DragOverlay>
              </DndContext>
            </div>
          )}
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar className='flex w-2 touch-none select-none p-0.5 transition-colors ease-out data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:flex-col'>
          <ScrollArea.Thumb className='relative flex-1 rounded-full bg-white/30' />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
}
