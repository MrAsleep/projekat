<?php

include "konekcija_sa_bazom.php";

$id = $_POST["id"];
$ime = $_POST["ime"];
$godine = $_POST["godine"];
$pol = $_POST["pol"];
$datum_clanarine = $_POST["datum_clanarine"];
$clanarina_placena = isset($_POST["clanarina_placena"]) ? 1 : 0;
$personalni_treninzi = isset($_POST["personalni_treninzi"]) ? 1 : 0;
$napomena = $_POST["napomena"];

$staraSlikaUpit = $baza->prepare("SELECT slika FROM vezbaci WHERE id = :id");
$staraSlikaUpit->bindValue(":id", $id);
$staraSlikaRez = $staraSlikaUpit->execute();
$staraSlikaRed = $staraSlikaRez->fetchArray(SQLITE3_ASSOC);
$nazivSlike = $staraSlikaRed["slika"];

if (isset($_FILES["slika"]) && $_FILES["slika"]["error"] == 0) {
    $folder = __DIR__ . "/../uploads/";

    if (!file_exists($folder)) {
        mkdir($folder, 0777, true);
    }

    $originalniNaziv = $_FILES["slika"]["name"];
    $privremenaPutanja = $_FILES["slika"]["tmp_name"];
    $ekstenzija = pathinfo($originalniNaziv, PATHINFO_EXTENSION);
    $noviNaziv = time() . "_" . rand(1000, 9999) . "." . $ekstenzija;
    $novaPutanja = $folder . $noviNaziv;

    move_uploaded_file($privremenaPutanja, $novaPutanja);
    $nazivSlike = $noviNaziv;
}

$upit = $baza->prepare("
UPDATE vezbaci SET
    ime = :ime,
    godine = :godine,
    pol = :pol,
    datum_clanarine = :datum_clanarine,
    clanarina_placena = :clanarina_placena,
    personalni_treninzi = :personalni_treninzi,
    napomena = :napomena,
    slika = :slika
WHERE id = :id
");

$upit->bindValue(":id", $id);
$upit->bindValue(":ime", $ime);
$upit->bindValue(":godine", $godine);
$upit->bindValue(":pol", $pol);
$upit->bindValue(":datum_clanarine", $datum_clanarine);
$upit->bindValue(":clanarina_placena", $clanarina_placena, SQLITE3_INTEGER);
$upit->bindValue(":personalni_treninzi", $personalni_treninzi, SQLITE3_INTEGER);
$upit->bindValue(":napomena", $napomena);
$upit->bindValue(":slika", $nazivSlike);

$rezultat = $upit->execute();

if ($rezultat) {
    echo "Vežbač uspešno izmenjen.";
} else {
    echo "Greška pri izmeni.";
}

?>
