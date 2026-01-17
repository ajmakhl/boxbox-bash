import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Popover } from '@base-ui/react/popover';
import { Button } from '@base-ui/react/button';
import { Users, X } from 'lucide-react';
import { createAvatar } from '@dicebear/core';
import { micah } from '@dicebear/collection';

interface TeamMember {
  readonly playerId: string;
  readonly gold: number;
}

interface Team {
  readonly id: string;
  readonly name: string;
  readonly members: readonly TeamMember[];
}

interface Player {
  avatarSeed: string;
  name: string;
  rank: string;
  lp: number;
}

interface SortableTeamCardProps {
  team: Team;
  isSelected: boolean;
  deletePopoverOpen: boolean;
  onSelect: (teamId: string, teamName: string) => void;
  onDelete: (teamId: string) => void;
  onDeletePopoverChange: (teamId: string | null) => void;
  players: Record<string, Player>;
}

export function SortableTeamCard({
  team,
  isSelected,
  deletePopoverOpen,
  onSelect,
  onDelete,
  onDeletePopoverChange,
  players,
}: SortableTeamCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: team.id });

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
      {...listeners}
      onClick={() => onSelect(team.id, team.name)}
      className={`relative px-4 py-3 rounded-lg border border-transparent hover:border-white/20 text-gray-300 cursor-grab active:cursor-grabbing transition-colors ${
        isSelected ? 'ring-1 ring-white/40' : ''
      }`}
    >
      <div className='pr-6'>
        <div className='flex items-center gap-2'>
          <Users className='w-5 h-5 text-gray-400' />
          <span className='font-medium text-white'>{team.name}</span>
        </div>
        <p className='text-xs text-gray-500 mt-1'>
          {team.members.length} members
        </p>
        {team.members.length > 0 && (
          <div className='flex flex-wrap gap-2 mt-2'>
            {team.members.map((member) => {
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
                    <span className='text-white'>{memberPlayer.name}</span>
                    <span className='text-xs text-gray-400'>
                      {memberPlayer.rank} • {memberPlayer.lp} LP
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
      <Popover.Root
        open={deletePopoverOpen}
        onOpenChange={(open) => onDeletePopoverChange(open ? team.id : null)}
      >
        <Popover.Trigger
          onClick={(e) => e.stopPropagation()}
          className='absolute top-3 right-3 flex items-center justify-center rounded hover:bg-white/10 text-gray-500 hover:text-red-400 transition-colors cursor-pointer'
        >
          <X className='w-4 h-4' />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner sideOffset={8}>
            <Popover.Popup className='bg-zinc-800 border border-white/20 rounded-lg p-4 shadow-xl'>
              <p className='text-white text-sm mb-3'>Delete this team?</p>
              <div className='flex gap-2 justify-end'>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePopoverChange(null);
                  }}
                  className='px-3 py-1.5 text-sm rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors'
                >
                  Cancel
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePopoverChange(null);
                    onDelete(team.id);
                  }}
                  className='px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors'
                >
                  Delete
                </Button>
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
