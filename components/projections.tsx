'use client';

import { useCalculatorStore } from '@/stores/calculator-store';
import { useMemo } from 'react';

export default function Projections() {
  const {
    monthlyPayment,
    estimatedReturnInPercent,
    yearsToLookAhead,
    ..._setters
  } = useCalculatorStore();

  const { value, taxes } = useMemo(() => {
    let starting_value = 0;
    let taxes_yearly_rate = 0.17;
    let taxes_has_taken = 0;
    let monthly_rate = 1 + estimatedReturnInPercent / 100 / 12;

    // For each year
    for (let year = 0; year < yearsToLookAhead; year++) {
      // For each month
      for (let month = 0; month < 12; month++) {
        // Ignore the first month since the you don't get the interest until the end of the month
        if (month != 0 || year != 0) starting_value *= monthly_rate;
        starting_value += monthlyPayment;
      }

      // Pay taxes
      let tax_to_pay = starting_value * taxes_yearly_rate;
      taxes_has_taken += tax_to_pay;
      starting_value -= tax_to_pay;
    }

    return { value: starting_value.toFixed(2), taxes: taxes_has_taken };
  }, [monthlyPayment, estimatedReturnInPercent, yearsToLookAhead]);

  if (isNaN(monthlyPayment)) return null;

  return (
    <div className='flex flex-col space-y-4'>
      Du har {value} DKK efter {yearsToLookAhead} år med{' '}
      {estimatedReturnInPercent}% forventet stigning per annum. Du har betalt{' '}
      {taxes.toFixed(2)} DKK i skat.
    </div>
  );
}
