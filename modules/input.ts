import { tv } from 'tailwind-variants';

export const input = tv({
  base: 'bg-transparent border-b border-slate-400 outline-none [field-sizing:content]',
  variants: {
    size: {
      sm: 'min-w-8 text-base font-mono',
      md: 'min-w-12 text-lg font-mono font-semibold',
      lg: 'min-w-20 text-2xl font-bold text-slate-100',
    },
    color: {
      default: 'text-slate-100',
      amber: 'text-amber-400',
      muted: 'text-slate-400 text-base italic',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'default',
  },
});
