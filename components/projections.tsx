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
import { useStockCalculator } from '@/lib/calculate';

const IntlFormatter = new Intl.NumberFormat('da-DK', {
  style: 'currency',
  currency: 'DKK',
});

const Formatter = (value: number | `${number}`, decimals: number = 2) => {
  let int = +value;
  if (Number.isNaN(int)) {
    throw new Error('Formatter only accepts numbers');
  }

  int = +int.toFixed(decimals);

  return IntlFormatter.format(int);
};

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

  let {
    totals,
    individualProgress: { monthly: monthlyProgress, yearly: yearlyProgress },
  } = useStockCalculator({
    interestRate: estimatedReturnInPercent,
    monthlyDeposit: monthlyPayment,
    taxRate: 0.17,
    years: yearsToLookAhead,
  });

  if (typeof yearlyProgress === 'undefined') {
    return null;
  }

  return (
    <div className={cn(className, 'flex flex-col space-y-4 mb-32')}>
      <Tabs
        defaultValue='years'
        className='[max-width:520px]:overflow-x-scroll w-full overflow-x-auto space-y-4'
      >
        <TabsList>
          <TabsTrigger value='years'>År</TabsTrigger>
          <TabsTrigger value='months'>Måneder</TabsTrigger>
        </TabsList>
        <TabsContent value='years' className=''>
          <Table>
            <TableCaption>En oversigt over årene</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Udgangsår</TableHead>
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
                  {Formatter(monthlyPayment * 12)}
                </TableHead>
                <TableHead aria-label='profit'>{Formatter(0)}</TableHead>
                <TableHead aria-label='skat'>{Formatter(0)}</TableHead>
                <TableHead className='text-right'>
                  {Formatter(monthlyPayment * 12)}
                </TableHead>
              </TableRow>
              {yearlyProgress.map((year, yearIndex) => {
                if (typeof year === 'undefined') {
                  return null;
                }
                const {
                  valueThisYear,
                  profitThisYear,
                  profitToThisYear,
                  taxesThisYear,
                  taxesToThisYear,
                } = year;
                return (
                  <TableRow key={valueThisYear}>
                    <TableHead aria-label='år nummer'>
                      {yearIndex + 1}
                    </TableHead>
                    <TableHead aria-label='indskudt mængde'>
                      {Formatter((yearIndex + 1) * (monthlyPayment * 12))}
                    </TableHead>
                    <TableHead aria-label='profit dette år'>
                      {Formatter(profitThisYear)}
                    </TableHead>
                    <TableHead aria-label='skat dette år'>
                      {Formatter(taxesThisYear)}
                    </TableHead>
                    <TableHead className='text-right'>
                      {Formatter(valueThisYear)}
                    </TableHead>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value='months'>
          <Table>
            <TableCaption>En oversigt over årene</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Udgangsår</TableHead>
                <TableHead>Indskudt</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Total profit</TableHead>
                <TableHead>Skat</TableHead>
                <TableHead className='text-right'>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow key={'magictwo'}>
                <TableHead aria-label='år nummer'>Start</TableHead>
                <TableHead aria-label='indskudt mængde'>
                  {Formatter(monthlyPayment)}
                </TableHead>
                <TableHead aria-label='profit'>{Formatter(0)}</TableHead>
                <TableHead aria-label='skat'>{Formatter(0)}</TableHead>
                <TableHead aria-label='skat'>{Formatter(0)}</TableHead>
                <TableHead className='text-right'>
                  {Formatter(monthlyPayment)}
                </TableHead>
              </TableRow>
              {monthlyProgress.map((month, monthIndex) => {
                if (typeof month === 'undefined') {
                  return null;
                }
                const {
                  valueThisMonth,
                  profitThisMonth,
                  profitToThisMonth,
                  taxesPaidSoFar,
                } = month;
                return (
                  <TableRow key={valueThisMonth}>
                    <TableHead aria-label='år nummer'>
                      {monthIndex + 1}
                    </TableHead>
                    <TableHead aria-label='indskudt mængde'>
                      {Formatter((monthIndex + 1) * monthlyPayment)}
                    </TableHead>
                    <TableHead aria-label='profit dette år'>
                      {Formatter(profitThisMonth)}
                    </TableHead>
                    <TableHead aria-label='profit dette år'>
                      {Formatter(profitToThisMonth)}
                    </TableHead>
                    <TableHead aria-label='skat dette år'>
                      {Formatter(taxesPaidSoFar)}
                    </TableHead>
                    <TableHead className='text-right'>
                      {Formatter(valueThisMonth)}
                    </TableHead>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
