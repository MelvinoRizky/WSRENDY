import './globals.css'

export const metadata = {
  title: 'RendyWS - Premium Co-working Spaces',
  description: 'Book premium co-working spaces, meeting rooms, and private offices. Work smarter with RendyWS.',
  keywords: 'coworking, workspace, meeting room, private office, hot desk, jakarta',
  authors: [{ name: 'RendyWS Team' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
} 