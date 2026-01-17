import { tv } from 'tailwind-variants';

export const card = tv({
  base: 'relative group rounded-xl border bg-slate-800 p-5 transition-all duration-300 hover:shadow-lg',
  variants: {
    rank: {
      iron: 'border-zinc-600/50',
      bronze: 'border-amber-700/50',
      silver: 'border-gray-400/50',
      gold: 'border-yellow-500/50',
      platinum: 'border-teal-400/50',
      emerald: 'border-green-500/50',
      diamond: 'border-indigo-400/50',
      master: 'border-purple-500/50',
      grandmaster: 'border-red-500/50',
      challenger: 'border-cyan-300/50',
    },
  },
});
