import { proxy } from 'valtio';

interface NotesPageState {
  selectedPlayerId: string | null;
}

export const notesPageStore = proxy<NotesPageState>({
  selectedPlayerId: 'general',
});

export const notesPageActions = {
  selectPlayer(playerId: string | null) {
    notesPageStore.selectedPlayerId = playerId;
  },
};
