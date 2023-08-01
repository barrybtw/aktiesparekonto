'use client';

import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCalculatorStore } from '@/stores/calculator-store';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { useMemo } from 'react';

const formSchema = z.object({
  monthly_payment: z.coerce.number().min(0),
  estimated_return_in_percent: z.coerce.number(),
  years_to_look_ahead: z.coerce.number(),
});

export default function Questionnaire({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const calculator_link = useCalculatorStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthly_payment: 500,
      estimated_return_in_percent: 5,
      years_to_look_ahead: 10,
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    calculator_link.setMonthlyPayment(values.monthly_payment);
    calculator_link.setEstimatedReturnInPercent(
      values.estimated_return_in_percent,
    );
    calculator_link.setYearsToLookAhead(values.years_to_look_ahead);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn('space-y-12 grid-cols-1 gap-8', className)}
        {...props}
      >
        <div className={cn('space-y-8')}>
          <FormField
            control={form.control}
            name='monthly_payment'
            render={({ field }) => (
              <FormItem className='flex flex-col gap-2'>
                <FormLabel>Månedlig indskud</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className='max-w-[280px] my-2'
                    aria-invalid={!!form.formState.errors.monthly_payment}
                    type='number'
                    min={0}
                  />
                </FormControl>
                <FormDescription>
                  Hvor meget kan du indbetale hver måned?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name='estimated_return_in_percent'
            render={({ field }) => (
              <FormItem className='flex flex-col gap-2'>
                <FormLabel>Årlig Udbytteprocent</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className='max-w-[280px] my-2'
                    aria-invalid={
                      !!form.formState.errors.estimated_return_in_percent
                    }
                    type='number'
                  />
                </FormControl>
                <FormDescription>
                  Hvor meget regner du med at få i afkast om året?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name='years_to_look_ahead'
            render={({ field }) => (
              <FormItem className='flex flex-col gap-2'>
                <FormLabel>År til realisation</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className='max-w-[280px] my-2'
                    aria-invalid={!!form.formState.errors.years_to_look_ahead}
                    type='number'
                  />
                </FormControl>
                <FormDescription>
                  Hvor mange år er du villig til at vente på at realisere
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
        </div>
        <Button type='submit' variant='default' className='max-w-[280px]'>
          Beregn
        </Button>
      </form>
    </Form>
  );
}
