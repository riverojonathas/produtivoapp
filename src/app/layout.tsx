import { ThemeProvider } from '@/providers/theme-provider'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Produtivo',
  description: 'Plataforma de gestão de produtos digitais',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="produtivo-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
} 