import type { IRank } from '@interfaces/IRank';

export const rankColors: Record<IRank, string> = {
  iron: 'text-zinc-600',
  bronze: 'text-amber-700',
  silver: 'text-gray-400',
  gold: 'text-yellow-500',
  platinum: 'text-teal-400',
  emerald: 'text-green-500',
  diamond: 'text-indigo-400',
  master: 'text-purple-500',
  grandmaster: 'text-red-500',
  challenger: 'text-cyan-300',
};

export const rankBorderColors: Record<IRank, string> = {
  iron: 'border-zinc-600',
  bronze: 'border-amber-700',
  silver: 'border-gray-400',
  gold: 'border-yellow-500',
  platinum: 'border-teal-400',
  emerald: 'border-green-500',
  diamond: 'border-indigo-400',
  master: 'border-purple-500',
  grandmaster: 'border-red-500',
  challenger: 'border-cyan-300',
};
