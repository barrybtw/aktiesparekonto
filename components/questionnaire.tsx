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

const formSchema = z.object({
  monthly_payment: z.coerce.number().min(0),
  estimated_return_in_percent: z.coerce.number(),
});

export default function Questionnaire({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthly_payment: 500,
      estimated_return_in_percent: 5,
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className={cn(className, '')} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div
            className={cn(
              'flex flex-row space-x-4 md:space-x-8 box-border min-h-[150px]',
            )}
          >
            <FormField
              control={form.control}
              name='monthly_payment'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Månedlig indskud</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      aria-invalid={
                        form.formState.errors.monthly_payment ? 'true' : 'false'
                      }
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
                <FormItem>
                  <FormLabel>Årlig Udbytteprocent</FormLabel>
                  <FormControl>
                    <div aria-label='wrapper' className='relative'>
                      <Input
                        {...field}
                        aria-invalid={
                          form.formState.errors.monthly_payment
                            ? 'true'
                            : 'false'
                        }
                        type='number'
                        className='appearance-none'
                      />
                      <pre className='absolute right-2 top-[7px] text-white/50 pointer-events-none'>
                        %
                      </pre>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Hvor meget regner du med at få i afkast om året?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
          </div>

          <Button type='submit' className='relative inset-0'>
            Beregn
          </Button>
        </form>
      </Form>
    </div>
  );
}
