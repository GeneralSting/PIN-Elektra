<?php

include 'connection.php';

    //react date picker jquery datatable

header('Content-type: text/json');
header('Content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$sql_query = 'Select * from racun';
$oRecord = $oConnection->query($sql_query);
$aRacuni = array();
while($oRow = $oRecord->fetch(PDO::FETCH_BOTH))
{
    $sql_query_items = 'Select stavka_id from stavka where racun_id = ' . $oRow['racun_id'];
    $oRecord_items = $oConnection->query($sql_query_items);
    $aItems = array();
    while($oRow_items = $oRecord_items->fetch(PDO::FETCH_BOTH))
    {
        array_push($aItems, $oRow_items);
    }
    if($oRow['racun_storniran'])
    {
        $oRacun = new Racun($oRow['racun_id'], $oRow['kupac_sifra'], $oRow['brojilo_sifra'], $oRow['racun_iznos'], $oRow['racun_datum'], $aItems, $oRow['racun_storniran']);
        array_push($aRacuni, $oRacun);
    }
}

echo json_encode($aRacuni);
?>