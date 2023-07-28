import Navigation from '@/components/Navigation';

export default function Home() {
  return (
    <div className='flex flex-col'>
      <div className='flex items-center h-16 px-4'>
        <Navigation className='mx-6' />
      </div>
      <main className='flex-1'></main>
    </div>
  );
}
