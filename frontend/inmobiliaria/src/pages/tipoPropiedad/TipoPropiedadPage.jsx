import React, { useEffect, useState } from "react";
import { getFormatTableTipoPropiedad } from "../../utils/formatTablePropiedades";
import Table from "../../components/Table";
import {
  pedirTipoPropiedades,
  eliminarTipoPropiedad,
} from "../../utils/peticionesTipoPropiedad";
import { useNavigate } from "react-router-dom";
import NavBarComponent from "../../components/NavBarComponent";
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/FooterComponent"
import './../../css/css_pages/generalPages.css'

function TipoPropiedadPage() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const columns = getFormatTableTipoPropiedad;
  async function obtenerTabla() {
    const response = await pedirTipoPropiedades();
    setData(response);
  }
  useEffect(() => {
    obtenerTabla();
  }, []);
  return (
    <div className="page">
      <HeaderComponent paginaActual={"Tipo propiedad"}/>
      <NavBarComponent />
      <div className ="container-btn-top-page">
      <button
        onClick={() => {
          navigate("/newTipoPropiedad");
        }}
        className="btn-top-page"
      >
        Agregar una nuevo tipo de propiedad
      </button>
      </div>
      <Table
        data={data}
        columns={columns}
        condicion={false}
        funcionEliminar={eliminarTipoPropiedad}
        paginaEditar={"/editarTipoPropiedad"}
        obtenerData={obtenerTabla}
      />
      <FooterComponent/>
    </div>
  );
}
export default TipoPropiedadPage;
