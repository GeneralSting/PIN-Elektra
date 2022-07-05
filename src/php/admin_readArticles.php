<?php

include 'connection.php';

    //react date picker jquery datatable

header('Content-type: text/json');
header('Content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$sql_query = 'Select * from artikl';
$oRecord = $oConnection->query($sql_query);
$aArtikli = array();
while($oRow = $oRecord->fetch(PDO::FETCH_BOTH))
{
    $oArtikl = new Artikl($oRow['artikl_id'], $oRow['artikl_naziv'], $oRow['artikl_cijena']);
    array_push($aArtikli, $oArtikl);
}

echo json_encode($aArtikli);
?>