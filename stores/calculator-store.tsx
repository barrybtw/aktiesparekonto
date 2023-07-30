'use client';

import { create } from 'zustand';

type CalculatorStore = {
  monthlyPayment: number;
  estimatedReturnInPercent: number;
  yearsToLookAhead: number;
  setMonthlyPayment: (monthlyPayment: number) => void;
  setEstimatedReturnInPercent: (estimatedReturnInPercent: number) => void;
  setYearsToLookAhead: (yearsToLookAhead: number) => void;
};

export const useCalculatorStore = create<CalculatorStore>()((set) => ({
  monthlyPayment: 500,
  estimatedReturnInPercent: 5,
  yearsToLookAhead: 10,
  setMonthlyPayment: (monthlyPayment: number) =>
    set((state) => ({ ...state, monthlyPayment })),
  setEstimatedReturnInPercent: (estimatedReturnInPercent: number) =>
    set((state) => ({ ...state, estimatedReturnInPercent })),
  setYearsToLookAhead: (yearsToLookAhead: number) =>
    set((state) => ({ ...state, yearsToLookAhead })),
}));
