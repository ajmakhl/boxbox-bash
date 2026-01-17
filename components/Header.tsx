import { Link, useLocation } from 'react-router';
import { House, NotebookText, Users } from 'lucide-react';
import { actionButton } from '@modules';
import { CreatePlayer } from './CreatePlayer';
import { RemovePlayer } from './RemovePlayer';
import { ClearAllButton } from './ClearAllButton';
import { ExportMenu } from './ExportMenu';
import { ImportButton } from './ImportButton';
import { BrandLogo } from './BrandLogo';
import { Tooltip } from './Tooltip';
import { useDeleteMode } from '@hooks/useDeleteMode';
import { service } from '@services/index';

export function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { isDeleteMode } = useDeleteMode();
  const { order } = service.useSnapshot();
  const hasPlayers = order.length > 0;

  return (
    <header className='sticky top-0 z-50 bg-slate-800 text-center px-0 p-6'>
      <div className='max-w-7xl mx-auto flex gap-4 items-center justify-between'>
        <nav className='flex gap-4 items-center'>
          <BrandLogo />
          <Tooltip label='Home'>
            <Link className={actionButton({ class: 'p-2' })} to='/'>
              <House className='w-7 h-7' />
            </Link>
          </Tooltip>
          <Tooltip label={hasPlayers ? 'Notes' : 'Add players first'}>
            {hasPlayers ? (
              <Link className={actionButton({ class: 'p-2' })} to='/notes'>
                <NotebookText className='w-7 h-7' />
              </Link>
            ) : (
              <span
                className={actionButton({
                  class: 'p-2 opacity-50 cursor-not-allowed',
                })}
              >
                <NotebookText className='w-7 h-7' />
              </span>
            )}
          </Tooltip>
          <Tooltip label={hasPlayers ? 'Teams' : 'Add players first'}>
            {hasPlayers ? (
              <Link className={actionButton({ class: 'p-2' })} to='/teams'>
                <Users className='w-7 h-7' />
              </Link>
            ) : (
              <span
                className={actionButton({
                  class: 'p-2 opacity-50 cursor-not-allowed',
                })}
              >
                <Users className='w-7 h-7' />
              </span>
            )}
          </Tooltip>
        </nav>
        <p className='text-slate-400'>
          {isHomePage
            ? isDeleteMode
              ? 'Click players to select for deletion'
              : hasPlayers
                ? 'Click to edit fields • Drag to reorder'
                : 'Add a player or import to get started!'
            : ''}
        </p>
        <nav className='flex gap-4'>
          {isHomePage && (
            <Tooltip label={hasPlayers ? 'Clear All' : 'No players to clear'}>
              <ClearAllButton disabled={!hasPlayers} />
            </Tooltip>
          )}
          {isHomePage && (
            <Tooltip label={hasPlayers ? 'Export' : 'No players to export'}>
              <ExportMenu disabled={!hasPlayers} />
            </Tooltip>
          )}
          {isHomePage && (
            <Tooltip label='Import'>
              <ImportButton />
            </Tooltip>
          )}
          {isHomePage && (
            <Tooltip
              label={hasPlayers ? 'Remove Players' : 'No players to remove'}
            >
              <RemovePlayer />
            </Tooltip>
          )}
          {isHomePage && (
            <Tooltip label='Add Player'>
              <CreatePlayer />
            </Tooltip>
          )}
        </nav>
      </div>
    </header>
  );
}
