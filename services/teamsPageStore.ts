import { proxy } from 'valtio';

interface TeamsPageState {
  selectedTeamId: string | null;
}

export const teamsPageStore = proxy<TeamsPageState>({
  selectedTeamId: null,
});

export const teamsPageActions = {
  selectTeam(teamId: string | null) {
    teamsPageStore.selectedTeamId = teamId;
  },

  clearSelection() {
    teamsPageStore.selectedTeamId = null;
  },
};
