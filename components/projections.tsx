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
import { cn } from '@/lib/utils';

const Formatter = new Intl.NumberFormat('da-DK', {
  style: 'currency',
  currency: 'DKK',
});

type YearsData = Partial<{
  [key: number]: {
    valueThisYear: number;
    profitThisYear: number;
    profitToThisYear: number;
    taxesToPayThisYear: number;
    taxesToPayToThisYear: number;
    monthsThisYear: MonthsData;
  };
}>;

type MonthsData = Partial<{
  [key: number]: {
    valueThisMonth: number;
    profitThisMonth: number;
    profitToThisMonth: number;
  };
}>;

const taxesYearlyRate = 0.17 as const;

export default function Projections({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { monthlyPayment, estimatedReturnInPercent, yearsToLookAhead } =
    useCalculatorStore();

  const { allYearsWithMonthsInside } = useMemo(() => {
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
    let profitFomStartToEnd = 0;

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
        profitFomStartToEnd += profitThisMonth;

        // Store the data for the current month
        monthStore[month] = {
          valueThisMonth: fromStartToEnd,
          profitThisMonth: profitThisMonth,
          profitToThisMonth: profitThisYear,
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
        profitToThisYear: profitFomStartToEnd,
        taxesToPayThisYear: taxToPay,
        taxesToPayToThisYear: taxesFromStartToEnd,
        monthsThisYear: { ...monthStore },
      };
    });

    return {
      // finalValue: fromStartToEnd.toFixed(2) ?? 0,
      // finalTaxes: taxesFromStartToEnd.toFixed(2),
      allYearsWithMonthsInside: yearStore,
    };
  }, [monthlyPayment, estimatedReturnInPercent, yearsToLookAhead]);

  // Check if monthly payment or years to look ahead are not numbers, return null
  if (isNaN(monthlyPayment) || isNaN(yearsToLookAhead)) {
    return null;
  }

  // const formattedFinalValue = Formatter.format(+finalValue);
  // const formattedMonthlyPaymentTotal = Formatter.format(
  //   monthlyPayment * 12 * yearsToLookAhead,
  // );
  // const formattedFinalTaxes = Formatter.format(+finalTaxes);
  // const formattedTotalEarnings = Formatter.format(
  //   +finalValue - monthlyPayment * 12 * yearsToLookAhead,
  // );

  return (
    <div className={cn(className, 'flex flex-col space-y-4')}>
      <Tabs
        defaultValue='years'
        className='w-full [max-width:560px]:overflow-x-scroll overflow-x-auto space-y-4'
      >
        <TabsList>
          <TabsTrigger value='years'>År</TabsTrigger>
          <TabsTrigger value='months' disabled>
            Måneder (Kommer snart)
          </TabsTrigger>
        </TabsList>
        <TabsContent value='years'>
          <Table>
            <TableCaption>En oversigt over årene</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className='w-20'>Udgangsår</TableHead>
                <TableHead>Indskudt til dato</TableHead>
                <TableHead>Profit til dags dato</TableHead>
                <TableHead>Skat til dags dato</TableHead>
                <TableHead className='text-right'>Total efter skat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow key={'magicone'}>
                <TableHead aria-label='år nummer'>Start</TableHead>
                <TableHead aria-label='indskudt mængde'>
                  {Formatter.format(monthlyPayment * 12)}
                </TableHead>
                <TableHead aria-label='profit'>{Formatter.format(0)}</TableHead>
                <TableHead aria-label='skat'>{Formatter.format(0)}</TableHead>
                <TableHead className='text-right'>
                  {Formatter.format(monthlyPayment * 12)}
                </TableHead>
              </TableRow>
              {Object.entries(allYearsWithMonthsInside as YearsData).map(
                ([year, data]) => {
                  return (
                    <TableRow key={year}>
                      <TableHead aria-label='år nummer'>{+year + 1}</TableHead>
                      <TableHead aria-label='indskudt mængde'>
                        {Formatter.format(
                          ((+year + 1) as number) * (monthlyPayment * 12),
                        )}
                      </TableHead>
                      <TableHead aria-label='profit dette år'>
                        {Formatter.format(data?.profitToThisYear ?? 0)}
                      </TableHead>
                      <TableHead aria-label='skat dette år'>
                        {Formatter.format(data?.taxesToPayToThisYear ?? 0)}
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
