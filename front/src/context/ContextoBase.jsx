import { createContext, useState } from "react";

export const Contexto = createContext();

// eslint-disable-next-line react/prop-types
export default function ContextoProvider({ children }) {
    const [selectCarac, setSelectCaract] = useState(() =>
        JSON.stringify({ grupo: "", valor: "" })
    );
    const [selectMoto, setSelectMoto] = useState("");
    const [listaOpcionesMotos, setListaOpcionesMotos] = useState([]);

    return (
        <Contexto.Provider
            value={{
                selectCarac,
                setSelectCaract,
                selectMoto,
                setSelectMoto,
                listaOpcionesMotos,
                setListaOpcionesMotos,
            }}
        >
            {children}
        </Contexto.Provider>
    );
}
