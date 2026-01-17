export interface ITeamMember {
  playerId: string;
  gold: number;
}

export interface ITeam {
  id: string;
  name: string;
  members: ITeamMember[];
}
