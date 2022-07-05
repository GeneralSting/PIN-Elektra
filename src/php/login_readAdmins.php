<?php

include 'connection.php';

    //react date picker jquery datatable

header('Content-type: text/json');
header('Content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$sql_query = 'Select * from admin';
$oRecord = $oConnection->query($sql_query);
$aAdmini = array();
while($oRow = $oRecord->fetch(PDO::FETCH_BOTH))
{
    $oAdmin = new Admin($oRow['admin_ime'], $oRow['admin_prezime'], $oRow['admin_oib'], $oRow['admin_datum_rodenja'], $oRow['admin_mjesto_stanovanja'], 
    $oRow['admin_postanski_broj'], $oRow['admin_id'], $oRow['admin_email'], $oRow['admin_lozinka']);
    array_push($aAdmini, $oAdmin);
}

echo json_encode($aAdmini);
?>