<?php

include 'connection.php';

    //react date picker jquery datatable

header('Content-type: text/json');
header('Content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$sql_query = 'Select * from kupac';
$oRecord = $oConnection->query($sql_query);
$aKupci = array();
while($oRow = $oRecord->fetch(PDO::FETCH_BOTH))
{
    //$dateFormat = date('d/m/Y', strtotime($oRow['kupac_datum_rodenja']));
    $oKupac = new Kupac($oRow['kupac_ime'], $oRow['kupac_prezime'], $oRow['kupac_oib'], $oRow['kupac_datum_rodenja'], $oRow['kupac_mjesto_stanovanja'], 
    $oRow['kupac_postanski_broj'], $oRow['kupac_sifra'], null, $oRow['kupac_broj_brojila'], null, null,
    $oRow['kupac_email'], $oRow['kupac_lozinka']);
    array_push($aKupci, $oKupac);
}

echo json_encode($aKupci);
?>