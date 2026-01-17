import { tv } from 'tailwind-variants';

export const badge = tv({
  base: 'absolute -top-px -right-px rounded-tr-xl rounded-bl-xl px-3 py-1 text-xs font-bold uppercase tracking-wider border-l border-b border-slate-700/30',
  variants: {
    rank: {
      iron: 'bg-zinc-600/20 text-zinc-400',
      bronze: 'bg-amber-700/20 text-amber-600',
      silver: 'bg-gray-400/20 text-gray-300',
      gold: 'bg-yellow-500/20 text-yellow-400',
      platinum: 'bg-teal-400/20 text-teal-300',
      emerald: 'bg-green-500/20 text-green-400',
      diamond: 'bg-indigo-400/20 text-indigo-300',
      master: 'bg-purple-500/20 text-purple-400',
      grandmaster: 'bg-red-500/20 text-red-400',
      challenger: 'bg-cyan-300/20 text-cyan-200',
    },
  },
});
