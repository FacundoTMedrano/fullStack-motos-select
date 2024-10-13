import { Outlet, useNavigate } from "react-router-dom";
import useContexto from "../hooks/useContexto";
import useDatos from "../hooks/useDatos";
import LogoutButon from "../components/LogoutButon";

export default function Dashboard() {
    const {
        selectCarac,
        setSelectCaract,
        selectMoto,
        setSelectMoto,
        listaOpcionesMotos,
    } = useContexto();
    const navigate = useNavigate();
    
    const { loading, error, datos } = useDatos();

    function handleChangeCarac(e) {
        const { grupo, valor } = JSON.parse(e.target.value);
        setSelectCaract(e.target.value);
        setSelectMoto("");
        //mover a la pagina con las caracteristicas seleccionadas
        console.log(JSON.parse(e.target.value));
        navigate(`${grupo}/${valor.replace(/\s/g, "_")}`);
    }
    function handleChangeMoto(e) {
        setSelectMoto(e.target.value);
        navigate(`ficha_tecnica/${e.target.value.replace(/\s/g, "_")}`);
    }

    // setListaOpcionesMotos(datos?.motos??[]);
    if (loading) {
        return <div>Cargando</div>;
    }
    if (error) {
        return <div>errores</div>;
    }

    return (
        <div>
            <nav>
                <select value={selectCarac} onChange={handleChangeCarac}>
                    <option value={JSON.stringify({ grupo: "", valor: "" })}>
                        elegir filtro
                    </option>
                    <optgroup label="cilindrada">
                        {datos.cilindradas.map((v) => {
                            const valor = {
                                grupo: "cilindrada",
                                valor: v.cilindrada,
                            };
                            return (
                                <option
                                    key={v._id}
                                    value={JSON.stringify(valor)}
                                >
                                    {v.cilindrada}
                                </option>
                            );
                        })}
                    </optgroup>
                    <optgroup label="estilo">
                        {datos.estilos.map((v) => {
                            const valor = { grupo: "estilo", valor: v.estilo };
                            return (
                                <option
                                    key={v._id}
                                    value={JSON.stringify(valor)}
                                >
                                    {v.estilo}
                                </option>
                            );
                        })}
                    </optgroup>
                    <optgroup label="marca">
                        {datos.marcas.map((v) => {
                            const valor = { grupo: "marca", valor: v.marca };
                            return (
                                <option
                                    key={v._id}
                                    value={JSON.stringify(valor)}
                                >
                                    {v.marca}
                                </option>
                            );
                        })}
                    </optgroup>
                </select>
                <select value={selectMoto} onChange={handleChangeMoto}>
                    <option value="">seleccione una moto</option>
                    {listaOpcionesMotos.map((v) => {
                        return (
                            <option key={v._id} value={v.nombre}>
                                {v.nombre}
                            </option>
                        );
                    })}
                </select>
            </nav>
            <LogoutButon />
            <Outlet />
        </div>
    );
}
