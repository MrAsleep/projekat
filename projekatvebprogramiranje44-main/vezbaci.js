var vezbaci = [];

var btnDodajVezbaca = document.getElementById("btnDodajVezbaca");
var btnPrikaziVezbace = document.getElementById("btnPrikaziVezbace");
var btnPrimeni = document.getElementById("btnPrimeni");
var btnSacuvajIzmene = document.getElementById("btnSacuvajIzmene");

var formaSekcija = document.getElementById("formaSekcija");
var vezbaciSekcija = document.getElementById("vezbaciSekcija");

var vezbacForm = document.getElementById("vezbacForm");
var editForm = document.getElementById("editForm");

var filterClanarina = document.getElementById("filterClanarina");
var filterPersonalni = document.getElementById("filterPersonalni");

var vezbaciContainer = document.getElementById("vezbaciContainer");
var brojVezbaca = document.getElementById("brojVezbaca");

var modalUredi = new bootstrap.Modal(document.getElementById("modalUredi"));

btnDodajVezbaca.addEventListener("click", prikaziFormu);
btnPrikaziVezbace.addEventListener("click", prikaziVezbace);
btnPrimeni.addEventListener("click", prikaziKarticeVezbaca);
vezbacForm.addEventListener("submit", dodajVezbaca);
btnSacuvajIzmene.addEventListener("click", sacuvajIzmene);

function prikaziFormu() {
  formaSekcija.classList.remove("d-none");
  vezbaciSekcija.classList.add("d-none");
}

function dodajVezbaca(e) {
  e.preventDefault();

  var ime = document.getElementById("ime").value.trim();
  var godine = parseInt(document.getElementById("godine").value);

  if (ime == "" || isNaN(godine) || godine <= 0) {
    alert("Unesi ispravne podatke (ime i godine su obavezni).");
    return;
  }

  var podaci = new FormData(vezbacForm);

  if (!document.getElementById("clanarina_placena").checked) {
    podaci.delete("clanarina_placena");
  }
  if (!document.getElementById("personalni_treninzi").checked) {
    podaci.delete("personalni_treninzi");
  }

  var zahtev = new XMLHttpRequest();
  zahtev.open("POST", "php/dodaj_vezbaca.php", true);

  zahtev.onload = function () {
    alert(zahtev.responseText);
    vezbacForm.reset();
    document.getElementById("muski").checked = true;
    prikaziVezbace();
  };

  zahtev.send(podaci);
}

function prikaziVezbace() {
  formaSekcija.classList.add("d-none");
  vezbaciSekcija.classList.remove("d-none");

  var zahtev = new XMLHttpRequest();
  zahtev.open("GET", "php/prikazi_vezbace.php", true);

  zahtev.onload = function () {
    vezbaci = JSON.parse(zahtev.responseText);
    prikaziKarticeVezbaca();
  };

  zahtev.send();
}

function prikaziKarticeVezbaca() {
  vezbaciContainer.innerHTML = "";

  var listaZaPrikaz = vezbaci.slice();

  var filterCl = filterClanarina.value;
  var filterPt = filterPersonalni.value;

  if (filterCl == "placena") {
    listaZaPrikaz = listaZaPrikaz.filter(function (v) {
      return v.clanarina_placena == 1;
    });
  } else if (filterCl == "neplacena") {
    listaZaPrikaz = listaZaPrikaz.filter(function (v) {
      return v.clanarina_placena == 0;
    });
  }

  if (filterPt == "ima") {
    listaZaPrikaz = listaZaPrikaz.filter(function (v) {
      return v.personalni_treninzi == 1;
    });
  } else if (filterPt == "nema") {
    listaZaPrikaz = listaZaPrikaz.filter(function (v) {
      return v.personalni_treninzi == 0;
    });
  }

  var jedanVezbac = listaZaPrikaz.length == 1 ? "vežbač" : "vežbača";
  brojVezbaca.textContent = listaZaPrikaz.length + " " + jedanVezbac;

  if (listaZaPrikaz.length == 0) {
    vezbaciContainer.innerHTML =
      '<div class="col-12">' +
      '<div class="empty-box p-5 text-center">' +
      '<h4 class="mb-2">Nema vežbača za prikaz</h4>' +
      '<p class="text-muted mb-0">Dodaj vežbača ili promeni filter.</p>' +
      "</div>" +
      "</div>";
    return;
  }

  for (var i = 0; i < listaZaPrikaz.length; i++) {
    var v = listaZaPrikaz[i];

    var linija = v.clanarina_placena == 1 ? "line-normalna" : "line-gojaznost";

    var clanariBadge = v.clanarina_placena == 1
      ? '<span class="badge text-bg-success">Plaćena</span>'
      : '<span class="badge text-bg-danger">Neplaćena</span>';

    var personalBadge = v.personalni_treninzi == 1
      ? '<span class="badge text-bg-primary">Da</span>'
      : '<span class="badge text-bg-secondary">Ne</span>';

    var datumTekst = v.datum_clanarine && v.datum_clanarine != ""
      ? v.datum_clanarine
      : "Nije uneto";

    var napomenaTekst = v.napomena && v.napomena != ""
      ? v.napomena
      : "Nema napomene.";

    var slikaHTML = "";
    if (v.slika && v.slika != "") {
      slikaHTML = '<img src="uploads/' + v.slika + '" class="card-img-top slika-pacijenta">';
    }

    var kartica = document.createElement("div");
    kartica.className = "col-12 col-md-6 col-xl-4";
    kartica.innerHTML =
      '<div class="card patient-card">' +
      slikaHTML +
      '<div class="card-top-line ' + linija + '"></div>' +
      '<div class="card-body p-4">' +
      '<h4 class="card-title mb-3">' + v.ime + "</h4>" +
      '<div class="info-line"><strong>Godine:</strong> ' + v.godine + "</div>" +
      '<div class="info-line"><strong>Pol:</strong> ' + v.pol + "</div>" +
      '<div class="info-line"><strong>Datum članarine:</strong> ' + datumTekst + "</div>" +
      '<div class="info-line"><strong>Članarina:</strong> ' + clanariBadge + "</div>" +
      '<div class="info-line"><strong>Personalni treninzi:</strong> ' + personalBadge + "</div>" +
      '<div class="mt-3"><strong>Napomena:</strong><p class="text-muted mb-0">' + napomenaTekst + "</p></div>" +
      '<div class="d-flex gap-2 mt-3">' +
      '<button class="btn btn-sm btn-outline-primary btn-uredi">Uredi</button>' +
      '<button class="btn btn-sm btn-outline-danger btn-obrisi">Obriši</button>' +
      "</div>" +
      "</div>" +
      "</div>";

    var btnUredi = kartica.querySelector(".btn-uredi");
    var btnObrisi = kartica.querySelector(".btn-obrisi");

    (function (vz) {
      btnUredi.addEventListener("click", function () {
        otvoriUrediModal(vz);
      });
      btnObrisi.addEventListener("click", function () {
        obrisiVezbaca(vz.id, vz.ime);
      });
    })(v);

    vezbaciContainer.appendChild(kartica);
  }
}

function otvoriUrediModal(v) {
  document.getElementById("editId").value = v.id;
  document.getElementById("editIme").value = v.ime;
  document.getElementById("editGodine").value = v.godine;
  document.getElementById("editDatumClanarine").value = v.datum_clanarine || "";
  document.getElementById("editClanarinavPlacena").checked = v.clanarina_placena == 1;
  document.getElementById("editPersonalniTreninzi").checked = v.personalni_treninzi == 1;
  document.getElementById("editNapomena").value = v.napomena || "";
  document.getElementById("editSlika").value = "";

  var polRadios = document.querySelectorAll('input[name="pol"]');
  for (var i = 0; i < polRadios.length; i++) {
    polRadios[i].checked = polRadios[i].value === v.pol;
  }

  modalUredi.show();
}

function sacuvajIzmene() {
  var ime = document.getElementById("editIme").value.trim();
  var godine = parseInt(document.getElementById("editGodine").value);

  if (ime == "" || isNaN(godine) || godine <= 0) {
    alert("Unesi ispravne podatke.");
    return;
  }

  var podaci = new FormData(editForm);

  if (!document.getElementById("editClanarinavPlacena").checked) {
    podaci.delete("clanarina_placena");
  }
  if (!document.getElementById("editPersonalniTreninzi").checked) {
    podaci.delete("personalni_treninzi");
  }

  var zahtev = new XMLHttpRequest();
  zahtev.open("POST", "php/uredi_vezbaca.php", true);

  zahtev.onload = function () {
    alert(zahtev.responseText);
    modalUredi.hide();
    prikaziVezbace();
  };

  zahtev.send(podaci);
}

function obrisiVezbaca(id, ime) {
  if (!confirm('Da li sigurno želiš da obrišeš vežbača "' + ime + '"?')) {
    return;
  }

  var podaci = new FormData();
  podaci.append("id", id);

  var zahtev = new XMLHttpRequest();
  zahtev.open("POST", "php/obrisi_vezbaca.php", true);

  zahtev.onload = function () {
    alert(zahtev.responseText);
    prikaziVezbace();
  };

  zahtev.send(podaci);
}
