'use client';

import { useCalculatorStore } from '@/stores/calculator-store';
import { useMemo } from 'react';

type years = Partial<{
  [key: number]: {
    value_this_year: number;
    profit_this_year: number;
    taxes_to_pay_this_year: number;
  };
}>;
type months = Partial<{
  [key: number]: {
    value_this_month: number;
    profit_this_month: number;
  };
}>;

const taxes_yearly_rate = 0.17 as const;

export default function Projections() {
  const {
    monthlyPayment,
    estimatedReturnInPercent,
    yearsToLookAhead,
    ..._setters
  } = useCalculatorStore();

  const { value, taxes, stores } = useMemo(() => {
    let monthStore = {} as months;
    let yearStore = {} as years;

    if (isNaN(monthlyPayment)) return { value: 0, taxes: 0 };

    let from_start_to_end = 0;
    let taxes_from_start_to_end = 0;

    let monthly_rate = 1 + estimatedReturnInPercent / 100 / 12;

    [...Array(yearsToLookAhead ?? 0)].forEach((_, year) => {
      let profit_this_year = 0;
      [...Array(12)].forEach((_, month) => {
        let profit_this_month = 0;
        // Ignore the first month since the you don't get the interest until the end of the month
        if (month != 0 || year != 0)
          profit_this_month =
            from_start_to_end * monthly_rate - from_start_to_end;

        from_start_to_end += monthlyPayment + profit_this_month;

        profit_this_year += profit_this_month;

        monthStore[month] = {
          value_this_month: from_start_to_end,
          profit_this_month: profit_this_month,
        };
      });

      // Pay yearly taxes
      let tax_to_pay = profit_this_year * taxes_yearly_rate;
      taxes_from_start_to_end += tax_to_pay;
      from_start_to_end -= tax_to_pay;

      yearStore[year] = {
        value_this_year: from_start_to_end,
        profit_this_year: profit_this_year,
        taxes_to_pay_this_year: tax_to_pay,
      };
    });

    return {
      value: from_start_to_end.toFixed(2),
      taxes: taxes_from_start_to_end.toFixed(2),
      stores: {
        monthStore,
        yearStore,
      },
    };
  }, [monthlyPayment, estimatedReturnInPercent, yearsToLookAhead]);

  if (isNaN(monthlyPayment) || isNaN(yearsToLookAhead)) return null;

  console.table(stores?.monthStore);
  console.table(stores?.yearStore);

  return (
    <div className='flex flex-col space-y-4'>
      Du har {value} DKK efter {yearsToLookAhead} år med{' '}
      {estimatedReturnInPercent}% forventet stigning per annum. Du har betalt{' '}
      {taxes} DKK i skat.
    </div>
  );
}
