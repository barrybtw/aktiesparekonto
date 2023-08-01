import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import ThemeSwitch from './theme-switch';

export default function Navigation({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn('flex items-center w-full', className)} {...props}>
      <ul className='flex items-center w-full space-x-4 lg:space-x-6'>
        <Link
          href='/'
          className='text-sm font-medium transition-colors dark:text-zinc-400 dark:hover:text-neutral-50 hover:text-slate-800'
        >
          Forside
        </Link>
        <Link
          href='/beregneren'
          className='text-sm font-medium transition-colors dark:text-zinc-400 dark:hover:text-neutral-50 hover:text-slate-800'
        >
          Beregneren
        </Link>
      </ul>
      <ThemeSwitch />
    </nav>
  );
}
