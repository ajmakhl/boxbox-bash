export interface IPlayer {
  id: string;
  name: string;
  gold: number;
  games: number;
  rank: string;
  lp: number;
  avatarSeed: string;
}

export interface IPlayerList {
  players: IPlayer['id'][];
}
