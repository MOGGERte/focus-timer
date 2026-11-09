import { Inter } from 'next/font/google'
import Script from 'next/script'
import { SETTINGS_KEY } from '@/lib/storage'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-sans',
})

const themeBootScript = `
try {
  var settings = JSON.parse(localStorage.getItem(${JSON.stringify(SETTINGS_KEY)}) || '{}');
  var root = document.documentElement;
  root.dataset.mode = settings.isDarkMode ? 'dark' : 'light';
  root.dataset.theme = settings.theme || 'default';
} catch (error) {}
`

export const metadata = {
  title: 'Focus Timer',
  description: 'Timer for focus and productivity',
  icons: {
    icon: '/logo.svg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <Script id="theme-boot" strategy="beforeInteractive">
          {themeBootScript}
        </Script>
        {children}
      </body>
    </html>
  )
}
