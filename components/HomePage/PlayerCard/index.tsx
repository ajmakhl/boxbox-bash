import type { IPlayer } from '@interfaces/IPlayer';
import type { INote } from '@interfaces/INote';
import type { IRank } from '@interfaces/IRank';
import { card } from '@modules';
import { RankBadge } from './RankBadge';
import { PlayerName } from './PlayerName';
import { PlayerStats } from './PlayerStats';

export interface PlayerCardProps {
  player: IPlayer;
  notes: INote[];
}

export function PlayerCard({ player }: PlayerCardProps) {
  const rank = player.rank as IRank;

  return (
    <div className={card({ rank })}>
      <RankBadge player={player} />

      <PlayerName player={player} />

      <PlayerStats player={player} />
    </div>
  );
}
