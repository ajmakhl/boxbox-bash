import { useState } from 'react';
import { useSnapshot } from 'valtio';
import { ScrollArea } from '@base-ui/react/scroll-area';
import { Input } from '@base-ui/react/input';
import { Search, Trophy, Check } from 'lucide-react';
import { createAvatar } from '@dicebear/core';
import { micah } from '@dicebear/collection';
import type { IRank } from '@interfaces/IRank';
import { rankColors } from '@modules';
import { service, teamsPageStore } from '@services/index';

export function TeamsPlayerList() {
  const { players, order, teams } = service.useSnapshot();
  const { selectedTeamId } = useSnapshot(teamsPageStore);
  const [filterText, setFilterText] = useState('');

  const selectedTeam = selectedTeamId
    ? teams.find((t) => t.id === selectedTeamId)
    : null;

  const filteredOrder = order.filter((playerId) => {
    const player = players[playerId];
    if (!player) return false;
    return player.name.toLowerCase().includes(filterText.toLowerCase());
  });

  const handleTogglePlayer = (playerId: string) => {
    if (!selectedTeamId || !selectedTeam) return;

    const isMember = selectedTeam.members.some((m) => m.playerId === playerId);
    if (isMember) {
      service.team.removeMember(selectedTeamId, playerId);
    } else {
      service.team.addMember(selectedTeamId, playerId, 0);
    }
  };

  return (
    <div className='flex flex-col h-full min-h-0 rounded-lg border border-slate-500 overflow-hidden'>
      <div className='shrink-0 px-4 py-3 border-b border-slate-500'>
        <h2 className='text-xl font-semibold text-white'>Players</h2>
        <p className='text-sm text-gray-400'>
          {selectedTeam
            ? 'Click players to add/remove from team'
            : 'Select a team first'}
        </p>
      </div>
      <ScrollArea.Root className='flex-1 min-h-0 overflow-hidden'>
        <ScrollArea.Viewport className='h-full w-full overflow-auto p-3'>
          {/* Filter Input */}
          <div className='relative mb-3'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            <Input
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder='Filter players...'
              autoComplete='off'
              className='w-full pl-9 pr-3 py-2 rounded-lg border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-white/40'
            />
          </div>

          {/* Player List */}
          <div className='space-y-2'>
            {filteredOrder.map((playerId) => {
              const player = players[playerId];
              if (!player) return null;
              const avatarSvg = createAvatar(micah, {
                seed: player.avatarSeed,
              }).toDataUri();
              const rankColor =
                rankColors[player.rank as IRank] ?? 'text-gray-500';
              const isMember =
                selectedTeam?.members.some((m) => m.playerId === playerId) ??
                false;
              return (
                <button
                  key={playerId}
                  onClick={() => handleTogglePlayer(playerId)}
                  disabled={!selectedTeam}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 border ${
                    isMember
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-white/20 hover:border-white/30'
                  } ${!selectedTeam ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <img
                    src={avatarSvg}
                    alt={`${player.name}'s avatar`}
                    className='w-10 h-10 rounded-full bg-white/10 shrink-0'
                  />
                  <div className='flex flex-col flex-1'>
                    <span className='font-medium text-white'>
                      {player.name}
                    </span>
                    <span className='text-xs text-gray-400'>
                      {player.rank} • {player.lp} LP
                    </span>
                  </div>
                  {isMember ? (
                    <Check className='w-5 h-5 shrink-0 text-green-500' />
                  ) : (
                    <Trophy className={`w-5 h-5 shrink-0 ${rankColor}`} />
                  )}
                </button>
              );
            })}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar className='flex w-2 touch-none select-none p-0.5 transition-colors ease-out data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:flex-col'>
          <ScrollArea.Thumb className='relative flex-1 rounded-full bg-white/30' />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
}
