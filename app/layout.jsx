import "../src/app/globals.css";

export const metadata = {
  metadataBase: new URL(process.env.URL_DOMAIN),
  title: 'Adam and Brenda Wedding Campaign',
  description: 'An e-invitation to the invited guest for Adam and Brenda wedding',
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: "/opengraph-image.jpg",
  },
 }

export default function RootLayout({
    children,
  }) {
    return (
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    )
  }