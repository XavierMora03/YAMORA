const CuadroBusqueda = () => {
    return (
        <div className="pt-5 h-10 flex items-center max-w-lg mx-auto">
        <form action="/buscar" method="get" ></form>
        <input className="bg-gray-100 flex-1 p-2  border-solid border-2 border-black" type="text" name="busqueda" id="busqueda" placeholder="Búsqueda" autoFocus />
        <button className="bg-gray-100 px-5 p-2 border-solid border-2 border-black">🔍︎ Buscar</button>
        </div>
    )
}

export default CuadroBusqueda