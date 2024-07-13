import { React, useState, useEffect } from "react";
import Swall from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import "./../../css/css_pages/formulario.css";
import { editarPropiedad } from "../../utils/peticionesPropiedades";
import { pedirTipoPropiedades } from "../../utils/peticionesTipoPropiedad";
import { pedirLocalidad } from "../../utils/peticionesLocalidad";
import { buscarIdEnArreglo } from "../../utils/armarArreglos";
import HeaderComponent from "../../components/HeaderComponent";
import NavBarComponent from "../../components/NavBarComponent";
import FooterComponent from "../../components/FooterComponent";
import "./../../css/css_pages/formulario.css";

function EditPropiedad() {
  const navigate = useNavigate();
  const location = useLocation();
  const [listaLocalidad, setListaLocalidad] = useState([]);
  const [listaTipoPropiedad, setListaTipoPropiedad] = useState([]);
  const data = location.state.data;
  const [datosSelect, setDatosSelect] = useState({
    localidad: 0,
    tipo_propiedad: 0,
  });
  const [datosSelectInput, setDatosSelectInput] = useState({
    localidad: data.localidad_id,
    tipo_propiedad: data.tipo_propiedad_id,
  });
  const [datos, setDatos] = useState({
    id: data.id,
    domicilio: data.domicilio,
    cantidad_habitaciones: data.cantidad_habitaciones,
    cantidad_banios: data.cantidad_banios,
    cantidad_huespedes: data.cantidad_huespedes,
    fecha_disponibilidad: data.fecha_inicio_disponibilidad,
    cantidad_dias: data.cantidad_dias,
    valor_noche: data.valor_noche,
    imagen:data.imagen,
    tipo_imagen:data.tipo_imagen
  });
  const [datosBool, setDatosBool] = useState({
    cochera: data.cochera,
    disponible: data.disponible,
  });
  const [datosCheckInput, setDatosCheckInput] = useState({
    cochera: data.cochera == 1 ? true : false,
    disponible: data.disponible == 1 ? true : false,
  });
  const handleSelect = (event) => {
    const key = event.target.selectedOptions[0].accessKey;
    const name = event.target.name;
    setDatosSelect({
      ...datosSelect,
      [name]: key,
    });
    let value = event.target.value;
    setDatosSelectInput({
      ...datosSelectInput,
      [name]: value,
    });
  };
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    let valor = null;
    if (checked) {
      valor = 1;
    } else {
      valor = 0;
    }
    setDatosCheckInput({
      ...datosCheckInput,
      [name]: checked,
    });
    setDatosBool({
      ...datosBool,
      [name]: valor,
    });
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDatos({
      ...datos,
      [name]: value,
    });
  };
  const handleInputNumericChange = (event) => {
    const { name, valueAsNumber } = event.target;
    setDatos({
      ...datos,
      [name]: valueAsNumber,
    });
  };
  async function mensajeEditar(event) {
    event.preventDefault();
    let estado = await editarPropiedad(datos, datosBool, datosSelect);
    console.log(estado);
    if (estado == 200 || estado == 0 )
      Swall.fire({
        title: "Se ingreso la propiedad",
        confirmButtonText: "OK",
      }).then((response) => {
        if (response.isConfirmed) {
          navigate("/");
        }
      });
    else {
      Swall.fire({
        title: "No se ingreso la propiedad",
        confirmButtonText: "OK",
      });
    }
  }
  async function pedirDatosFaltantes() {
    var responseTipoPropiedad = await pedirTipoPropiedades();
    setListaTipoPropiedad(responseTipoPropiedad);
    var responseLocalidad = await pedirLocalidad();
    setListaLocalidad(responseLocalidad);
    setDatosSelect({
      localidad: buscarIdEnArreglo(responseLocalidad, data.localidad_id),
      tipo_propiedad: buscarIdEnArreglo(
        responseTipoPropiedad,
        data.tipo_propiedad_id
      ),
    });
  }

  useEffect(() => {
    pedirDatosFaltantes();
  }, []);
  return (
    <div className="page">
      <HeaderComponent paginaActual={"Editar propiedad"} />
      <NavBarComponent />
      <div className="formulario">
        <form className="form" onSubmit={mensajeEditar}>
          <label className="label-form">Domicilio:</label>
          <input
            required
            type="text"
            placeholder="domicilio"
            name="domicilio"
            value={datos.domicilio}
            onChange={handleInputChange}
            className="input-form"
          />
          <label className="label-form">Localidad:</label>
          <select
            name="localidad"
            onChange={handleSelect}
            value={datosSelectInput.localidad}
            className="input-form"
          >
            <option value="">Selecciona una campo</option>
            {listaLocalidad.length === 0 ? (
              <option>Nada para mostrar</option>
            ) : (
              listaLocalidad.map((element) => (
                <option accessKey={element.id} key={element.id}>
                  {element.nombre}
                </option>
              ))
            )}
          </select>
          <label className="label-form">Cantidad de habitaciones:</label>
          <input
            type="number"
            inputMode="numeric" 
            name="cantidad_habitaciones"
            value={datos.cantidad_habitaciones}
            onChange={handleInputNumericChange}
            className="input-form"
          />
          <label className="label-form">Cantidad de baños:</label>
          <input
            type="number"
            inputMode="numeric" 
            name="cantidad_banios"
            value={datos.cantidad_banios}
            onChange={handleInputNumericChange}
            className="input-form"
          />
          <label className="label-form">Cantidad de huespedes:</label>
          <input
            min="1"
            required
            inputMode="numeric" 
            type="number"
            name="cantidad_huespedes"
            value={datos.cantidad_huespedes}
            onChange={handleInputNumericChange}
            className="input-form"
          />
          <label className="label-form">Fecha de disponibilidad</label>
          <input
            required
            type="date"
            name="fecha_disponibilidad"
            value={datos.fecha_disponibilidad}
            onChange={handleInputChange}
            className="input-form"
          />
          <label className="label-form">Cantidad de dias:</label>
          <input
            min="1"
            required
            inputMode="numeric" 
            type="number"
            name="cantidad_dias"
            value={datos.cantidad_dias}
            onChange={handleInputNumericChange}
            className="input-form"
          />
          <label className="label-form">Valor Noche:</label>
          <input
            required
            inputMode="numeric" 
            min="1"
            type="number"
            name="valor_noche"
            value={datos.valor_noche}
            onChange={handleInputNumericChange}
            className="input-form"
          />
          <label className="label-form">Que tipo de propiedad es:</label>
          <select
            name="tipo_propiedad"
            onChange={handleSelect}
            value={datosSelectInput.tipo_propiedad}
            className="input-form"
          >
            <option>Seleccione un tipo de propiedad</option>
            {listaTipoPropiedad.length === 0 ? (
              <option>Nada para mostrar</option>
            ) : (
              listaTipoPropiedad.map((element) => (
                <option accessKey={element.id} key={element.id}>
                  {element.nombre}
                </option>
              ))
            )}
          </select>
          <div className="container-input-end">
            <label className="label-form">
              Disponible:
              <input
                type="checkbox"
                name="disponible"
                checked={datosCheckInput.disponible}
                onChange={handleCheckboxChange}
              />
            </label>
            <label className="label-form">
              Tiene cochera:
              <input
                type="checkbox"
                name="cochera"
                onChange={handleCheckboxChange}
                checked={datosCheckInput.cochera}
              />
            </label>
            <label className="label-form">
              imagen de la propiedad:{" "}
              <input
                type="file"
                className = "input-file"
                name="imagen"
                src={data.imagen}
                onChange={(evento) => {
                  Array.from(evento.target.files).forEach((archivo) => {
                    var reader = new FileReader();
                    reader.readAsDataURL(archivo);
                    reader.onload = function () {
                      var arrayAuxiliar = [];
                      var base64 = reader.result;
                      arrayAuxiliar = base64.split(",");
                      base64 = arrayAuxiliar[1];
                      var tipoImagen = arrayAuxiliar[0];
                      setDatos({
                        ...datos,
                        imagen: base64,
                        tipo_imagen:tipoImagen
                      });
                    };
                  });
                }}
              />
            </label>
          </div>
          <div className="container-btn">
            <button className="btn-end-form" type="submit">Enviar</button>
            <button
              onClick={() => {
                navigate("/");
              }}
              className="btn-end-form"
            >
              Volver a la tabla
            </button>
          </div>
        </form>
      </div>
      <FooterComponent />
    </div>
  );
}

export default EditPropiedad;
