<?php 
    class Conexion { 
        private  $conexion;

        public function establecerConexion(){
            $dataname="inmobiliaria";
            $dsn = "mysql:host=db;dbname=$dataname";
            $username="root";
            $password="root";
            try {
                $conexion = new PDO($dsn,$username,$password);
            }
            catch (PDOException $e){
                echo $e->getMessage();
            }
            return $conexion;
        }
    }
?>