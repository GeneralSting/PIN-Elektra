<?php

include 'connection.php';

header('Content-type: text/json');
header('Content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$sql_query = 'Select * from racun inner join stavka on racun.racun_id = stavka.racun_id inner join artikl on stavka.artikl_id = artikl.artikl_id 
where racun.racun_storniran = 0 order by racun.racun_iznos desc limit 20';
$oRecord = $oConnection->query($sql_query);
$aRacuni = array();
while ($oRow = $oRecord->fetch(PDO::FETCH_BOTH)) 
{
    array_push($aRacuni, $oRow['racun_id']);
}

$aRacuni = array_unique($aRacuni);
$aTopKupacRacun = array();
foreach ($aRacuni as $racun) 
{
    $aStavke = array();
    $kupac_id = null;
    $kupac_ime = null;
    $kupac_prezime = null;
    $kupac_oib = null;
    $racun_id = null;
    $racun_iznos = null;

    $sql_query = 'Select * from racun inner join kupac on racun.kupac_sifra = kupac.kupac_sifra inner join  stavka on racun.racun_id = stavka.racun_id
    inner join artikl on stavka.artikl_id = artikl.artikl_id where racun.racun_id = ' . $racun . ' and racun.racun_storniran = 0';
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
    $oTopKupacRacun = new TopKupacRacun($kupac_id, $kupac_ime, $kupac_prezime, $kupac_oib, $racun_id, $racun_iznos, $aStavke);
    array_push($aTopKupacRacun, $oTopKupacRacun);
}

echo json_encode($aTopKupacRacun);

?>