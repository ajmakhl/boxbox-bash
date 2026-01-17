import { Menu } from '@base-ui/react/menu';
import { Toast } from '@base-ui/react/toast';
import { Upload, Info } from 'lucide-react';
import { actionButton } from '@modules';
import { dataTransfer } from '@services/dataTransfer';
import { Tooltip } from './Tooltip';

interface ExportMenuProps {
  disabled?: boolean;
}

export function ExportMenu({ disabled }: ExportMenuProps) {
  const toastManager = Toast.useToastManager();

  const handleExportAll = () => {
    const data = dataTransfer.exportAll();
    navigator.clipboard.writeText(data);
    toastManager.add({
      title: 'Full export copied!',
      description:
        'All data including notes and gold values has been copied. Save it to a file to import later.',
    });
  };

  const handleExportLimited = () => {
    const data = dataTransfer.exportLimited();
    navigator.clipboard.writeText(data);
    toastManager.add({
      title: 'Limited export copied!',
      description:
        'Player data copied without notes or gold values. Save it to a file to share with others.',
    });
  };

  return (
    <Menu.Root>
      <Menu.Trigger
        disabled={disabled}
        className={actionButton({
          class: `p-2 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`,
        })}
      >
        <Upload className='w-7 h-7' />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner
          className='z-[100]'
          side='bottom'
          align='end'
          sideOffset={8}
        >
          <Menu.Popup className='bg-zinc-800 border border-white/20 rounded-lg shadow-xl p-2 min-w-[200px]'>
            <Menu.Item
              onClick={handleExportAll}
              className='flex items-center justify-between px-4 py-2 text-sm text-white hover:bg-white/10 cursor-pointer transition-colors rounded-md'
            >
              <span>Export All</span>
              <Tooltip label='Exports everything: players, notes, teams, and gold values'>
                <Info className='w-4 h-4 text-gray-400' />
              </Tooltip>
            </Menu.Item>
            <Menu.Item
              onClick={handleExportLimited}
              className='flex items-center justify-between px-4 py-2 text-sm text-white hover:bg-white/10 cursor-pointer transition-colors rounded-md'
            >
              <span>Export Limited</span>
              <Tooltip label='Exports only players without notes, teams, or gold. Good for sharing'>
                <Info className='w-4 h-4 text-gray-400' />
              </Tooltip>
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
