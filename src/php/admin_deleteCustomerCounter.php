<?php

    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: access');
    header('Access-Control-Allow-Methods: POST');
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, Access-Control-Allow-Methods');

    require 'connection.php';

    $customerCountersNumber = $_POST['countersNumber'];
    $customerId = $_POST['customer'];

    $sql_query = "delete from `kupac-brojilo` where brojilo_sifra = " . $_POST['id'];

    $oConnection->query($sql_query);

    $sql_query = "update kupac set kupac_broj_brojila = '".$customerCountersNumber."' where kupac_sifra = '".$customerId."'";

    $oConnection->query($sql_query);

    echo $sql_query;

?>