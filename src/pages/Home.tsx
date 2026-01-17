import { PlayerCardGrid, DeleteModeBar } from '@components/HomePage';

function Home() {
  return (
    <div className='max-w-7xl mx-auto pt-1'>
      <PlayerCardGrid />
      <DeleteModeBar />
    </div>
  );
}

export default Home;
