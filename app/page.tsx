import Link from 'next/link';

export default function Home() {
  return (
    <main className='transition-colors bg-slate-50 dark:bg-'>
      <p>Dette er forsiden</p>
      <Link href={'beregneren'} className='underline'>
        Gå til beregneren
      </Link>
    </main>
  );
}
