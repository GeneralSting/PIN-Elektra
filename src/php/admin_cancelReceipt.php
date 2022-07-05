<?php

    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: access');
    header('Access-Control-Allow-Methods: POST');
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, Access-Control-Allow-Methods');

    require 'connection.php';

    $receiptId = $_POST['receiptId'];

    $sql_query="update racun set racun_storniran = 1 where racun_id = '".$receiptId."'";

    $oConnection->query($sql_query);

    echo $sql_query;

?>