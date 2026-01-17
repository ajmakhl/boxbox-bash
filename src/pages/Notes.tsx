import { Navigate } from 'react-router';
import { NotesPlayerList, NotesList } from '@components/NotesPage';
import { service } from '@services/index';

function Notes() {
  const { order } = service.useSnapshot();

  if (order.length === 0) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className='max-w-7xl mx-auto pt-1 h-full'>
      <div className='grid grid-cols-[300px_1fr] gap-6 h-full'>
        <NotesPlayerList />
        <NotesList />
      </div>
    </div>
  );
}

export default Notes;
