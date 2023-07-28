import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { Raleway } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

const raleway = Raleway({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='dk' suppressHydrationWarning>
      <body className={raleway.className}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          {children}
        </ThemeProvider>
      </body>
      <Toaster />
    </html>
  );
}
