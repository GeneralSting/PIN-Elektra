<?php

include 'connection.php';

    //react date picker jquery datatable

header('Content-type: text/json');
header('Content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$sql_query = 'Select * from kupac inner join `kupac-brojilo` on kupac.kupac_sifra = `kupac-brojilo`.brojilo_kupac_sifra';
$oRecord = $oConnection->query($sql_query);
$aKupci = array();
while($oRow = $oRecord->fetch(PDO::FETCH_BOTH))
{
    /*$kupac_ime = $oRow['kupac_ime'];
    $kupac_prezime = $oRow['kupac_prezime'];
    $kupac_oib = $oRow['kupac_oib'];
    $kupac_datum_rodenja = $oRow['kupac_datum_rodenja'];
    $kupac_mjesto_stanovanja = $oRow['kupac_mjesto_stanovanja'];
    $kupac_postanski_broj = $oRow['kupac_postanski_broj'];
    $kupac_sifra = $oRow['kupac_sifra'];
    $brojilo_mjesto = $oRow['brojilo_mjesto'];
    $kupac_broj_brojila = $oRow['kupac_broj_brojila'];
    $brojilo_sifra = $oRow['brojilo_sifra'];
    $kupac_email = $oRow['kupac_email'];
    $kupac_lozinka = $oRow['kupac_lozinka'];
    $oKupac2 = new Kupac();
    $oKupac2->setIme($kupac_ime);    
    $oKupac2->setPrezime($kupac_prezime);    
    $oKupac2->setOib($kupac_oib);    
    $oKupac2->setGodinaRodenja($kupac_datum_rodenja);    
    $oKupac2->setMjestoStanovanja($kupac_mjesto_stanovanja);    
    $oKupac2->setPostanskiBroj($kupac_postanski_broj);    
    $oKupac2->setSifraKupca($kupac_sifra);    
    $oKupac2->setSifraBrojila($brojilo_sifra);    
    $oKupac2->setMjestaBrojila($brojilo_mjesto);    
    $oKupac2->setBrojMjernihMjesta($kupac_broj_brojila);    
    $oKupac2->setEmail($kupac_email);    
    $oKupac2->setLozinka($kupac_lozinka);    */

    $oKupac = new Kupac($oRow['kupac_ime'], $oRow['kupac_prezime'], $oRow['kupac_oib'], $oRow['kupac_datum_rodenja'], $oRow['kupac_mjesto_stanovanja'], 
    $oRow['kupac_postanski_broj'], $oRow['kupac_sifra'], $oRow['brojilo_mjesto'], $oRow['kupac_broj_brojila'], $oRow['brojilo_sifra'], $oRow['brojilo_tip'],
    $oRow['kupac_email'], $oRow['kupac_lozinka']);
    array_push($aKupci, $oKupac);
}

echo json_encode($aKupci);
?>