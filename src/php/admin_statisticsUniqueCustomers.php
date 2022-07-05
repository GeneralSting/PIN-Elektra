<?php

include 'connection.php';

header('Content-type: text/json');
header('Content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$sql_query = 'Select * from kupac inner join racun on kupac.kupac_sifra = racun.kupac_sifra where racun.racun_storniran = 0 order by racun.racun_iznos desc';
$oRecord = $oConnection->query($sql_query);
$aKupci = array();
while ($oRow = $oRecord->fetch(PDO::FETCH_BOTH)) 
{
    array_push($aKupci, $oRow['kupac_sifra']);
}

$aKupci = array_unique($aKupci);
$aKupci = array_slice($aKupci, 0, 10);

$aTopKupac = array();
foreach ($aKupci as $kupac) 
{
    $aStavke = array();
    $kupac_id = null;
    $kupac_ime = null;
    $kupac_prezime = null;
    $kupac_oib = null;
    $racun_id = null;
    $racun_iznos = null;

    $sql_query = 'Select * from racun inner join kupac on racun.kupac_sifra = kupac.kupac_sifra inner join stavka on racun.racun_id = stavka.racun_id inner join artikl on stavka.artikl_id = artikl.artikl_id where kupac.kupac_sifra = ' . $kupac . ' and racun.racun_storniran = 0';
    $oRecord = $oConnection->query($sql_query);
    while ($oRow = $oRecord->fetch(PDO::FETCH_BOTH)) {
        $kupac_id = $oRow['kupac_sifra'];
        $kupac_ime = $oRow['kupac_ime'];
        $kupac_prezime = $oRow['kupac_prezime'];
        $kupac_oib = $oRow['kupac_oib'];
        $racun_id = $oRow['racun_id'];
        $racun_iznos = $oRow['racun_iznos'];
        array_push($aStavke, $oRow['stavka_id']);
    }
    $oTopKupac = new TopKupacRacun($kupac_id, $kupac_ime, $kupac_prezime, $kupac_oib, $racun_id, $racun_iznos, $aStavke);
    array_push($aTopKupac, $oTopKupac);
}

function sortScripts($firstObject, $secondObject)   //pomoću usorta sortira objekte prema veličini podatkovna člana unutar polja
{
    return $secondObject->getIznosRacuna() - $firstObject->getIznosRacuna();
}

usort($aTopKupac, "sortScripts");

echo json_encode($aTopKupac);

?>