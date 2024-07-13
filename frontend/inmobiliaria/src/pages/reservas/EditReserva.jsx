import React, { useEffect, useState } from "react";
import NavBarComponent from "../../components/NavBarComponent";
import HeaderComponent from "../../components/HeaderComponent";
import { useNavigate, useLocation } from "react-router-dom";
import { obtenerInquilinos } from "../../utils/peticionesInquilinos";
import axios from "axios";
import Swal from "sweetalert2";
import { editarReserva } from "../../utils/peticionesReservas";
import {
  buscarIdEnArregloPropiedades,
  buscarIdEnArregloInquilino,
} from "../../utils/armarArreglos";
import FooterComponent from "../../components/FooterComponent";

function EditReserva() {
  const navigate = useNavigate();
  const location = useLocation();
  const [reservas, setReservas] = useState({
    id: location.state.data.id,
    cantidad_noches: location.state.data.cantidad_noches,
    fecha_desde: location.state.data.fecha_desde,
  });
  const [reservaSelect, setReservaSelect] = useState({
    propiedad_id: 0,
    inquilino_id: 0,
  });
  const [reservaSelectNombre, setReservaSelectNombre] = useState({
    propiedad_id: location.state.data.propiedad_id,
    inquilino_id: location.state.data.inquilino_id,
  });
  const [propiedades, setPropiedades] = useState([]);
  const [inquilinos, setInquilinos] = useState([]);

  async function obtenerInformacionSelect() {
    try {
      const responsePropiedades = await axios({
        method: "get",
        url: "http://localhost:80/propiedades",
      });
      setPropiedades(responsePropiedades.data.OK);
      const responseInquilinos = await obtenerInquilinos();
      setInquilinos(responseInquilinos);
      setReservaSelect({
        propiedad_id: buscarIdEnArregloPropiedades(
          responsePropiedades.data.OK,
          reservaSelectNombre.propiedad_id
        ),
        inquilino_id: buscarIdEnArregloInquilino(
          responseInquilinos,
          reservaSelectNombre.inquilino_id
        ),
      });
    } catch {
      (error) => console.log(error);
    }
  }
  useEffect(() => {
    obtenerInformacionSelect();
  }, []);
  function handleReservaSelect(event) {
    const name = event.target.name;
    const nombre = event.target.value;
    const value = event.target.selectedOptions[0].accessKey;
    setReservaSelect({
      ...reservaSelect,
      [name]: value,
    });
    setReservaSelectNombre({
      ...reservaSelectNombre,
      [name]: nombre,
    });
  }
  function hadleReserva(event) {
    const { name, value } = event.target;
    setReservas({
      ...reservas,
      [name]: value,
    });
  }
  function hadleNumericReserva(event) {
    const { name, valueAsNumber } = event.target;
    setReservas({
      ...reservas,
      [name]: valueAsNumber,
    });
  }
  async function enviarInformacion(event) {
    event.preventDefault();
    console.log("estoy aca");
    let response = await editarReserva(reservas, reservaSelect);
    if (response == 200) {
      Swal.fire({
        title: "Se ingreso la reserva correctamente",
      }).then((respuesta) => {
        if (respuesta.isConfirmed) {
          navigate("/reservas");
        }
      });
    }
    if (response == 400) {
      Swal.fire({
        title:
          "No se pudo ingresar la reserva. El error puede deverse a los siguientes casos:",
        text:
          "1 No ingreso todos los campos necesarios. " +
          "2 la propiedad seleccionada no esta disponible en este momento." +
          " 3 El inquilino no esta activo",
      });
    }
    if (response == 404) {
      Swal.fire({
        title:
          "No se pudo ingresar la reserva porque no se encuentra uno de los siguientes datos:",
        text:
          "1 No se encontro la propiedad con" + "2. No se econtro el inquilino",
      });
    }
  }

  return (
    <div className="page">
      <HeaderComponent paginaActual={"Editar reserva"}/>
      <NavBarComponent />
      <div className="formulario">
        <form className="form" onSubmit={enviarInformacion}>
          <label className="label-form">Domicilio: </label>
          <select
            name="propiedad_id"
            required
            onChange={handleReservaSelect}
            value={reservaSelectNombre.propiedad_id}
            className="input-form"
          >
            <option>Seleccione un propiedad</option>
            {propiedades.length != 0 ? (
              propiedades.map((element) => (
                <option accessKey={element.id} key={element.id}>
                  {element.domicilio}
                </option>
              ))
            ) : (
              <option>Seleccione un propiedad</option>
            )}
          </select>
          <label className="label-form">Inquilino: </label>
          <select
            name="inquilino_id"
            required
            onChange={handleReservaSelect}
            value={reservaSelectNombre.inquilino_id}
            className="input-form"
          >
            <option>Seleccione un inquilino</option>
            {inquilinos.map((element) => (
              <option key={element.id} accessKey={element.id}>
                {element.nombre + " " + element.apellido}
              </option>
            ))}
          </select>
          <label className="label-form">Fecha desde: </label>
          <input
            required
            type="date"
            name="fecha_desde"
            onChange={hadleReserva}
            value={reservas.fecha_desde}
            className="input-form"
          />
          <label className="label-form">Cantidad de noches: </label>
          <input
            required
            type="number"
            name="cantidad_noches"
            onChange={hadleNumericReserva}
            value={reservas.cantidad_noches}
            className="input-form"
          />
          <div className="container-btn">
            <button className="btn-end-form" type="submit">
              Enviar
            </button>
            <button
              onClick={() => {
                navigate("/reservas");
              }}
              className="btn-end-form"
            >
              Volver
            </button>
          </div>
        </form>
      </div>
      <FooterComponent />
    </div>
  );
}

export default EditReserva;
