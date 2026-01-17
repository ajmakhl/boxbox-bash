import { proxy, subscribe } from 'valtio';
import type { IPlayer } from '@interfaces/IPlayer';
import type { INote } from '@interfaces/INote';
import type { ITeam } from '@interfaces/ITeam';

interface State {
  players: Record<string, IPlayer>;
  order: string[];
  notes: Record<string, INote[]>;
  generalNotes: INote[];
  teams: ITeam[];
}

const initialState: State = {
  players: JSON.parse(localStorage.getItem('players') || '{}'),
  order: JSON.parse(localStorage.getItem('player-order') || '[]'),
  notes: JSON.parse(localStorage.getItem('player-notes') || '{}'),
  generalNotes: JSON.parse(localStorage.getItem('general-notes') || '[]'),
  teams: JSON.parse(localStorage.getItem('teams') || '[]'),
};

export const Store = proxy<State>(initialState);

subscribe(Store, () => {
  localStorage.setItem('players', JSON.stringify(Store.players));
  localStorage.setItem('player-order', JSON.stringify(Store.order));
  localStorage.setItem('player-notes', JSON.stringify(Store.notes));
  localStorage.setItem('general-notes', JSON.stringify(Store.generalNotes));
  localStorage.setItem('teams', JSON.stringify(Store.teams));
});

export const playerActions = {
  create(player: Omit<IPlayer, 'id'>): string {
    const id = crypto.randomUUID();
    Store.players[id] = { ...player, id };
    Store.order.push(id);
    Store.notes[id] = [];
    return id;
  },

  update(id: string, updates: Partial<Omit<IPlayer, 'id'>>): void {
    if (Store.players[id]) {
      Object.assign(Store.players[id], updates);
    }
  },

  delete(id: string): void {
    delete Store.players[id];
    delete Store.notes[id];
    Store.order = Store.order.filter((i) => i !== id);
  },

  reorder(newOrder: string[]): void {
    Store.order = newOrder;
  },

  clear(): void {
    Store.players = {};
    Store.order = [];
    Store.notes = {};
    Store.generalNotes = [];
  },

  addNote(playerId: string, text: string): void {
    if (!Store.notes[playerId]) {
      Store.notes[playerId] = [];
    }
    Store.notes[playerId].push({
      text,
      timestamp: new Date().toISOString(),
    });
  },

  updateNote(playerId: string, noteIndex: number, text: string): void {
    if (Store.notes[playerId]?.[noteIndex] !== undefined) {
      Store.notes[playerId][noteIndex] = {
        text,
        timestamp: new Date().toISOString(),
      };
    }
  },

  deleteNote(playerId: string, noteIndex: number): void {
    if (Store.notes[playerId]) {
      Store.notes[playerId].splice(noteIndex, 1);
    }
  },

  reorderNotes(playerId: string, newOrder: number[]): void {
    if (Store.notes[playerId]) {
      const reordered = newOrder.map((i) => Store.notes[playerId][i]);
      Store.notes[playerId] = reordered;
    }
  },
};

export const generalNotesActions = {
  add(text: string): void {
    Store.generalNotes.push({
      text,
      timestamp: new Date().toISOString(),
    });
  },

  update(noteIndex: number, text: string): void {
    if (Store.generalNotes[noteIndex] !== undefined) {
      Store.generalNotes[noteIndex] = {
        text,
        timestamp: new Date().toISOString(),
      };
    }
  },

  delete(noteIndex: number): void {
    Store.generalNotes.splice(noteIndex, 1);
  },

  reorder(newOrder: number[]): void {
    const reordered = newOrder.map((i) => Store.generalNotes[i]);
    Store.generalNotes = reordered;
  },

  clear(): void {
    Store.generalNotes = [];
  },
};

export const teamActions = {
  create(name: string): string {
    const id = crypto.randomUUID();
    Store.teams.push({ id, name, members: [] });
    return id;
  },

  update(teamId: string, updates: Partial<Omit<ITeam, 'id'>>): void {
    const team = Store.teams.find((t) => t.id === teamId);
    if (team) {
      Object.assign(team, updates);
    }
  },

  delete(teamId: string): void {
    const index = Store.teams.findIndex((t) => t.id === teamId);
    if (index !== -1) {
      Store.teams.splice(index, 1);
    }
  },

  addMember(teamId: string, playerId: string, gold: number = 0): void {
    const team = Store.teams.find((t) => t.id === teamId);
    if (team && !team.members.some((m) => m.playerId === playerId)) {
      team.members.push({ playerId, gold });
    }
  },

  removeMember(teamId: string, playerId: string): void {
    const team = Store.teams.find((t) => t.id === teamId);
    if (team) {
      team.members = team.members.filter((m) => m.playerId !== playerId);
    }
  },

  updateMemberGold(teamId: string, playerId: string, gold: number): void {
    const team = Store.teams.find((t) => t.id === teamId);
    if (team) {
      const member = team.members.find((m) => m.playerId === playerId);
      if (member) {
        member.gold = gold;
      }
    }
  },

  reorderMembers(teamId: string, newOrder: string[]): void {
    const team = Store.teams.find((t) => t.id === teamId);
    if (team) {
      const memberMap = new Map(team.members.map((m) => [m.playerId, m]));
      team.members = newOrder
        .map((playerId) => memberMap.get(playerId))
        .filter((m): m is NonNullable<typeof m> => m !== undefined);
    }
  },

  reorder(newOrder: string[]): void {
    const teamMap = new Map(Store.teams.map((t) => [t.id, t]));
    Store.teams = newOrder
      .map((id) => teamMap.get(id))
      .filter((t): t is NonNullable<typeof t> => t !== undefined);
  },

  clear(): void {
    Store.teams = [];
  },
};
