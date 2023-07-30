import Projections from '@/components/projections';
import Questionnaire from '@/components/questionnaire';
import Link from 'next/link';

export default function Home() {
  return (
    <main className=''>
      <p>Dette er forsiden</p>
      <Link href={'beregneren'} className='underline'>
        Gå til beregneren
      </Link>
    </main>
  );
}
