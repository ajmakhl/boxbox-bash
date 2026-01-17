export interface IPlayer {
  id: string;
  name: string;
  gold: number;
  games: number;
  rank: string;
  tier: number;
  lp: number;
  avatarSeed: string;
}

export interface IPlayerList {
  players: IPlayer['id'][];
}
