<?php

include "konekcija_sa_bazom.php";

$rezultat = $baza->query("
SELECT *
FROM vezbaci
ORDER BY id DESC
");

$vezbaci = array();

while ($red = $rezultat->fetchArray(SQLITE3_ASSOC)) {
    $vezbaci[] = $red;
}

echo json_encode($vezbaci, JSON_UNESCAPED_UNICODE);

?>
