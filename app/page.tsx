import Projections from '@/components/projections';
import Questionnaire from '@/components/questionnaire';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <main className='flex flex-col gap-8 mt-8 sm:gap-16 lg:flex-row'>
      <Questionnaire className='flex-shrink'></Questionnaire>
      <Separator orientation='vertical' className='hidden h-auto lg:block' />
      <Separator orientation='horizontal' className='w-auto lg:hidden' />
      <Projections></Projections>
    </main>
  );
}
