<?php
class Configuration
{
    private $host = "N/A";
    private $dbName = "N/A";
    private $username = "N/A";
    private $password = "N/A";
    public function getHost()
    {
        return $this->host;
    }
    public function getDbName()
    {
        return $this->dbName;
    }
    public function getUsername()
    {
        return $this->username;
    }
    public function getPassword()
    {
        return $this->password;
    }
    public function __construct($_host = null, $_dbName = null, $_username = null, $_password)
    {
        if ($_host && $_dbName && $_username) {
            $this->host = $_host;
            $this->dbName = $_dbName;
            $this->username = $_username;
            $this->password = $_password;
        }
        else {
            throw new Exception('Objekt Configuration nije kreiran! Nedostatak podataka.');
        }
    }
}

class Artikl implements JsonSerializable
{
    private $sifra_artikla = "N/A";
    private $naziv_artikla = "N/A";
    private $cijena_artikla = "N/A";

    public function getNazivArtikla()
    {
        return $this->naziv_artikla;
    }
    public function getCijenaArtikla()
    {
        return $this->cijena_artikla;
    }
    public function __construct($_sifra_artikla, $_naziv_artikla = null, $_cijena_artikla = null)
    {
        if ($_sifra_artikla && $_naziv_artikla && $_cijena_artikla) {
            $this->sifra_artikla = $_sifra_artikla;
            $this->naziv_artikla = $_naziv_artikla;
            $this->cijena_artikla = $_cijena_artikla;
        }
        else {
            throw new Exception('Objekt Artikl nije kreiran! Nedostatak podataka.');
        }
    }
    public function jsonSerialize()
    {
        return get_object_vars($this);
    }
}

class Stavka extends Artikl implements JsonSerializable
{
    private $sifra_stavke = "N/A";
    private $broj_racuna = "N/A";
    private $kolicina_artikla = "N/A";
    private $iznos_stavke = "N/A";

    public function getBrojRacuna()
    {
        return $this->broj_racuna;
    }
    public function getKolicinaArtikla()
    {
        return $this->kolicina_artikla;
    }
    public function getIznosStavke()
    {
        return $this->iznos_stavke;
    }
    public function __construct($_sifra_stavke = null, $_sifra_artikla = null, $_naziv_artikla = null, $_broj_racuna = null, $_kolicina_artikla = null, $_iznos_stavke = null)
    {
        if ($_sifra_stavke && $_sifra_artikla && $_naziv_artikla && $_broj_racuna && $_kolicina_artikla && $_iznos_stavke) {
            $this->sifra_stavke = $_sifra_stavke;
            $this->sifra_artikla = $_sifra_artikla;
            $this->naziv_artikla = $_naziv_artikla;
            $this->broj_racuna = $_broj_racuna;
            $this->kolicina_artikla = $_kolicina_artikla;
            $this->iznos_stavke = $_iznos_stavke;
        }
        else {
            throw new Exception('Objekt Stavka nije kreiran! Nedostatak podataka.');
        }
    }
    public function jsonSerialize()
    {
        return get_object_vars($this);
    }
}

class Racun implements JsonSerializable
{
    private $sifra_racuna = "N/A";
    private $sifra_kupca = "N/A";
    private $sifra_brojila = "N/A";
    private $iznos_racuna = "N/A";
    private $datum_racuna = "N/A";
    private $stavke_racuna = "N/A";
    private $stornirano = "N/A";
    public function getSifraRacuna()
    {
        return $this->sifra_racuna;
    }
    public function getSifraKupca()
    {
        return $this->sifra_kupca;
    }
    public function getUkupanIznos()
    {
        return $this->iznos_racuna;
    }
    public function getDatumRacuna()
    {
        return $this->datum_racuna;
    }
    public function getStavkeRacuna()
    {
        return $this->stavke_racuna;
    }
    public function getStornirano()
    {
        return $this->stornirano;
    }
    public function __construct($_sifra_racuna = null, $_sifra_kupca = null, $_sifra_brojila = null, $_iznos_racuna = null, $_datum_racuna = null, $_stavke_racuna = null, $_stornirano)
    {
        if ($_sifra_racuna && $_sifra_kupca && $_sifra_brojila && $_iznos_racuna && $_datum_racuna && $_stavke_racuna) {
            $this->sifra_racuna = $_sifra_racuna;
            $this->sifra_kupca = $_sifra_kupca;
            $this->sifra_brojila = $_sifra_brojila;
            $this->iznos_racuna = $_iznos_racuna;
            $this->datum_racuna = $_datum_racuna;
            $this->stavke_racuna = $_stavke_racuna;
            $this->stornirano = $_stornirano;
        }
        else {
            throw new Exception('Objekt Racun nije kreiran! Nedostatak podataka.');
        }
    }
    public function jsonSerialize()
    {
        return get_object_vars($this);
    }
}

abstract class Osoba
{
    protected $ime;
    protected $prezime;
    protected $oib;
    protected $datum_rodenja;
    protected $mjesto_stanovanja;
    protected $postanski_broj;


}

class OIB
{
    private $validator;
    public function __construct($_validator)
    {
        $this->validator = $_validator;
    }
    private function CheckOib($oib)
    {
        // OIB ima 11 znamenaka i mora biti numeric.
        if (mb_strlen($oib) != 11 || (!is_numeric($oib))) {
            $this->validator = false;
            return $this->validator;
        //return false;
        }
        // Posljednja tj. 11. znamenka je kontrolna znamenka. Dobivena  je
        // izračunom  iz  prethodnih  10  znamenaka  po međunarodnoj  normi  ISO 7064 (MOD 11, 10).

        // Prva znamenka zbroji se s brojem 10. U sljedećim koracima to će biti ostatak koji će se zbrajati
        // s idućom znamenkom.
        $ostatak = 10;
        // Prođi kroz sve znamenke, osim zadnje.
        for ($i = 0; $i < 10; $i++) {
            // Dohvati trenutni znak iz OIBa i castaj ga u int kako bismo mogli raditi operacije.
            $trenutnaZnamenka = (int)$oib[$i];

            // 1. Prva znamenka zbroji se s brojem 10, a svaka sljedeća s ostatkom u prethodnom koraku.
            $zbroj = $trenutnaZnamenka + $ostatak;

            // 2. Dobiveni  zbroj  cjelobrojno  (s  ostatkom)  podijeli  se  brojem  10;  ako  je  dobiveni
            // ostatak 0 zamijeni se brojem 10 (ovaj broj je tzv. međuostatak)
            $meduOstatak = $zbroj % 10;
            if ($meduOstatak == 0) {
                $meduOstatak = 10;
            }
            // 3. Dobiveni međuostatak pomnoži se brojem 2
            $umnozak = $meduOstatak * 2;
            // 4. Dobiveni  umnožak  cjelobrojno  (s  ostatkom)  podijeli se  brojem  11;  ovaj  ostatak
            // matematički nikako ne može biti 0 jer je rezultat prethodnog koraka uvijek paran broj
            $ostatak = $umnozak % 11;
        // 5. Slijedeća znamenka zbroji se s ostatkom u prethodnom koraku...
        // 6. Ponavljaju se koraci 2, 3, 4 i 5  dok se ne potroše sve znamenke...
        }
        // 7. Razlika izmeñu broja 11 i ostatka u zadnjem koraku je kontrolna znamenka.
        // Ako je ostatak 1 kontrolna znamenka je 0 (11 1=10, a 10 ima dvije znamenke)
        if ($ostatak == 1) {
            $kontrolnaZnamenka = 0;
        }
        else {
            $kontrolnaZnamenka = 11 - $ostatak;
        }
        // Provjeri dali kontrolne znamenka odgovara onoj u OIBu
        if (((int)$oib[10]) == $kontrolnaZnamenka) {
            $this->validator = true;
            return $this->validator;
        //return true;
        }
        // Ako smo došli tu, kontrola nije prošla.
        $this->validator = false;
        return $this->validator;    
}
    public function getCheckOib($primljeniObjekt)       
    {   
        return $this->CheckOib($primljeniObjekt);
    }
}

class KolicinaArtikla implements JsonSerializable
{
    private $sifra_artikla;
    private $naziv_artikla;
    private $kolicina_artikla;

    public function getSifraArtikla()
    {
        return $this->sifra_artikla;
    }
    public function getNazivArtikla()
    {
        return $this->naziv_artikla;
    }
    public function getKolicinaArtikla()
    {
        return $this->kolicina_artikla;
    }
    public function setSifraArtikla($_sifra_artikla)
    {
        $this->sifra_artikla = $_sifra_artikla;
    }
    public function setNazivArtikla($_naziv_artikla)
    {
        $this->naziv_artikla = $_naziv_artikla;
    }
    public function setKolicinaArtikla($_kolicina_artikla)
    {
        $this->kolicina_artikla = $_kolicina_artikla;
    }

    public function __construct($_sifra_artikla, $_naziv_artikla, $_kolicina_artikla)
    {
        $this->sifra_artikla = $_sifra_artikla;
        $this->naziv_artikla = $_naziv_artikla;
        $this->kolicina_artikla = $_kolicina_artikla;
    }
    public function jsonSerialize()
    {
        return get_object_vars($this);
    }
}

class TopKupacRacun implements JsonSerializable
{
    private $sifra_kupca;
    private $ime_kupca;
    private $prezime_kupca;
    private $oib_kupca;
    private $sifra_racuna;
    private $iznos_racuna;
    private $stavke_racuna;

    public function getSifraKupca()
    {
        return $this->sifra_kupca;
    }
    public function getSifraRacuna()
    {
        return $this->sifra_racuna;
    }
    public function getIznosRacuna()
    {
        return $this->iznos_racuna;
    }
    public function getStavkeRacuna()
    {
        return $this->iznos_racuna;
    }
    public function getImeKupca()
    {
        return $this->iznos_racuna;
    }
    public function getPrezimeKupca()
    {
        return $this->iznos_racuna;
    }
    public function getOibKupca()
    {
        return $this->iznos_racuna;
    }
    public function setSifraKupca($_sifra_kupca)
    {
        $this->sifra_kupca = $_sifra_kupca;
    }
    public function setSifraRacuna($_sifra_racuna)
    {
        $this->sifra_racuna = $_sifra_racuna;
    }
    public function setIznosRacuna($_iznos_racuna)
    {
        $this->iznos_racuna = $_iznos_racuna;
    }
    public function setStavkeRacuna($stavke_racuna)
    {
        $this->stavke_racuna = $stavke_racuna;
    }
    public function setImeKupca($_ime_kupca)
    {
        $this->ime_kupca = $_ime_kupca;
    }
    public function setPrezimeKupca($_prezime_kupca)
    {
    $this->prezime_kupca = $_prezime_kupca;
    }
    public function setOibKupca($_oib_kupca)
    {
    $this->oib_kupca = $_oib_kupca;
    }

    public function __construct($_sifra_kupca, $_ime_kupca, $_prezime_kupca, $_oib_kupca, $_sifra_racuna, 
                                $_iznos_racuna, $_stavke_racuna)
    {
        $this->sifra_kupca = $_sifra_kupca;
        $this->ime_kupca = $_ime_kupca;
        $this->prezime_kupca = $_prezime_kupca;
        $this->oib_kupca = $_oib_kupca;
        $this->sifra_racuna = $_sifra_racuna;
        $this->iznos_racuna = $_iznos_racuna;
        $this->stavke_racuna = $_stavke_racuna;
    }
    public function jsonSerialize()
    {
        return get_object_vars($this);
    }
}

class TopKupacArtikl implements JsonSerializable 
{
    private $sifra_kupca;
    private $ime_kupca;
    private $prezime_kupca;
    private $oib_kupca;
    private $sifra_artikla;
    private $naziv_artikla;
    private $kolicina_artikla;

    public function getSifraKupca()
    {
        return $this->sifra_kupca;
    }
    public function getImeKupca()
    {
        return $this->ime_kupca;
    }
    public function getPrezimeKupca()
    {
        return $this->prezime_kupca;
    }
    public function getOibKupca()
    {
        return $this->iznos_racuna;
    }
    public function getSifraArtikla()
    {
        return $this->sifra_artikla;
    }
    public function getNazivArtikla()
    {
        return $this->naziv_artikla;
    }
    public function getKolicinaArtikla()
    {
        return $this->kolicina_artikla;
    }

    public function setSifraKupca($_sifra_kupca)
    {
        $this->sifra_kupca = $_sifra_kupca;
    }
    public function setNazivArtikla($_naziv_artikla)
    {
        $this->naziv_artikla = $_naziv_artikla;
    }
    public function setKolicinaArtikla($_kolicina_artikla)
    {
        $this->kolicina_artikla = $_kolicina_artikla;
    }
    public function setSifraArtikla($sifra_artikla)
    {
        $this->sifra_artikla = $sifra_artikla;
    }
    public function setImeKupca($_ime_kupca)
    {
        $this->ime_kupca = $_ime_kupca;
    }
    public function setPrezimeKupca($_prezime_kupca)
    {
    $this->prezime_kupca = $_prezime_kupca;
    }
    public function setOibKupca($_oib_kupca)
    {
    $this->oib_kupca = $_oib_kupca;
    }

    public function __construct($_sifra_kupca, $_ime_kupca, $_prezime_kupca, $_oib_kupca, $_sifra_artikla, 
                                $_naziv_artikla, $_kolicina_artikla)
    {
        $this->sifra_kupca = $_sifra_kupca;
        $this->ime_kupca = $_ime_kupca;
        $this->prezime_kupca = $_prezime_kupca;
        $this->oib_kupca = $_oib_kupca;
        $this->sifra_artikla = $_sifra_artikla;
        $this->naziv_artikla = $_naziv_artikla;
        $this->kolicina_artikla = $_kolicina_artikla;
    }
    public function jsonSerialize()
    {
        return get_object_vars($this);
    }
}


class Kupac extends Osoba implements JsonSerializable
{
    private $sifra_kupca;
    private $mjesta_brojila;
    private $broj_mjernih_mjesta;
    private $sifra_brojila;
    private $tip_brojila;
    private $email_kupca;
    private $lozinka_kupca;
    private $funkcija_korisnika;

    public function getIme()
    {
        return $this->ime;
    }
    public function getPrezime()
    {
        return $this->prezime;
    }
    public function getOib()
    {
        return $this->oib;
    }
    public function getDatumRodenja()
    {
        return $this->datum_rodenja;
    }
    public function getMjestoStanovanja()
    {
        return $this->mjesto_stanovanja;
    }
    public function getPostanskiBroj()
    {
        return $this->postanski_broj;
    }
    public function getSifraKupca()
    {
        return $this->sifra_kupca;
    }
    public function getBrojMjernihMjesta()
    {
        return $this->broj_mjernih_mjesta;
    }

    public function __construct($_ime, $_prezime, $_oib, $_datum_rodenja,
        $_mjesto_stanovanja, $_postanski_broj, $_sifra_kupca,
        $_mjesta_brojila, $_broj_mjernih_mjesta, $_sifra_brojila,
        $_tip_brojila, $_email_kupca, $_lozinka_kupca)
    {
        $oibValidator = new OIB(false);
        if ($oibValidator->getCheckOib($_oib) == true) {
            $this->ime = $_ime;
            $this->prezime = $_prezime;
            $this->oib = $_oib;
            $this->datum_rodenja = $_datum_rodenja;
            $this->mjesto_stanovanja = $_mjesto_stanovanja;
            $this->postanski_broj = $_postanski_broj;
            $this->sifra_kupca = $_sifra_kupca;
            $this->mjesta_brojila = $_mjesta_brojila;
            $this->broj_mjernih_mjesta = $_broj_mjernih_mjesta;
            $this->sifra_brojila = $_sifra_brojila;
            $this->tip_brojila = $_tip_brojila;
            $this->email_kupca = $_email_kupca;
            $this->lozinka_kupca = $_lozinka_kupca;
            $this->funkcija_korisnika = 'kupac';
        }
    }

    public function jsonSerialize()
    {
        return get_object_vars($this);
    }
}


class Admin extends Osoba implements JsonSerializable
{
    private $id_admina;
    private $email_admina;
    private $lozinka_admina;
    private $funkcija_korisnika;
    public function __construct($_ime, $_prezime, $_oib, $_datum_rodenja,
        $_mjesto_stanovanja, $_postanski_broj, $_id_admina,
        $_email_admina, $_lozinka_admina)
    {

        $this->ime = $_ime;
        $this->prezime = $_prezime;
        $this->oib = $_oib;
        $this->datum_rodenja = $_datum_rodenja;
        $this->mjesto_stanovanja = $_mjesto_stanovanja;
        $this->postanski_broj = $_postanski_broj;
        $this->id_admina = $_id_admina;
        $this->email_admina = $_email_admina;
        $this->lozinka_admina = $_lozinka_admina;
        $this->funkcija_korisnika = 'admin';

    }

    public function jsonSerialize()
    {
        return get_object_vars($this);
    }
}

?>