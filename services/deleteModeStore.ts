import { proxy } from 'valtio';
import { proxySet } from 'valtio/utils';
import { Store } from './Store';
import { service } from './index';

interface DeleteModeState {
  isDeleteMode: boolean;
  selectedIds: Set<string>;
}

export const deleteModeStore = proxy<DeleteModeState>({
  isDeleteMode: false,
  selectedIds: proxySet<string>(),
});

export const deleteModeActions = {
  enterDeleteMode() {
    deleteModeStore.isDeleteMode = true;
    deleteModeStore.selectedIds.clear();
  },

  exitDeleteMode() {
    deleteModeStore.isDeleteMode = false;
    deleteModeStore.selectedIds.clear();
  },

  toggleSelection(id: string) {
    if (deleteModeStore.selectedIds.has(id)) {
      deleteModeStore.selectedIds.delete(id);
    } else {
      deleteModeStore.selectedIds.add(id);
    }
  },

  selectAll() {
    deleteModeStore.selectedIds.clear();
    Store.order.forEach((id) => deleteModeStore.selectedIds.add(id));
  },

  deselectAll() {
    deleteModeStore.selectedIds.clear();
  },

  confirmDelete() {
    deleteModeStore.selectedIds.forEach((id) => {
      service.player.delete(id);
    });
    deleteModeStore.isDeleteMode = false;
    deleteModeStore.selectedIds.clear();
  },
};
