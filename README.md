<h1>HEP</h1>

<p>Koristeći web tehnologije (HTML, CSS, PHP, Javascript, jQuery, React) napisati program koji će služiti kao jednostavan informacijski sustav za:
-	Izradu račun za električnu energiju elektrane „PIN elektra“. 
Kao izvor podataka potrebno je kreirati bazu podataka. Inicijalno kreirati i popuniti sadržaj baze sa nekoliko podataka za prezentaciju. Samostalno analizirati probleme i napraviti analizu zahtjeva.
</p>

<ul>Napomene:
<hr/>
    <li>	Dostupni artikli su: niska tarifa, visoka tarifa, industrijska potrošnja tip 1, industrijska potrošnja tip 2  zajedno sa jediničnom cijenom. Kreirati klasu Artikl, učitane artikle spremiti u polje artikala</li>
    <li>	omogućiti kreiranje račune, kreirati klasu Račun. Klasa računa sadrži podatkovne članove šifra računa, šifra kupca, ukupan iznos i datum. Klasa Račun sadrži i polje objekata klase Stavka koja naslijeđuje klasu Artikl uz dodatne podatkovne članove količina, broj računa i ukupna cijena koja se izračunava automatski</li>
    <li>	Treba postojati šifrarnik kupaca. Kreirati hijerarhiju klasa Osoba, Kupac. Klasa kupac sadrži dodatni podatkovni član šifra kupca i šifra brojila</li>
    <li>	Kod administracije kupaca provjeriti šifru kupca i brojila. To su jedinstvene vrijednosti</li>
    <li>	za prikaz podataka na klijentskoj strani kreirati funkcije koje generiraju JSON zapis</li>
</ul>

<ul>Informacijski sustav mora imati sljedeće funkcionalnosti:
<hr/>
<li>Kreiraj račun:
<p>Omogućiti odabir kupca s liste kupaca, odabrati artikle, unijeti količinu i kreirati račun. Kupca odabrati iz liste kupaca korištenjem tražilice tražilici. Omogućiti unos ključne riječi koja pretražuje po svim podatkovnim članovima klase Kupac.</p>
</li>
<li>Dodavanje/Ažuriranje/Brisanje kupca
<p>Potrebno je omogućiti putem novog izbornika opciju dodavanje, brisanje i ažuriranje kupca.</p>
</li>
<li>Pregled računa kupaca
<p>Potrebno je omogućiti pregled kreiranih računa samo za odabranog kupca</p>
</li>
<li>Storniranje računa
<p>Promjena podatkovnog člana klase Racun „stornirano“. Stornirani računi ne ulaze u pregled i statistiku.</p>
</li>
<li>Pregled storniranih računa
</p>Potrebno je omogućiti pregled svih storniranih računa.</p>
</li>
<li>Statistika
<p>Ukupna količina prodanih artikala, grupirano po artiklima od najveće prema najmanjoj količini za sve kupce.</p>
<p>Prikaz „top 10“ kupaca po veličini računa, po količini potrošene električne energije po „niskoj“ tarifi.</p>
</li>
</ul>
