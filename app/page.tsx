import Navigation from '@/components/Navigation';
import Projections from '@/components/projections';
import Questionnaire from '@/components/questionnaire';

export default function Home() {
  return (
    <main className=''>
      <Questionnaire></Questionnaire>
      <Projections></Projections>
    </main>
  );
}
