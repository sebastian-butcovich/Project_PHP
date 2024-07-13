export function checkDataForm(
  datosInputText,
  datosInputSelect
) {
  if (
    datosInputText.domicilio != "" &&
    datosInputSelect.localidad != "" &&
    Number.isInteger(datosInputText.cantidad_habitaciones) &&
    datosInputText.cantidad_habitaciones != 0 &&
    Number.isInteger(datosInputText.cantidad_banios) &&
    datosInputText.cantidad_banios != 0 &&
    Number.isInteger(datosInputText.cantidad_huespedes) &&
    datosInputText.cantidad_huespedes != 0 &&
    datosInputText.fecha_inicio_disponibilidad != "" &&
    Number.isInteger(datosInputText.cantidad_dias) &&
    datosInputText.cantidad_dias != 0 &&
    Number.isInteger(datosInputText.valor_noche) &&
    datosInputText.valor_noche != 0 &&
    datosInputSelect.tipo_propiedad != ""
  )
    return true;
  else {
    return false;
  }
}
export function checkDataFormReserva(reserva,reservaSelect){
    if(reservaSelect.propiedad_id !=0 && 
      reservaSelect.inquilino_id !=0 && 
      reserva.fecha_desde != "" && 
      Number.isInteger(reserva.cantidad_noches) &&
      reserva.cantidad_noches!=0)
    {
      return true;
    }
    else
    {
      return false;
    }
}
