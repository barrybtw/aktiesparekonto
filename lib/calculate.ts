import { useMemo } from 'react';

interface CalculateProps {
  years: number;
  monthlyDeposit: number;
  interestRate: number;
  taxRate: number;
}

export type YearlyProgress = Partial<{
  [year: number]: {
    valueThisYear: number;
    profitThisYear: number;
    profitToThisYear: number;
    taxesThisYear: number;
    taxesToThisYear: number;
  };
}>;

export type MonthlyProgress = Partial<{
  [month: number]: {
    valueThisMonth: number;
    profitThisMonth: number;
    profitToThisMonth: number;
    taxesPaidSoFar: number;
  };
}>;

function calculate(
  years: number,
  monthlyDeposit: number,
  interestRate: number,
  yearlyTaxRate: number,
) {
  let yearlyProgress: YearlyProgress = {};
  let monthlyProgress: MonthlyProgress = {};

  let monthlyRate = 1 + interestRate / 100 / 12;

  let totalFromStartToEnd = 0,
    taxesFromStartToEnd = 0,
    profitFromStartToEnd = 0;

  // Loop over each year
  for (let year = 0; year < years; year++) {
    let profitFromThisYear = 0;

    // Loop over each month
    for (let month = 0; month < 12; month++) {
      let profitFromThisMonth = 0;
      if (month !== 0 || year !== 0) {
        profitFromThisMonth =
          totalFromStartToEnd * monthlyRate - totalFromStartToEnd;
      }

      totalFromStartToEnd += monthlyDeposit + profitFromThisMonth;
      profitFromThisYear += profitFromThisMonth;
      profitFromStartToEnd += profitFromThisMonth;

      let indiced_month = year * 12 + month;

      monthlyProgress[indiced_month] = {
        valueThisMonth: totalFromStartToEnd,
        profitThisMonth: profitFromThisMonth,
        profitToThisMonth: profitFromStartToEnd,
        taxesPaidSoFar: taxesFromStartToEnd,
      };
    }

    // Pay yearly taxes
    const estimatedTax = profitFromThisYear * yearlyTaxRate;
    taxesFromStartToEnd += estimatedTax;
    totalFromStartToEnd -= estimatedTax;

    yearlyProgress[year] = {
      valueThisYear: totalFromStartToEnd,
      profitThisYear: profitFromThisYear,
      profitToThisYear: profitFromStartToEnd,
      taxesThisYear: estimatedTax,
      taxesToThisYear: taxesFromStartToEnd,
    };
  }

  return {
    totals: {
      totalFromStartToEnd,
      taxesFromStartToEnd,
      profitFromStartToEnd,
    },
    individualProgress: {
      monthly: Object.values(monthlyProgress) as Array<
        MonthlyProgress[keyof MonthlyProgress]
      >,
      yearly: Object.values(yearlyProgress) as Array<
        YearlyProgress[keyof YearlyProgress]
      >,
    },
  };
}
export function useStockCalculator(props: CalculateProps) {
  const { years, monthlyDeposit, interestRate, taxRate } = props;

  return useMemo(() => {
    return calculate(years, monthlyDeposit, interestRate, taxRate);
  }, [years, monthlyDeposit, interestRate, taxRate]);
}
