"use client";

// export const metadata = {
//   title: "Rentas Yamora",
//   description: "Esta es la pagina principal de mi proyecto",

// }
export default function RootLayout({ children }) {

  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" href="/images/casaicono.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Rentas Yamora</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
