import React from 'react'
import Link from 'next/link';

const HomePage = () => {
  return (
    <div>
      <h1 className="text-3xl">Bienvenido!</h1>
      <Link href="/properties">Mostrar Propiedades</Link>
    </div>
  )
}

export default HomePage;