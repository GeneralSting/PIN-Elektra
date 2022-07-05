<?php

    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: access');
    header('Access-Control-Allow-Methods: POST');
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, Access-Control-Allow-Methods');

    require 'connection.php';


    $sql_query = "delete from kupac where kupac_sifra = " . $_POST['id'];

    $oConnection->query($sql_query);

    $sql_query = "delete from `kupac-brojilo` where brojilo_kupac_sifra = " . $_POST['id'];

    $oConnection->query($sql_query);

    echo $sql_query;

?>