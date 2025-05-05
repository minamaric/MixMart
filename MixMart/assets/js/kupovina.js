window.onload = function(){
    function AjaxCallBack(url, result) {
        $.ajax({
            url: url,
            dataType: "json",
            method: "get",
            success: result,
            error: function (xhr) {
                console.error(`Error loading ${url}:`, xhr);
                alert("Došlo je do greške pri učitavanju podataka. Pokušajte ponovo.");
            }            
        })
    }

    const putanja = "assets/data/";

    AjaxCallBack(putanja + "meni.json", function(result){
        ispisiMeni(result);
    })

    AjaxCallBack(putanja + "proizvodi.json", function(result) {
        kreirajDDL(result);
    })

    let sviProizvodi = []; 
    let jsonDataArray = [];

    function AjaxCallBackAll(url, result) {
        $.ajax({
            url: putanja + url,
            dataType: "json",
            method: "GET",
            success: result,
            error: function (xhr) {
                console.error(`Error loading ${url}:`, xhr);
            }
        });
    }

    const jsonUrls = [
        'knjige.json',
        'novcanici.json',
        'pokloni.json',
        'prenosiveSolje.json',
        'solje.json',
        'stilorke.json',
        'sveske.json'
    ];

    jsonUrls.forEach((url) => {
        AjaxCallBackAll(url, function (data) {
            jsonDataArray.push(data); 

            if (jsonDataArray.length === jsonUrls.length) {
                sviProizvodi = jsonDataArray.flat(); 
                ispisSvihProizvoda(sviProizvodi);
                sacuvajLS("sviProizvodi", sviProizvodi); 
            }
        });
    });
    
    $(document).on("change", "#ddlKat", promena);
    $(document).on("change", "#sort", promena);
    $(document).on("input", "#inputZaFunkciju", promena);
}

function sacuvajLS(ime, vrednost){
    localStorage.setItem(ime, JSON.stringify(vrednost));
}
function dohvatiIzLS(ime){
    return JSON.parse(localStorage.getItem(ime));
}

function promena() {
    let izabranaKategorija = $("#ddlKat").val();
    let proizvodi = dohvatiIzLS("sviProizvodi");

    if (izabranaKategorija === "0") {
        ispisSvihProizvoda(proizvodi);
    } else {
        let filtriraniProizvodi = filtrirajPoKategoriji(izabranaKategorija);
        ispisSvihProizvoda(filtriraniProizvodi);
    }
}

function ispisiMeni(nizMeni) {
    let sadrzajZaIspis = "";

    for(let meni of nizMeni) {
        sadrzajZaIspis += `<li class="nav-item mx-3">
        <a class="nav-link text-dark hover" href="${meni.href}"><p>${meni.text}</p></a>
      </li>`;
    }
    
    $("#meniispis").html(sadrzajZaIspis);
}

function kreirajDDL(proizvodi) {
    let ispis = `<div class="form-group">
                  <select class="form-select" id="ddlKat">
                    <option value="0">Izaberi</option>`;
    for (let proizvod of proizvodi) {
      ispis += `<option value="${proizvod.naziv}">${proizvod.naziv}</option>`;
    }
    ispis += `</select></div>`;
  
    $("#proizvodi").html(ispis);

}

function ispisSvihProizvoda(dataArray) {
    let ispisProizvoda = "";

    const sviProizvodi = dataArray.reduce((acc, kategorija) => acc.concat(kategorija), []);
    sacuvajLS("sviProizvodi", sviProizvodi);

    for(let p of sviProizvodi) {
            ispisProizvoda += `<div class="col-xl-3 d-flex justify-content-around align-items-center card2 shop-items">
                                    <div class="slikaDiv shop-item">
                                        <img class="shop-item-image" src="${p.src}" alt="${p.naziv}" />
                                    </div>
                                    <div id="tekstProizvoda" class="shop-item">
                                        <h6 class="text-center shop-item-title">${p.naziv}</h6>
                                        <p class="text-center shop-item-price">${p.cena.cenaSaSajta}</p>
                                        <button class="btn btn-primary shop-item-button" type="button">Dodaj u korpu</button>
                                    </div>
                                </div>`;
    }

    $("#sviProizvodi").html(ispisProizvoda);
}

let sviProizvodi = dohvatiIzLS("sviProizvodi");

function filtrirajPoKategoriji(kategorija) {
    return sviProizvodi.filter(function(proizvod) { 
        return proizvod.kategorija === kategorija;
    });
}

$(document).on("change", "#ddlKat", function() {
    let izabranaKategorija = $(this).val();
    let filtriraniProizvodi = [];

    if (izabranaKategorija === "0") {
        ispisSvihProizvoda(sviProizvodi);
        sacuvajLS("filtriraniProizvodi", sviProizvodi);
    } else {
        filtriraniProizvodi = filtrirajPoKategoriji(izabranaKategorija);
        ispisSvihProizvoda(filtriraniProizvodi);
        sacuvajLS("filtriraniProizvodi", filtriraniProizvodi);
    }

    $("#sviProizvodi").addClass("klasaFilter");
    $("#prodavnica").addClass("klasaFilterProd");
    $("#prodavnica .col-3, .col-9").addClass("klasaFilterProd");
});

$("#inputZaFunkciju").on("input", function() {
    let unos = $(this).val().toLowerCase();
    let filtriraniProizvodi = dohvatiIzLS("sviProizvodi");

    if (!filtriraniProizvodi || filtriraniProizvodi.length === 0) {
        filtriraniProizvodi = sviProizvodi.filter(function(proizvod) {
            return proizvod.naziv.toLowerCase().includes(unos);
        });
    } else {
        filtriraniProizvodi = filtriraniProizvodi.filter(function(proizvod) {
            return proizvod.naziv.toLowerCase().includes(unos);
        });
    }

    ispisSvihProizvoda(filtriraniProizvodi);
});


function prikaziPoruku(poruka) {
    $("#sviProizvodi").html(`<h4 class="mt-4 mx-5">${poruka}</h4>`);
}


$(document).on("change", "#sort", function() {
    let proizvodiZaSortiranje = dohvatiIzLS("sviProizvodi");

    let tip = $("#sort").val();
    if (tip == "nazivAsc") {
        proizvodiZaSortiranje.sort((a, b) => a.naziv.localeCompare(b.naziv));
    }
    else if (tip == "nazivDesc") {
        proizvodiZaSortiranje.sort((a, b) => b.naziv.localeCompare(a.naziv));
    }
    else if (tip == "cenaAsc") {
        proizvodiZaSortiranje.sort((a, b) => parseFloat(a.cena.cenaSaSajta) - parseFloat(b.cena.cenaSaSajta));
    }
    else if (tip == "cenaDesc") {
        proizvodiZaSortiranje.sort((a, b) => parseFloat(b.cena.cenaSaSajta) - parseFloat(a.cena.cenaSaSajta));
    }

    ispisSvihProizvoda(proizvodiZaSortiranje);
});


function validacijaForma() {
    var ispravno = true;
    var poruke = [];

    if (!validacijaImeIPrezime()) {
        ispravno = false;
        poruke.push("Ime i prezime moraju početi velikim slovom i sadržati barem 3 karaktera!");
    }

    if (!validacijaPrijave()) {
        ispravno = false;
        poruke.push("Odaberite vrstu isporuke!");
    }

    if (!validacijaRadio()) {
        ispravno = false;
        poruke.push("Odaberite način plaćanja!");
    }

    if (!validacijaAdresa()) {
        ispravno = false;
        poruke.push("Adresa nije u ispravnom formatu!");
    }

    if(!validacijaEmail()) {
        ispravno = false;
        poruke.push("Email nije u ispravnom formatu!");
    }

    if(!validacijaKartica()) {
        ispravno = false;
        poruke.push("Broj kartice nije validan!");
    }

    if (ispravno) {
        let span = document.getElementById("pretplataSpan");
        span.innerHTML = "Uspešno ste se obavili kupovinu!";
        span.classList.remove("greska");
        span.classList.add("uspesno");
    } else {
        let span = document.getElementById("pretplataSpan");
        span.innerHTML = poruke.join("<br>");
        span.classList.remove("uspesno");
        span.classList.add("greska");
        span.classList.add("vidljiv");
    }
}

function validacijaImeIPrezime() {
    var imeRegEx = /^[A-Z][a-z]{2,10}( [A-Z][a-z]{2,15})?$/;
    var ime = document.getElementById('ime').value;

    if(imeRegEx.test(ime)) {
        return true;
    }
    else {
        let span = document.getElementById("pretplataSpan");
        span.innerHTML = "Ime i prezime moraju početi velikim slovom i sadržati barem 3 karaktera!"
        span.classList.remove("uspesno");
        span.classList.add("greska");
        
        return false;
    }
}

function validacijaAdresa() {
    const adresaRegEx = /^(\d{1,5})?\s*([a-zA-ZćčžšđĆČŽŠĐ]+\s*)+\d{0,5}(\s*[,.-]?\s*[a-zA-ZćčžšđĆČŽŠĐ]+\s*\d{0,5})*$/;
    var adresa = document.getElementById('adresa').value;
    
    if(adresaRegEx.test(adresa)) {
        return true;
    }
    else {
        let span = document.getElementById("pretplataSpan");
        span.innerHTML = "Adresa nije u ispravnom formatu!"
        span.classList.remove("uspesno");
        span.classList.add("greska");
        
        return false;
    }
}

function validacijaPrijave() {
    var isporuka = document.getElementById("vrstaIsporuke").value;

    if (isporuka === "0") {
        let span = document.getElementById("pretplataSpan");
        span.innerHTML = "Odaberite vrstu isporuke!";
        span.classList.remove("uspesno");
        span.classList.add("greska");

        return false;
    } 
    else {
        return true;
    }
}

function validacijaRadio() {
    var pouzeceChecked = document.getElementById("pouzece").checked;
    var karticaChecked = document.getElementById("kartica").checked;

    if (!pouzeceChecked && !karticaChecked) {
        let span = document.getElementById("pretplataSpan");
        span.innerHTML = "Odaberite način plaćanja!";
        span.classList.remove("uspesno");
        span.classList.add("greska");

        return false;
    } 
    else {
        return true;
    }
}

function validacijaEmail() {
    var emailRegEx = /^[a-zA-Z0-9._%+-]+@(?:gmail\.com|ict\.edu\.rs)$/;
    var email = document.getElementById('email').value;

    if(emailRegEx.test(email)) {
        return true;
    }
    else {
        let span = document.getElementById("pretplataSpan");
        span.innerHTML = "Email nije u ispravnom formatu!";
        span.classList.remove("uspesno");
        span.classList.add("greska");
        
        return false;
    }
}

function validacijaKartica() {
    var karticaRegEx = /^\d{4} ?\d{4} ?\d{4} ?\d{4}$/;
    var kartica = document.getElementById('brojKartice').value;

    if(karticaRegEx.test(kartica)) {
        return true;
    }
    else {
        let span = document.getElementById("pretplataSpan");
        span.innerHTML = "Broj kartice nije validan!";
        span.classList.remove("uspesno");
        span.classList.add("greska");
        
        return false;
    }
}