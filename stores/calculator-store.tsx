'use client';

import { create } from 'zustand';

type CalculatorStore = {
  monthlyPayment: number;
  estimatedReturnInPercent: number;
  setMonthlyPayment: (monthlyPayment: number) => void;
  setEstimatedReturnInPercent: (estimatedReturnInPercent: number) => void;
};

export const useCalculatorStore = create<CalculatorStore>()((set) => ({
  monthlyPayment: NaN,
  estimatedReturnInPercent: NaN,
  setMonthlyPayment: (monthlyPayment: number) =>
    set((state) => ({ ...state, monthlyPayment })),
  setEstimatedReturnInPercent: (estimatedReturnInPercent: number) =>
    set((state) => ({ ...state, estimatedReturnInPercent })),
}));
