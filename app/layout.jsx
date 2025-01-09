import React from 'react'
import '@/assets/styles/globals.css'
import HomePage from './page'
import Navbar from '@/components/Navbar'
//import HomePage from './page'
export const metadata = {
    title: 'PropertyPulse | Find the perfect rental',
    description: 'Find your dream rental property',
    keywords: 'rental, find rentals, find properties',
    equisde: 'rental, find rentals, find properties',
}


const MainLayout = ( {children} ) => {
  return (
    <html lang='en'>
    <body>
            <Navbar/>
            {children}
          
    </body>
    </html>
  )
}

export default MainLayout
