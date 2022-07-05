<?php

    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: access');
    header('Access-Control-Allow-Methods: POST');
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, Access-Control-Allow-Methods');

    require 'connection.php';

    $customer_id = $_POST['id'];
    $customer_name = $_POST['name'];
    $customer_surname = $_POST['surname'];
    $customer_oib = $_POST['oib'];
    $customer_residencePlace = $_POST['residencePlace'];
    $customer_birthDate = $_POST['birthDate'];
    $customer_pbr = $_POST['pbr'];


    $sql_query="update kupac set kupac_ime = '".$customer_name."', kupac_prezime = '".$customer_surname."',
    kupac_oib = '".$customer_oib."', kupac_datum_rodenja = '".$customer_birthDate."',
    kupac_mjesto_stanovanja = '".$customer_residencePlace ."', kupac_postanski_broj = '".$customer_pbr."' where kupac_sifra = '".$customer_id."'";

    $oConnection->query($sql_query);

    echo $sql_query;

?>