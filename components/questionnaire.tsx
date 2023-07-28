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
import { Separator } from '@/components/ui/separator';
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
    <div className={cn(className)} {...props}>
      <Form {...form}>
        {/* use grid to add a gap between formfields and button */}
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className='grid grid-cols-1 gap-8'
        >
          <div className={cn('flex flex-col box-border gap-8')}>
            <FormField
              control={form.control}
              name='monthly_payment'
              render={({ field }) => (
                <FormItem className='flex flex-col gap-2'>
                  <FormLabel>Månedlig indskud</FormLabel>
                  <FormControl>
                    {/* <div aria-label='wrapper' className='relative'> */}
                    <Input
                      {...field}
                      className='max-w-[280px] my-2'
                      aria-invalid={
                        form.formState.errors.monthly_payment ? 'true' : 'false'
                      }
                      type='number'
                      min={0}
                    />
                    {/* <pre className='absolute right-2 top-[7px] text-white/50 pointer-events-none'>
                        dkk
                      </pre>
                    </div> */}
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
                    {/* <div aria-label='wrapper' className='relative'> */}
                    <Input
                      {...field}
                      className='max-w-[280px] my-2'
                      aria-invalid={
                        form.formState.errors.estimated_return_in_percent
                          ? 'true'
                          : 'false'
                      }
                      type='number'
                    />
                    {/* <pre className='absolute right-2 top-[7px] text-white/50 pointer-events-none'>
                        %
                      </pre>
                    </div> */}
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
                    {/* <div aria-label='wrapper' className='relative'> */}
                    <Input
                      {...field}
                      className='max-w-[280px] my-2'
                      aria-invalid={
                        form.formState.errors.years_to_look_ahead
                          ? 'true'
                          : 'false'
                      }
                      type='number'
                    />
                    {/* <pre className='absolute right-2 top-[7px] text-white/50 pointer-events-none'>
                        år
                      </pre> */}
                    {/* </div> */}
                  </FormControl>
                  <FormDescription>
                    Hvor mange år er du villig til at vente på at realisere
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
          </div>
          {form.formState.isValid ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type='submit'
                    variant='default'
                    className='max-w-[280px]'
                  >
                    Beregn
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {form.formState.isValid
                      ? 'Tryk for at beregne'
                      : 'Ugyldig input'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type='submit'
                    variant='default'
                    className='max-w-[280px]'
                  >
                    Beregn
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {form.formState.isValid
                      ? 'Tryk for at beregne'
                      : 'Ugyldig input'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </form>
      </Form>
    </div>
  );
}
