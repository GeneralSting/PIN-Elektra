<?php

    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: access');
    header('Access-Control-Allow-Methods: POST');
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, Access-Control-Allow-Methods');

    require 'connection.php';

    $todayDate = date("Y/m/d");
    $firstArticleId = $_POST['firstArticleId'];
    $secondArticleId = $_POST['secondArticleId'];
    $firstItemPrice = $_POST['firstItemPrice'];
    $secondItemPrice = $_POST['secondItemPrice'];
    $firstArticleAmount = $_POST['firstArticleAmount'];
    $secondArticleAmount = $_POST['secondArticleAmount'];
    $TotalPrice = $_POST['TotalPrice'];
    $CustomerId = $_POST['CustomerId'];
    $CounterId = $_POST['CounterId'];

    $receiptId = 0;
    $first_receipt = true;
    $sql_receipt_query = 'select * from racun';
    $oRecord = $oConnection->query($sql_receipt_query);
    while($oRow = $oRecord->fetch(PDO::FETCH_BOTH))
    {
        if($first_receipt === true)
        {
            $receiptId = $oRow['racun_id'];
            $first_receipt = false;
        }
        else
        {
            if($oRow['racun_id'] > $receiptId)
            {
                $receiptId = $oRow['racun_id'];
            } 
        }
    }
    $receiptId++;
    $sql_query = "insert into racun (racun_id, kupac_sifra, brojilo_sifra, racun_datum, racun_iznos, racun_storniran)
    values ('$receiptId', '$CustomerId', '$CounterId', '$todayDate', '$TotalPrice', '0')";
    $oConnection->query($sql_query);

    $itemId = 0;
    $first_item = true;
    $sql_item_query = 'select * from stavka';
    $oRecord = $oConnection->query($sql_item_query);
    while($oRow = $oRecord->fetch(PDO::FETCH_BOTH))
    {
        if($first_item === true)
        {
            $itemId = $oRow['stavka_id'];
            $first_item = false;
        }
        else
        {
            if($oRow['stavka_id'] > $itemId)
            {
                $itemId = $oRow['stavka_id'];
            } 
        }
    }
    $itemId++;
    $sql_query = "insert into stavka values ('$itemId', '$firstArticleId', '$receiptId', '$firstArticleAmount', '$firstItemPrice')";
    $oConnection->query($sql_query);

    $itemId++;
    $sql_query = "insert into stavka values ('$itemId', '$secondArticleId', '$receiptId', '$secondArticleAmount', '$secondItemPrice')";
    $oConnection->query($sql_query);


?>