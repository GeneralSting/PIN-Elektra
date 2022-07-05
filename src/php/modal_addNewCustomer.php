<?php

    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: access');
    header('Access-Control-Allow-Methods: POST');
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, Access-Control-Allow-Methods');

    require 'connection.php';


    $counter = 0;
    $first_counter = true;

    $sql_counter_query = 'select * from `kupac-brojilo`';
    $oRecord = $oConnection->query($sql_counter_query);
    while($oRow = $oRecord->fetch(PDO::FETCH_BOTH))
    {
        if($first_counter === true)
        {
            $counter = $oRow['brojilo_sifra'];
            $first_counter = false;
        }
        else
        {
            if($oRow['brojilo_sifra'] > $counter)
            {
                $counter = $oRow['brojilo_sifra'];
            } 
        }
    }
    $counter++;

    $oKupac = new Kupac($_POST['name'], $_POST['surname'], $_POST['oib'], $_POST['birthDate'], $_POST['residencePlace'], $_POST['pbr'], $_POST['id'], null, $_POST['counterNumber'], null, null, null, null );

    if($oKupac->getOib() === "" || $oKupac->getOib() === null || $oKupac->getOib() === 0 )
    {

    }
    else
    {
        $name = $oKupac->getIme();
        $surname = $oKupac->getPrezime();
        $oib = $oKupac->getOib();
        $birthDate = $oKupac->getDatumRodenja();
        $residencePlace = $oKupac->getMjestoStanovanja();
        $pbr = $oKupac->getPostanskiBroj();
        $id = $oKupac->getSifraKupca();
        $counterNumber = $oKupac->getBrojMjernihMjesta();


        $sql_query="insert into kupac (kupac_ime, kupac_prezime, kupac_oib, kupac_datum_rodenja, kupac_mjesto_stanovanja, kupac_postanski_broj, kupac_sifra, kupac_broj_brojila)
        values ('$name', '$surname', '$oib', '$birthDate', '$residencePlace', '$pbr', '$id', '$counterNumber')";

        $oConnection->query($sql_query);

        for($i = 0; $i < $counterNumber; $i++)
        {
            $currentCounterPlace = $_POST['counterPlace' . $i];

            $currentCounterType = $_POST['counterType_counterPlace' . $i];
            
            $sql_query = "insert into `kupac-brojilo` (brojilo_kupac_sifra, brojilo_mjesto, brojilo_sifra, brojilo_tip) values ('$id', '$currentCounterPlace', '$counter', '$currentCounterType')";

            $oConnection->query($sql_query);

            $counter++;

        }

        echo $sql_query;
    }

?>