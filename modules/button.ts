import { tv } from 'tailwind-variants';

export const button = tv({
  base: 'transition-colors',
  variants: {
    variant: {
      primary: 'text-slate-100 hover:text-slate-300',
      muted: 'text-slate-400 hover:text-slate-100',
      amber: 'text-amber-400 hover:text-amber-300',
      ghost:
        'text-slate-400 hover:text-slate-100 p-1 rounded hover:bg-slate-700/50',
      danger:
        'text-slate-400 hover:text-red-500 hover:bg-red-500/20 p-0.5 rounded',
    },
    size: {
      sm: 'text-base',
      md: 'text-lg',
      lg: 'text-2xl font-bold',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
