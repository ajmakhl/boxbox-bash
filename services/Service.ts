import type { IPlayer } from '@interfaces/IPlayer';
import {
  playerActions,
  generalNotesActions,
  teamActions,
  Store,
} from './Store';
import { useSnapshot } from 'valtio';

export class Service {
  player: PlayerService = new PlayerService();
  playerNote: PlayerNoteService = new PlayerNoteService();
  generalNote: GeneralNoteService = new GeneralNoteService();
  team: TeamService = new TeamService();

  useSnapshot() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSnapshot(Store);
  }
}

export class PlayerService {
  create(player: IPlayer): void {
    playerActions.create(player);
  }

  update(id: string, updates: Partial<IPlayer>): void {
    playerActions.update(id, updates);
  }

  delete(id: string): void {
    playerActions.delete(id);
  }

  reorder(newOrder: string[]): void {
    playerActions.reorder(newOrder);
  }

  clear(): void {
    playerActions.clear();
  }
}

export class PlayerNoteService {
  add(playerId: string, note: string): void {
    playerActions.addNote(playerId, note);
  }

  update(playerId: string, noteIndex: number, value: string): void {
    playerActions.updateNote(playerId, noteIndex, value);
  }

  delete(playerId: string, noteIndex: number): void {
    playerActions.deleteNote(playerId, noteIndex);
  }

  reorder(playerId: string, newOrder: number[]): void {
    playerActions.reorderNotes(playerId, newOrder);
  }
}

export class GeneralNoteService {
  add(note: string): void {
    generalNotesActions.add(note);
  }

  update(noteIndex: number, value: string): void {
    generalNotesActions.update(noteIndex, value);
  }

  delete(noteIndex: number): void {
    generalNotesActions.delete(noteIndex);
  }

  reorder(newOrder: number[]): void {
    generalNotesActions.reorder(newOrder);
  }

  clear(): void {
    generalNotesActions.clear();
  }
}

export class TeamService {
  create(name: string): string {
    return teamActions.create(name);
  }

  update(teamId: string, updates: { name?: string }): void {
    teamActions.update(teamId, updates);
  }

  delete(teamId: string): void {
    teamActions.delete(teamId);
  }

  addMember(teamId: string, playerId: string, gold: number = 0): void {
    teamActions.addMember(teamId, playerId, gold);
  }

  removeMember(teamId: string, playerId: string): void {
    teamActions.removeMember(teamId, playerId);
  }

  updateMemberGold(teamId: string, playerId: string, gold: number): void {
    teamActions.updateMemberGold(teamId, playerId, gold);
  }

  reorderMembers(teamId: string, newOrder: string[]): void {
    teamActions.reorderMembers(teamId, newOrder);
  }

  reorder(newOrder: string[]): void {
    teamActions.reorder(newOrder);
  }

  clear(): void {
    teamActions.clear();
  }
}
