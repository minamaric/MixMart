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

    AjaxCallBack(putanja + "knjigeJSON.json", function(result){
        ispisiKnjige8Mart(result);
    })

    AjaxCallBack(putanja + "pokloni.json", function(result){
        ispisPokloni(result);
    })
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

var prviBlokNaslovi = ["Knjige", "Šolje", "Sveske", "Pernice"];
var prviBlokSlike = ["assets/img/ikonicaKnjiga2.png", "assets/img/ikonicaSolja1.png",  "assets/img/ikonicaSveska2.png", "assets/img/ikonicaPernica2.png"];

var prviBlokIspis = "";
for (var i = 0; i < prviBlokNaslovi.length; i++) {
    prviBlokIspis += `<div class="col-xl-3 py-4">
                        <a class="card2" href="kupovina.html">
                            <div>
                                <h2 class="text-center">${prviBlokNaslovi[i]}</h2>
                                <img class="prviBlokImg" src="${prviBlokSlike[i]}" alt="${prviBlokNaslovi[i]}" />   
                            </div>
                        </a>
                    </div>`;
}

document.getElementById("prviBlok").innerHTML = prviBlokIspis;

function ispisiKnjige8Mart(nizKnjige8Mart) {
    let sadrzajZaIspis = "";

    for(let knjiga of nizKnjige8Mart) {
        sadrzajZaIspis += `<div class="col-sm-3 mt-5 knjige">
                                <a class="card2" href="kupovina.html"><img src="${knjiga.src}" alt="${knjiga.naziv}" /><a>
                                <h5 class="text-center mt-2">${knjiga.naziv}</h5>
                                <p class="text-center mt-4"><del>${knjiga.cena.staraCena}</del></p>
                                <h6 class="text-center">NOVA CENA: ${knjiga.cena.cenaSaSajta}</h6>
                            </div>`;
    }

    $("#knjige-8mart").html(sadrzajZaIspis);
}

function ispisPokloni(pokloni) {
    var sadrzajZaIspisPoklona = "";
    for(let poklon of pokloni) {
        sadrzajZaIspisPoklona += `<div class="col-xl-3 col-md-6 d-flex justify-content-around align-items-center">
                                    <a class="card2" href="kupovina.html">
                                        <h3>${poklon.naziv}</h3>
                                            <img src="${poklon.src}" alt="${poklon.naziv}" class="mx-4 mt-4"/>
                                            <p class="small mt-5">${poklon.cena.cenaSaSajta}</p>
                                            <div class="go-corner" href="kupovina.html">
                                            <div class="go-arrow"> → </div>
                                        </div>
                                    </a>
                                </div>`
    }
    $("#pokloni").html(sadrzajZaIspisPoklona);
}

function validacijaMejl() {
    var mailRegEx = /^[a-zA-Z\d._]+@(gmail\.com|ict\.edu\.rs|yahoo\.com)$/;
    var mail = document.getElementById('mejl').value;

    if(mailRegEx.test(mail)) {
        document.getElementById('span').textContent = "Uspešno ste prosledili mejl!"
        document.getElementById('span').classList.add('ok');
        return true;
    }
    else {
        document.getElementById('span').textContent = "Mejl mora početi slovom i sadržati '@'!";
        document.getElementById('span').classList.remove('ok');
        document.getElementById('span').classList.add('err');
        return false;
    }
}