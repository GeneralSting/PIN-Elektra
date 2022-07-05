<?php

include 'connection.php';

header('Content-type: text/json');
header('Content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$sql_query = 'Select * from racun inner join stavka on racun.racun_id = stavka.racun_id inner join artikl on stavka.artikl_id = artikl.artikl_id where racun.racun_storniran = 0';
$oRecord = $oConnection->query($sql_query);
$aArtikli = array();
while ($oRow = $oRecord->fetch(PDO::FETCH_BOTH)) 
{
    array_push($aArtikli, $oRow['artikl_id']);
}

$aArtikli = array_unique($aArtikli);
$articlePriceCounter = 0;
$aKolicinaArtikla = array();
foreach ($aArtikli as $artikl) 
{
    $sql_query = 'Select * from racun inner join stavka on racun.racun_id = stavka.racun_id inner join artikl on stavka.artikl_id = artikl.artikl_id where stavka.artikl_id = ' . $artikl . ' and racun.racun_storniran = 0';
    $oRecord = $oConnection->query($sql_query);
    $oKolicinaArtikla = new KolicinaArtikla(null, null, null);
    while ($oRow = $oRecord->fetch(PDO::FETCH_BOTH)) {
        $articlePriceCounter += $oRow['stavka_kolicina_artikla'];
        $oKolicinaArtikla->setSifraArtikla($artikl);
        $oKolicinaArtikla->setNazivArtikla($oRow['artikl_naziv']);
        $oKolicinaArtikla->setKolicinaArtikla($articlePriceCounter);
    }
    $articlePriceCounter = 0;
    array_push($aKolicinaArtikla, $oKolicinaArtikla);
}
function sortScripts($firstObject, $secondObject)   //pomoću usorta sortira objekte prema veličini podatkovna člana unutar polja
{
    return $secondObject->getKolicinaArtikla() - $firstObject->getKolicinaArtikla();
}

usort($aKolicinaArtikla, "sortScripts");

echo json_encode($aKolicinaArtikla);

?>