import { playerActions } from '@services/Store';
import { ranks, actionButton } from '@modules';
import { UserRoundPlus } from 'lucide-react';
import { Button } from '@base-ui/react/button';

const randomNames = [
  'Shadow',
  'Frost',
  'Crimson',
  'Solar',
  'Night',
  'Steel',
  'Silver',
  'Rogue',
  'Hex',
  'Nova',
  'Ember',
  'Iron',
  'Carbon',
  'Titan',
  'Arctic',
  'Void',
  'Holo',
  'Bold',
  'Rift',
  'Apex',
];
const randomSuffixes = [
  'Strike',
  'Byte',
  'Wolf',
  'Talon',
  'Cipher',
  'Viper',
  'Pulse',
  'Spectre',
  'Reaper',
  'Shield',
  'Knight',
  'Raven',
  'Warden',
  'Blade',
  'Zen',
  'Caster',
  'Sparrow',
  'Gryphon',
  'Oracle',
  'Phantom',
];

function generateRandomPlayer() {
  const name =
    randomNames[Math.floor(Math.random() * randomNames.length)] +
    randomSuffixes[Math.floor(Math.random() * randomSuffixes.length)];
  const rank = ranks[Math.floor(Math.random() * ranks.length)];
  const tier = Math.floor(Math.random() * 4) + 1;
  const lp = Math.floor(Math.random() * 500);
  const games = Math.floor(Math.random() * 200) + 10;
  const gold = Math.floor(Math.random() * 30);
  const avatarSeed = crypto.randomUUID();

  return { name, rank, tier, lp, games, gold, avatarSeed };
}

export function CreatePlayer() {
  const handleCreatePlayer = () => {
    playerActions.create(generateRandomPlayer());
    setTimeout(() => {
      const scrollContainer = document.querySelector(
        'main > div.overflow-auto',
      );
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 0);
  };

  return (
    <Button
      onClick={handleCreatePlayer}
      className={actionButton({ class: 'p-2' })}
      title='Create new player'
    >
      <UserRoundPlus className='w-7 h-7' />
    </Button>
  );
}
