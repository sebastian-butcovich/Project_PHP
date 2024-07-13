<?php

use Slim\Factory\AppFactory;

require __DIR__ . '/vendor/autoload.php';
require_once './ControllerLocalidades.php';
require_once './ControllerTipoPropiedades.php';
require_once './ControllerInquilinos.php';
require_once './ControllerPropiedades.php';
require_once './ControllerReservas.php';

$app = AppFactory::create();
$app->addBodyParsingMiddleware();
$app->addRoutingMiddleware();
$app->addErrorMiddleware(true, true, true);
$app->add(function ($request, $handler) {
    $response = $handler->handle($request);

    return $response

        ->withHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE')
        ->withHeader('Content-Type', 'application/json','charset=UTF-8','text/plain');
});

$app->get('/', function ($req, $resp, $arg) {
    $resp->getBody()->write("Pagina principal");
    return $resp;
});
$app->post('/localidades', \ControllerLocalidades::class . ':Crear');
$app->put('/localidades/{id}', \ControllerLocalidades::class . ':Editar');
$app->delete('/localidades/{id}', \ControllerLocalidades::class . ':Eliminar');
$app->get('/localidades', \ControllerLocalidades::class . ':Listar');

$app->post('/tipo_propiedades', \ControllerTipoPropiedades::class . ':Crear');
$app->put('/tipo_propiedades', \ControllerTipoPropiedades::class . ':Editar');
$app->delete('/tipo_propiedades', \ControllerTipoPropiedades::class . ':Eliminar');
$app->get('/tipo_propiedades', \ControllerTipoPropiedades::class . ':Listar');

$app->post('/inquilinos', \ControllerInquilinos::class . ':Crear');
$app->put('/inquilinos/{id}', \ControllerInquilinos::class . ':Editar');
$app->delete('/inquilinos/{id}', \ControllerInquilinos::class . ':Eliminar');
$app->get('/inquilinos', \ControllerInquilinos::class . ':Listar');
$app->get('/inquilinos/{id}', \ControllerInquilinos::class . ':VerInquilino');
$app->get('/inquilinos/{idInquilino}/reservas', \ControllerInquilinos::class . ':Historial');

$app->post('/propiedades', \ControllerPropiedades::class . ':Crear');
$app->put('/propiedades', \ControllerPropiedades::class . ':Editar');
$app->delete('/propiedades/eliminar', \ControllerPropiedades::class . ':Eliminar');
$app->get('/propiedades', \ControllerPropiedades::class . ':Listar');
$app->get('/propiedades/one', \ControllerPropiedades::class . ':VerPropiedad');

$app->post('/reservas', \ControllerReservas::class . ':Crear');
$app->put('/reservas', \ControllerReservas::class . ':Editar');
$app->delete('/reservas', \ControllerReservas::class . ':Eliminar');
$app->get('/reservas', \ControllerReservas::class . ':Listar');

$app->run();
