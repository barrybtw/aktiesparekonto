import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Navigation({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      <Link
        href='/'
        className='text-sm font-medium transition-colors text-zinc-400 hover:text-neutral-50'
      >
        Forside
      </Link>
      <Link
        href='/om'
        className='text-sm font-medium transition-colors text-zinc-400 hover:text-neutral-50'
      >
        Om projektet
      </Link>
    </nav>
  );
}
