'use client';
import { cn } from '@/lib/utils';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      aria-label='Toggle Dark Mode'
      type='button'
      className={cn(
        'p-1 rounded bg-slate-400/40 text-slate-500/90 dark:bg-slate-800/60 dark:text-slate-400/90',
        'hover:bg-slate-400/60 hover:text-slate-500 hover:dark:bg-slate-800 hover:dark:text-slate-400',
      )}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <SunIcon className='w-4 h-4' aria-label='go light' />
      ) : (
        <MoonIcon className='w-4 h-4' aria-label='go dark' />
      )}
    </button>
  );
}
