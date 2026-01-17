import { forwardRef } from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';

interface TooltipProps {
  label: string;
  children: React.ReactNode;
}

const TriggerSpan = forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>((props, ref) => <span ref={ref} {...props} className='inline-flex' />);

export function Tooltip({ label, children }: TooltipProps) {
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger render={<TriggerSpan />}>
        {children}
      </BaseTooltip.Trigger>
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner
          sideOffset={8}
          className='z-[100] pointer-events-none'
        >
          <BaseTooltip.Popup className='bg-black rounded-lg px-3 py-2 shadow-xl text-white text-xs'>
            {label}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
