<?php

include 'connection.php';

header('Content-type: text/json');
header('Content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$sql_query = 'Select * from racun inner join kupac on racun.kupac_sifra = kupac.kupac_sifra inner join 
stavka on racun.racun_id = stavka.racun_id where racun.racun_storniran = 0 and stavka.artikl_id = 101
order by stavka_kolicina_artikla desc';
$oRecord = $oConnection->query($sql_query);
$aKupci = array();
while ($oRow = $oRecord->fetch(PDO::FETCH_BOTH)) 
{
    array_push($aKupci, $oRow['kupac_sifra']);
}

$aKupci = array_unique($aKupci);
$aKupci = array_slice($aKupci, 0, 10);
$articleAmountCounter = 0;
$aTopKupacArtikl = array();
foreach ($aKupci as $kupac) 
{
    $sql_query = 'Select * from racun inner join kupac on racun.kupac_sifra = kupac.kupac_sifra inner join stavka on racun.racun_id = stavka.racun_id
    inner join artikl on stavka.artikl_id = artikl.artikl_id where kupac.kupac_sifra = ' . $kupac . ' and racun.racun_storniran = 0 and stavka.artikl_id = 101';
    $oRecord = $oConnection->query($sql_query);
    $oTopKupacArtikl = new TopKupacArtikl(null, null, null, null, null, null, null);
    while ($oRow = $oRecord->fetch(PDO::FETCH_BOTH)) {
        $articleAmountCounter += $oRow['stavka_kolicina_artikla'];
        $oTopKupacArtikl->setImeKupca($oRow['kupac_ime']);
        $oTopKupacArtikl->setPrezimeKupca($oRow['kupac_prezime']);
        $oTopKupacArtikl->setOibKupca($oRow['kupac_oib']);
        $oTopKupacArtikl->setSifraKupca($kupac);
        $oTopKupacArtikl->setNazivArtikla($oRow['artikl_naziv']);
        $oTopKupacArtikl->setSifraArtikla($oRow['artikl_id']);
        $oTopKupacArtikl->setKolicinaArtikla($articleAmountCounter);
    }
    $articleAmountCounter = 0;
    array_push($aTopKupacArtikl, $oTopKupacArtikl);
}
function sortScripts($firstObject, $secondObject)   //pomoću usorta sortira objekte prema veličini podatkovna člana unutar polja
{
    return $secondObject->getKolicinaArtikla() - $firstObject->getKolicinaArtikla();
}

usort($aTopKupacArtikl, "sortScripts");

echo json_encode($aTopKupacArtikl);

?>