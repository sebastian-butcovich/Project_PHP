<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/Conexion/Conexion.php';

class ControllerReservas
{

    public static function Crear(Request $request, Response $response)
    {
        $data = $request->getParsedBody();
        //var_dump($data['nombre']);
        if (
            empty($data['propiedad_id']) || empty($data['inquilino_id']) || empty($data['fecha_desde'])
            || empty($data['cantidad_noches'])
        ) {
            $response->getBody()->write(json_encode(['Bad Request' => 'Faltan campos requeridos para hacer esta reserva']));
            return $response->withStatus(400);
        } else {
            try {
                $con = new Conexion();
                $c = $con->establecerConexion();

                $src = "SELECT * FROM propiedades WHERE id = :propiedad_id";
                $consulta = $c->prepare($src);
                $consulta->bindParam(':propiedad_id', $data['propiedad_id']);
                $consulta->execute();
                $dato_propiedad = $consulta->fetch(PDO::FETCH_ASSOC);
                if ($consulta->rowCount() == 0) {
                    $response->getBody()->write(json_encode(['Not Found' => 'No se encuentra una propiedad con ese id']));
                    return $response->withStatus(404);
                } elseif (!$dato_propiedad['disponible']) {
                    $response->getBody()->write(json_encode(['Bad Request' => 'La propiedad no esta disponible']));
                    return $response->withStatus(400);
                }
                $valor_total = $dato_propiedad['valor_noche'] * $data['cantidad_noches'];

                $src = "SELECT * FROM inquilinos WHERE id = :inquilino_id";
                $consulta = $c->prepare($src);
                $consulta->bindParam(':inquilino_id', $data['inquilino_id']);
                $consulta->execute();
                if ($consulta->rowCount() == 0) {
                    $response->getBody()->write(json_encode(['Not Found' => 'No se encuentra un inquilino con ese id']));
                    return $response->withStatus(404);
                } elseif (!$consulta->fetch(PDO::FETCH_ASSOC)['activo']) {
                    $response->getBody()->write(json_encode(['Bad Request' => 'El inquilino no esta activo']));
                    return $response->withStatus(400);
                }

                $src = 'INSERT INTO reservas (propiedad_id, inquilino_id, fecha_desde, cantidad_noches, valor_total) VALUES (:propiedad_id, :inquilino_id, :fecha_desde, :cantidad_noches, :valor_total)';
                $consulta = $c->prepare($src);
                $consulta->bindValue(':propiedad_id', $data['propiedad_id']);
                $consulta->bindValue(':inquilino_id', $data['inquilino_id']);
                $consulta->bindValue(':fecha_desde', $data['fecha_desde']);
                $consulta->bindValue(':cantidad_noches', $data['cantidad_noches']);
                $consulta->bindValue(':valor_total', $valor_total);
                $consulta->execute();
                $response->getBody()->write(json_encode(['OK' => 'Reserva realizada correctamente']));
                return $response->withStatus(200);
            } catch (Exception $e) {
                $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
                return $response->withStatus(500);
            }
        }
    }

    public static function Editar(Request $request, Response $response, $args)
    {
        $data = $request->getParsedBody();
        $id = $request->getQueryParams()['id'];
        if (
            empty($data['propiedad_id']) && empty($data['inquilino_id']) && empty($data['fecha_desde']) &&
            empty($data['cantidad_noches'])
        ) {
            $response->getBody()->write(json_encode(['Bad Request' => 'No se envia ningun dato para modificar']));
            return $response->withStatus(400);
        } else {
            try {
                $con = new Conexion();
                $c = $con->establecerConexion();
                $src = "SELECT * FROM reservas WHERE id = :id";
                $consulta = $c->prepare($src);
                $consulta->bindParam(':id', $id);
                $consulta->execute();
                if ($consulta->rowCount() == 0) {
                    $response->getBody()->write(json_encode(['Not Found' => 'No se encuentra una reserva con ese id']));
                    return $response->withStatus(404);
                }
                $datosReserva = $consulta->fetch(PDO::FETCH_ASSOC);

                if (!empty($data['propiedad_id'])) {
                    $src = "SELECT * FROM propiedades WHERE id = :propiedad_id";
                    $consulta = $c->prepare($src);
                    $consulta->bindParam(':propiedad_id', $data['propiedad_id']);
                    $consulta->execute();
                    $dato_propiedad = $consulta->fetch(PDO::FETCH_ASSOC);
                    if ($consulta->rowCount() == 0) {
                        $response->getBody()->write(json_encode(['Not Found' => 'No se encuentra una propiedad con ese id']));
                        return $response->withStatus(404);
                    } elseif (!$dato_propiedad['disponible']) {
                        $response->getBody()->write(json_encode(['Bad Request' => 'La propiedad no esta disponible']));
                        return $response->withStatus(400);
                    }
                    $valor_total = $dato_propiedad['valor_noche'] * $data['cantidad_noches'];
                }

                if (!empty($data['inquilino_id'])) {
                    $src = "SELECT * FROM inquilinos WHERE id = :inquilino_id";
                    $consulta = $c->prepare($src);
                    $consulta->bindParam(':inquilino_id', $data['inquilino_id']);
                    $consulta->execute();
                    if ($consulta->rowCount() == 0) {
                        $response->getBody()->write(json_encode(['Not Found' => 'No se encuentra un inquilino con ese id']));
                        return $response->withStatus(404);
                    } elseif (!$consulta->fetch(PDO::FETCH_ASSOC)['activo']) {
                        $response->getBody()->write(json_encode(['Bad Request' => 'El inquilino no esta activo']));
                        return $response->withStatus(400);
                    }
                }

                $fecha_desde = new DateTime($datosReserva['fecha_desde']);
                $fecha_actual = new DateTime();
                if ($fecha_desde < $fecha_actual) {
                    $response->getBody()->write(json_encode(['Bad Request' => 'La reserva ya inicio']));
                    return $response->withStatus(400);
                }

                $src = 'UPDATE reservas SET propiedad_id = :propiedad_id, inquilino_id = :inquilino_id, fecha_desde = :fecha_desde, cantidad_noches = :cantidad_noches, valor_total = :valor_total WHERE id = :id';
                $consulta = $c->prepare($src);
                $consulta->bindValue(':propiedad_id', (!empty($data['propiedad_id'])) ? $data['propiedad_id'] : $datosReserva['propiedad_id']);
                $consulta->bindValue(':inquilino_id', (!empty($data['inquilino_id'])) ? $data['inquilino_id'] : $datosReserva['inquilino_id']);
                $consulta->bindValue(':fecha_desde', (!empty($data['fecha_desde'])) ? $data['fecha_desde'] : $datosReserva['fecha_desde']);
                $consulta->bindValue(':cantidad_noches', (!empty($data['cantidad_noches'])) ? $data['cantidad_noches'] : $datosReserva['cantidad_noches']);
                $consulta->bindValue(':valor_total', (!empty($data['propiedad_id'])) ? $valor_total : $datosReserva['propiedad_id']);
                $consulta->bindValue(':id', $id);
                $consulta->execute();
                $response->getBody()->write(json_encode(['OK' => 'Reserva editada correctamente']));
                return $response->withStatus(200);
            } catch (Exception $e) {
                $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
                return $response->withStatus(500);
            }
        }
    }

    public static function Eliminar(Request $request, Response $response, $args)
    {
        try {
            $con = new Conexion();
            $c = $con->establecerConexion();
            $id = $request->getQueryParams()["id"];
            $src = "SELECT * FROM reservas WHERE id = " . $id . "";
            $consulta = $c->prepare($src);
            $consulta->execute();
            if ($consulta->rowCount() == 0) {
                $response->getBody()->write(json_encode(['Not Found' => 'No se encuentra una reserva con ese id']));
                return $response->withStatus(404);
            }

            $fecha_desde = new DateTime($consulta->fetch(PDO::FETCH_ASSOC)['fecha_desde']);
            $fecha_actual = new DateTime();
            if ($fecha_desde < $fecha_actual) {
                $response->getBody()->write(json_encode(['Bad Request' => 'La reserva ya inicio']));
                return $response->withStatus(400);
            }

            $src = "DELETE FROM reservas WHERE id = " . $id . "";
            $consulta = $c->prepare($src);
            $consulta->execute();
            $response->getBody()->write(json_encode(['OK' => 'Reserva cancelada correctamente']));
            return $response->withStatus(200);
        } catch (Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500);
        }
    }

    public static function Listar(Request $request, Response $response)
    {
        try {
            $con = new Conexion();
            $c = $con->establecerConexion();

            $src = "SELECT * FROM reservas";
            $consulta = $c->query($src);
            $resultados = array();
            while ($row = $consulta->fetch(PDO::FETCH_ASSOC)) {
                $resultados[] = $row;
            }
            $response->getBody()->write(json_encode(['OK' => $resultados]));
            return $response->withStatus(200);
        } catch (Exception $e) {
            $response->getBody()->write(json_encode(['error' => $e->getMessage()]));
            return $response->withStatus(500);
        }
    }
}
