'use client';

import { useCalculatorStore } from '@/stores/calculator-store';
import { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Formatter = new Intl.NumberFormat('da-DK', {
  style: 'currency',
  currency: 'DKK',
});

type YearsData = Partial<{
  [key: number]: {
    valueThisYear: number;
    profitThisYear: number;
    taxesToPayThisYear: number;
    monthsThisYear: MonthsData;
  };
}>;

type MonthsData = Partial<{
  [key: number]: {
    valueThisMonth: number;
    profitThisMonth: number;
  };
}>;

const taxesYearlyRate = 0.17 as const;

export default function Projections() {
  const {
    monthlyPayment,
    estimatedReturnInPercent,
    yearsToLookAhead,
    ..._setters
  } = useCalculatorStore();

  const { finalValue, finalTaxes, allYearsWithMonthsInside } = useMemo(() => {
    // Initialize data stores
    let monthStore = {} as MonthsData;
    let yearStore = {} as YearsData;

    // Check if monthly payment is not a number, return early
    if (isNaN(monthlyPayment)) {
      return { finalValue: 0, finalTaxes: 0 };
    }

    // Calculate monthly interest rate
    const monthlyRate = 1 + estimatedReturnInPercent / 100 / 12;

    // Initialize variables for final value and taxes
    let fromStartToEnd = 0;
    let taxesFromStartToEnd = 0;

    // Loop through the specified number of years
    [...Array(yearsToLookAhead ?? 0)].forEach((_, year) => {
      let profitThisYear = 0;

      // Loop through 12 months for each year
      [...Array(12)].forEach((_, month) => {
        let profitThisMonth = 0;

        // Ignore the first month since you don't get the interest until the end of the month
        if (month !== 0 || year !== 0) {
          profitThisMonth = fromStartToEnd * monthlyRate - fromStartToEnd;
        }

        // Calculate the total amount after adding monthly payment and interest
        fromStartToEnd += monthlyPayment + profitThisMonth;

        // Track the profit earned this year
        profitThisYear += profitThisMonth;

        // Store the data for the current month
        monthStore[month] = {
          valueThisMonth: fromStartToEnd,
          profitThisMonth: profitThisMonth,
        };
      });

      // Pay yearly taxes
      const taxToPay = profitThisYear * taxesYearlyRate;
      taxesFromStartToEnd += taxToPay;
      fromStartToEnd -= taxToPay;

      // Store data for the current year
      yearStore[year] = {
        valueThisYear: fromStartToEnd,
        profitThisYear: profitThisYear,
        taxesToPayThisYear: taxToPay,
        monthsThisYear: { ...monthStore },
      };
    });

    return {
      finalValue: fromStartToEnd.toFixed(2) ?? 0,
      finalTaxes: taxesFromStartToEnd.toFixed(2),
      allYearsWithMonthsInside: yearStore,
    };
  }, [monthlyPayment, estimatedReturnInPercent, yearsToLookAhead]);

  // Check if monthly payment or years to look ahead are not numbers, return null
  if (isNaN(monthlyPayment) || isNaN(yearsToLookAhead)) {
    return null;
  }

  const formattedFinalValue = Formatter.format(+finalValue);
  const formattedMonthlyPaymentTotal = Formatter.format(
    monthlyPayment * 12 * yearsToLookAhead,
  );
  const formattedFinalTaxes = Formatter.format(+finalTaxes);
  const formattedTotalEarnings = Formatter.format(
    +finalValue - monthlyPayment * 12 * yearsToLookAhead,
  );

  return (
    <div className='flex flex-col space-y-4'>
      <div>
        <p>Du har nu {formattedFinalValue}</p>
        <p>Du har indbetalt {formattedMonthlyPaymentTotal}</p>
        <p>Du har betalt {formattedFinalTaxes} til skat</p>
        <p>Du har tjent {formattedTotalEarnings}</p>
      </div>
      <Tabs defaultValue='years' className='w-full'>
        <TabsList>
          <TabsTrigger value='years'>År</TabsTrigger>
          <TabsTrigger value='months'>Måneder</TabsTrigger>
        </TabsList>
        <TabsContent value='years'>
          <Table>
            <TableCaption>En oversigt over årene</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className='w-8'>År</TableHead>
                <TableHead>Indskudt</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Skat</TableHead>
                <TableHead className='text-right'>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(allYearsWithMonthsInside as YearsData).map(
                ([year, data]) => {
                  console.log(data, year);

                  return (
                    <TableRow key={year}>
                      <TableHead aria-label='år nummer'>{+year + 1}</TableHead>
                      <TableHead aria-label='indskudt mængde'>
                        {Formatter.format(
                          (+year as number) + 1 * monthlyPayment * 12,
                        )}
                      </TableHead>
                      <TableHead aria-label='profit'>
                        {Formatter.format(data?.profitThisYear ?? 0)}
                      </TableHead>
                      <TableHead aria-label='skat'>
                        {Formatter.format(data?.taxesToPayThisYear ?? 0)}
                      </TableHead>
                      <TableHead className='text-right'>
                        {Formatter.format(data?.valueThisYear ?? 0)}
                      </TableHead>
                    </TableRow>
                  );
                },
              )}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value='months'></TabsContent>
      </Tabs>
    </div>
  );
}
