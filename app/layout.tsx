import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import Navigation from '@/components/navigation';

const inter = Inter({
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='da' suppressHydrationWarning>
      <body className={cn(inter.className, '')}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <div className='flex items-center justify-start h-16 px-4 md:px-12'>
            <Navigation className='' />
          </div>
          <div className='px-4 mx-auto mt-8 md:px-12'>{children}</div>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
