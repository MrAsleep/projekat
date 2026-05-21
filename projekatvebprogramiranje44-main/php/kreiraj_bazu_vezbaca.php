<?php

include "konekcija_sa_bazom.php";

$sql = "
CREATE TABLE IF NOT EXISTS vezbaci (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ime TEXT,
    godine INTEGER,
    pol TEXT,
    datum_clanarine TEXT,
    clanarina_placena INTEGER DEFAULT 0,
    personalni_treninzi INTEGER DEFAULT 0,
    napomena TEXT,
    slika TEXT
)
";

$baza->exec($sql);

echo "Tabela vezbaci uspešno kreirana.";

?>
