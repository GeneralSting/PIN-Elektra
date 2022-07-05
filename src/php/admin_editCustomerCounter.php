<?php

    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: access');
    header('Access-Control-Allow-Methods: POST');
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, Access-Control-Allow-Methods');

    require 'connection.php';

    $counter_id = $_POST['id'];
    $counter_location = $_POST['counterLocation'];
    $counter_type = $_POST['counterType'];


    $sql_query="update `kupac-brojilo` set brojilo_mjesto = '".$counter_location."', brojilo_tip = '".$counter_type."' where brojilo_sifra = '".$counter_id."'";

    $oConnection->query($sql_query);

    echo $sql_query;

?>