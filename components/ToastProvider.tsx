import { Toast } from '@base-ui/react/toast';

export function ToastViewport() {
  const toastManager = Toast.useToastManager();

  return (
    <Toast.Portal>
      <Toast.Viewport className='fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 w-[400px] max-w-[90vw]'>
        {toastManager.toasts.map((toast) => (
          <Toast.Root
            key={toast.id}
            toast={toast}
            className='bg-zinc-800 border border-white/20 rounded-lg shadow-xl px-5 py-4 text-white data-[starting-style]:opacity-0 data-[starting-style]:-translate-y-2 data-[ending-style]:opacity-0 data-[ending-style]:-translate-y-2 transition-all duration-200'
          >
            <Toast.Title className='font-semibold text-lg'>
              {toast.title}
            </Toast.Title>
            {toast.description && (
              <Toast.Description className='text-gray-400 text-base mt-1'>
                {toast.description}
              </Toast.Description>
            )}
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  );
}
