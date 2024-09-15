import { useState } from "react"

export const usuarioFormulario = (formularioInicial = {}) => {
    const [ formularioState, setFormularioState] = useState(formularioInicial)

    const onInputChange = ({target}) => {
        const {name, value} = target
        setFormularioState({
            ...formularioState,
            [ name ]: value
        })
    }
  
    const onResetForm = () => {
        setFormularioState (formularioInicial)
    }

    return {
        ...formularioState,
        formularioState,
        onInputChange,
        onResetForm
    }
}
