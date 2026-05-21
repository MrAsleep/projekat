<?php

include "konekcija_sa_bazom.php";

$ime = $_POST["ime"];
$godine = $_POST["godine"];
$pol = $_POST["pol"];
$datum_clanarine = $_POST["datum_clanarine"];
$clanarina_placena = isset($_POST["clanarina_placena"]) ? 1 : 0;
$personalni_treninzi = isset($_POST["personalni_treninzi"]) ? 1 : 0;
$napomena = $_POST["napomena"];

$nazivSlike = "";

if (isset($_FILES["slika"]) && $_FILES["slika"]["error"] == 0) {
    $folder = __DIR__ . "/../uploads/";

    if (!file_exists($folder)) {
        mkdir($folder, 0777, true);
    }

    $originalniNaziv = $_FILES["slika"]["name"];
    $privremenaPutanja = $_FILES["slika"]["tmp_name"];
    $ekstenzija = pathinfo($originalniNaziv, PATHINFO_EXTENSION);
    $nazivSlike = time() . "_" . rand(1000, 9999) . "." . $ekstenzija;
    $novaPutanja = $folder . $nazivSlike;

    move_uploaded_file($privremenaPutanja, $novaPutanja);
}

$upit = $baza->prepare("
INSERT INTO vezbaci
(ime, godine, pol, datum_clanarine, clanarina_placena, personalni_treninzi, napomena, slika)
VALUES
(:ime, :godine, :pol, :datum_clanarine, :clanarina_placena, :personalni_treninzi, :napomena, :slika)
");

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
    echo "Vežbač uspešno dodat.";
} else {
    echo "Greška pri dodavanju.";
}

?>
