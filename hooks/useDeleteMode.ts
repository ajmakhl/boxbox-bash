import { useSnapshot } from 'valtio';
import { deleteModeStore, deleteModeActions } from '@services/deleteModeStore';

export function useDeleteMode() {
  const snapshot = useSnapshot(deleteModeStore);

  return {
    isDeleteMode: snapshot.isDeleteMode,
    selectedIds: snapshot.selectedIds,
    ...deleteModeActions,
  };
}
