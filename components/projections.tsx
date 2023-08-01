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
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const Formatter = (value: number, decimals: number = 2) => {
  if (Number.isNaN(value)) {
    throw new Error('Formatter only accepts numbers');
  }

  return IntlFormatter.format(value);
};

export default function Projections({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { monthlyPayment, estimatedReturnInPercent, yearsToLookAhead } =
    useCalculatorStore();

  let {
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
        <TabsContent value='years'>
          <Table>
            <TableCaption>En oversigt over årene</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className=''>Udgangsår</TableHead>
                <TableHead className='text-right'>Indskudt</TableHead>
                <TableHead className='text-right'>Profit</TableHead>
                <TableHead className='text-right'>Skat</TableHead>
                <TableHead className='text-right '>
                  Total efter skat (DKK)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
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
                    <TableHead>{yearIndex + 1}</TableHead>
                    <TableHead className='text-right'>
                      {Formatter((yearIndex + 1) * (monthlyPayment * 12))}
                    </TableHead>
                    <TableHead className='text-right'>
                      {Formatter(profitThisYear)}
                    </TableHead>
                    <TableHead className='text-right'>
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
                <TableHead className='text-right'>Indskudt</TableHead>
                <TableHead className='text-right'>Profit</TableHead>
                <TableHead className='text-right'>Total profit</TableHead>
                <TableHead className='text-right'>Skat</TableHead>
                <TableHead className='text-right'>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
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
                    <TableHead>{monthIndex + 1}</TableHead>
                    <TableHead className='text-right'>
                      {Formatter((monthIndex + 1) * monthlyPayment)}
                    </TableHead>
                    <TableHead className='text-right'>
                      {Formatter(profitThisMonth)}
                    </TableHead>
                    <TableHead className='text-right'>
                      {Formatter(profitToThisMonth)}
                    </TableHead>
                    <TableHead className='text-right'>
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
