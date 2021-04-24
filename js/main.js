//---------------------------------- DECLARACION DE CLASES -------------------------------//
class Variables{
    constructor(tasa, monto, cuotas, gracia) { 
        this.tasa = parseInt(tasa);
        this.monto = parseInt(monto);
        this.cuotas = parseInt(cuotas);
        this.gracia = parseInt(gracia);
    }
}

const pesos = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

//---------------------------------- guardar datos del formulario y comunicar dato ingresado -------------------------------//
let tasa 
let monto
let cuotas
let gracia

//tasa
$("#myTasa").change(function(miEvento){
    miEvento.preventDefault();
    tasa = parseInt(miEvento.target.value);
    if (tasa > 0) {
        $("#notificacionTasa").html(`<p class="pAnimado animate__animate animate__bounceIn">Tasa anual ingresada para cálculo: ${tasa}%</p>`);
    } else {
        $("#notificacionTasa").html(`<p class="pAnimado2 animate__animate animate__bounceIn">Ingresar dato válido.</p>`);
    }
    
});

//monto
$("#myMonto").change(function (miEvento){    
    miEvento.preventDefault();
    monto = parseInt(miEvento.target.value);
    if (monto > 0) {
        $("#notificacionMonto").html(`<p class="pAnimado animate__animate animate__bounceIn">Monto ingresado para cálculo: ${pesos.format(monto)}</p>`);
    } else {
        $("#notificacionMonto").html(`<p class="pAnimado2 animate__animate animate__bounceIn">Ingresar dato válido.</p>`);
    }
    
});

//cuotas
$("#myCuotas").change(function (miEvento){
    miEvento.preventDefault();
    cuotas = parseInt(miEvento.target.value);
    if (cuotas > 0) {
        $("#notificacionCuotas").html(`<p class="pAnimado animate__animate animate__bounceIn">La cantidad de cuotas ingresadas para cálculo: ${cuotas} cuotas.</p>`);
    } else {
        $("#notificacionCuotas").html(`<p class="pAnimado2 animate__animate animate__bounceIn">Ingresar dato válido.</p>`);
    }
    
});


//gracia
$("#myGracia").change(function (miEvento){
    miEvento.preventDefault();
    gracia = parseInt(miEvento.target.value);
    if (gracia >= 0) {
        $("#notificacionGracia").html(`<p class="pAnimado animate__animate animate__bounceIn">La cantidad de meses de gracia ingresada para cálculo es de: ${gracia} meses.</p>`);
    } else {
        $("#notificacionGracia").html(`<p class="pAnimado2 animate__animate animate__bounceIn">Ingresar dato válido.</p>`);
    }
    
});


//CASOS
const casos = [];

//----------------------------------FÓRMULAS-------------------------------//
//boton calcular y notifica en la misma página
$("#btnCalcular").click ((e) => {   
    
    let i;
    let sumatoriaCuotas = 0;
    let sumatoria = 0;
    const valorCuota = (a,b) => (a/b);
    valorCuotaPesos = valorCuota(monto, cuotas)
    $("#descuentoImplicito").empty();
    $("#estructuraTable").empty();
    $("#notificacionValorActual").empty();
    $("#sumatoriaValorActual").empty();
    $("#btnClear").empty();
    $("#notificacionError").empty();
    
    

    if (tasa > 0 & monto > 0 & cuotas > 0 & gracia >= 0) {

    $("#estructuraTable").append(`<table class="table"
                                    <thead">
                                        <tr class="row">
                                            <th class="col-4">Período</th>
                                            <th class="col-4">Cuota Fija</th>
                                            <th class="col-4">Valor Actual Cuota</th>
                                        </tr>
                                    </thead>
                                </table>`);
    for (i = 1; i <= cuotas ; i++) {     
        const valorActualCuota = (a,b,c,d,e,f,g) => ((a/b) / ((c+((d/e)/b)) ** (f+g)));
        valorActualCuotaPesos = valorActualCuota(monto, cuotas, 1, tasa, 100, i, gracia)
        $("#notificacionValorActual").append(`<table class="table">
                                                <tbody>
                                                    <tr class="row">
                                                        <th class="col-4">${i}</th>
                                                        <td class="col-4">${pesos.format(valorCuotaPesos)}</td>
                                                        <td class="col-4">${pesos.format(valorActualCuotaPesos)}</td>                                       
                                                    </tr>
                                                </tbody>
                                            </table>`);
        casos.push(new Variables(tasa, monto, cuotas, gracia));
        sumatoriaCuotas += valorCuotaPesos;
        sumatoria += valorActualCuotaPesos;
          
    }
    $("#sumatoriaValorActual").append(`<table class="table">
                                            <tfoot>
                                                <tr class="row">
                                                <th class="col-4">TOTAL</th>
                                                    <th class="col-4">${pesos.format(sumatoriaCuotas)}</th>
                                                    <th class="col-4">${pesos.format(sumatoria)}</th>
                                                </tr>
                                            </tfoot>
                                    </table>`);
    
    
    const descuentoImplicito = (a,b,c,d) => ((a-(b/c))*d);
    descuentoImplicitoPesos = descuentoImplicito(1, sumatoria, monto, 100)
    $("#descuentoImplicito").append(`<div class="alert alert-success marginAlert" role="alert">
                                        <h4 class="alert-heading">El descuento implícito es: ${Math.round(descuentoImplicito(1, sumatoria, monto, 100))}%</h4>
                                        <p>Esto significa que si te hacen un descuento mayor al ${Math.round(descuentoImplicito(1, sumatoria, monto, 100))}% te conviene abonar en efectivo.</p>
                                        <hr>
                                        <p class="mb-0">De otra forma aprovecha las cuotas sin interés.</p>
                                    </div>`);    
    $("html, body").animate({
        scrollTop: $("#descuentoImplicito").offset().top
    },2000);

    let unJSON = JSON.stringify(casos[0]);
    localStorage.setItem("lista", JSON.stringify(casos));
    let listaObjetos = JSON.parse(localStorage.getItem("lista"));
    for(let obj of listaObjetos){
    }
    localStorage.setItem("caso", unJSON);
    let datoGuardado = JSON.parse(localStorage.getItem("caso"));



    
    $("#btnClear").append(`<button class="boton">Ingresar nuevo caso</button>`);
    let btnClear = document.querySelector('#btnClear');
    let inputs = document.querySelectorAll('input');

    btnClear.addEventListener('click', () => {        
        inputs.forEach(input => input.value = '');
        $("#descuentoImplicito").empty();
        $("#estructuraTable").empty();
        $("#notificacionValorActual").empty();
        $("#sumatoriaValorActual").empty();
        $("#btnClear").empty();
        $("#notificacionTasa").empty();
        $("#notificacionMonto").empty();
        $("#notificacionCuotas").empty();
        $("#notificacionGracia").empty();
        tasa = "";
        monto = "";
        cuotas = "";
        gracia = "";
        

        $("html, body").animate({
            scrollTop: $("#empezar").offset().top
        },0);
        $("h1")
            .fadeOut(2000)
                .fadeIn(1000);  
        });
    } else {
        $("#notificacionError").html(`<div class="alert alert-danger" role="alert">Error: Dato inválido o falta ingresar dato.</div>`);
        $("html, body").animate({
            scrollTop: $("#notificacionError").offset().top
        },2000);
    }    
        
});




//---------------------------------- DOM LOAD -------------------------------//


$(document).ready(function () { 
    let spinner = `<div class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                    </div>
                    </div>`;
    $("#notificacion").html(spinner);  
});


window.addEventListener('load', () => {
    let alert = `<div class="alert alert-success" role="alert">
                Completa todos los datos y te ayudamos a tomar la decisión.
                </div>`;
    $("#notificacion").html(alert);
});



//---------------------------------- ANIMACIONES -------------------------------//


$("h1")
    .fadeOut(2000)
        .fadeIn(1000);