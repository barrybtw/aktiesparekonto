'use client';

import { useCalculatorStore } from '@/stores/calculator-store';

export default function Projections() {
  const estimated_return_in_percent = useCalculatorStore(
    (state) => state.estimatedReturnInPercent,
  );
  const monthly_payment = useCalculatorStore((state) => state.monthlyPayment);

  return <div className='flex flex-col space-y-4'>hello</div>;
}
