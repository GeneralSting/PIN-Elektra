<?php

    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: access');
    header('Access-Control-Allow-Methods: POST');
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, Access-Control-Allow-Methods');

    require 'connection.php';

    $counterId = 0;
    $first_counter = true;

    $sql_counter_query = 'select * from `kupac-brojilo`';
    $oRecord = $oConnection->query($sql_counter_query);
    while($oRow = $oRecord->fetch(PDO::FETCH_BOTH))
    {
        if($first_counter === true)
        {
            $counterId = $oRow['brojilo_sifra'];
            $first_counter = false;
        }
        else
        {
            if($oRow['brojilo_sifra'] > $counterId)
            {
                $counterId = $oRow['brojilo_sifra'];
            } 
        }
    }
    $counterId++;

    $customerId = $_POST['id'];
    $customerCountersNumber = $_POST['countersNumber'];
    $counterLocation = $_POST['counterLocation'];
    $counterType = $_POST['counterType'];


    $sql_query="insert into `kupac-brojilo` (brojilo_kupac_sifra, brojilo_mjesto, brojilo_sifra, brojilo_tip)
    values ('$customerId', '$counterLocation', '$counterId', '$counterType')";

    $oConnection->query($sql_query);

    $sql_query = "update kupac set kupac_broj_brojila = '".$customerCountersNumber."' where kupac_sifra = '".$customerId."'";

    $oConnection->query($sql_query);

?>