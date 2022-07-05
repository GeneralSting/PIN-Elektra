<?php

include 'connection.php';

    //react date picker jquery datatable

header('Content-type: text/json');
header('Content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$sql_query = 'Select * from stavka inner join artikl on stavka.artikl_id = artikl.artikl_id where racun_id = ' . $_POST['receiptId'];
$oRecord = $oConnection->query($sql_query);
$aStavke = array();
while($oRow = $oRecord->fetch(PDO::FETCH_BOTH))
{   
    $oStavka = new Stavka($oRow['stavka_id'], $oRow['artikl_id'], $oRow['artikl_naziv'], $oRow['racun_id'], $oRow['stavka_kolicina_artikla'], $oRow['stavka_iznos']);
    array_push($aStavke, $oStavka);
}

echo json_encode($aStavke);
?>