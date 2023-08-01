// @ts-ignore
import type { MonthlyProgress, YearlyProgress } from './calculate';

// Take all the months and use .toFixed(2) on all the numbers

export function useTransform(
  decimals: number,
  data: [YearlyProgress, MonthlyProgress],
) {
  let [yearlyProgress, monthlyProgress] = data;

  let yearlyProgressTransformed: YearlyProgress = {};
  let monthlyProgressTransformed: MonthlyProgress = {};

  for (let year in yearlyProgress) {
    yearlyProgressTransformed[year] = {};
    for (let key in yearlyProgress[year]) {
      yearlyProgressTransformed[year][key] = Number(
        yearlyProgress[year][key].toFixed(decimals),
      );
    }
  }

  for (let month in monthlyProgress) {
    monthlyProgressTransformed[month] = {};
    for (let key in monthlyProgress[month]) {
      monthlyProgressTransformed[month][key] = Number(
        monthlyProgress[month][key].toFixed(decimals),
      );
    }
  }

  return [yearlyProgressTransformed, monthlyProgressTransformed];
}
