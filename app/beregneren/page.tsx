import Projections from '@/components/projections';
import Questionnaire from '@/components/questionnaire';

export default function Home() {
  return (
    <main className='flex flex-col flex-wrap gap-8 mx-auto sm:gap-16 lg:flex-row'>
      <Questionnaire className='min-w-[272px]' />
      <Projections />
    </main>
  );
}
