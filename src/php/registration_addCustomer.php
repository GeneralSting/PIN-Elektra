<?php

    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: access');
    header('Access-Control-Allow-Methods: POST');
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, Access-Control-Allow-Methods');

    require 'connection.php';

    $customer_id = $_POST['kupac_sifra'];
    $customer_email = $_POST['kupac_email'];
    $customer_password = $_POST['kupac_lozinka'];

    $sql_query = "update kupac set kupac_email = '".$customer_email."', kupac_lozinka = '".$customer_password."' where kupac_sifra = '".$customer_id."'";
    
    $oConnection->query($sql_query);

    echo $sql_query;

?>