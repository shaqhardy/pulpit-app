import './globals.css'

export const metadata = {
  title: 'Pulpit - Speaker Booking Platform',
  description: 'The booking platform for speakers, worship leaders, and event planners',
  manifest: '/manifest.json',
  themeColor: '#0A0A0A',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
