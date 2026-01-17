import { Header } from '@components/Header';
import { Outlet } from 'react-router';

function App() {
  return (
    <main className='h-screen flex flex-col overflow-hidden px-4'>
      <Header />
      <div className='flex-1 overflow-auto pb-4'>
        <Outlet />
      </div>
    </main>
  );
}

export default App;
