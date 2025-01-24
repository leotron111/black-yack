// las variables
let baraja = [];
const tipos = ['C', 'P', 'T', 'D'];
const figu = ['A', 'J', 'Q', 'K'];
let puntosJugador = [];
let puntosPc = 0;
let turno = [];
let numturno = 0;
let jugadores = 0;
let apuestas = [];
let dineroJugadores = [];

// referncia al html
const btnPedir = document.querySelector('#pedir');
const btnPasar = document.querySelector('#parar');
const btnNuevo = document.querySelector('#nuevo');
const marcadorJugador = [
    document.querySelector('#puntaje1'),
    document.querySelector('#puntaje2'),
    document.querySelector('#puntaje3'),
    document.querySelector('#puntaje4'),
    document.querySelector('#puntaje5'),
    document.querySelector('#puntaje6')
];

const marcadorPc = document.querySelector('#puntajePc');
const divCartaJugador = [
    document.querySelector('#jugador1'),
    document.querySelector('#jugador2'),
    document.querySelector('#jugador3'),
    document.querySelector('#jugador4'),
    document.querySelector('#jugador5'),
    document.querySelector('#jugador6')
];
const divCartaPc = document.querySelector('#divPc');
let primeraCartaPc;
let cartaOcultaPc;

// añade las cartas al mazo
function crearDeck() {
    // agraga del 2 al 10 en el mazo
    for (let i = 2; i <= 10; i++) {
        for (let tipo of tipos) {
            baraja.push(i + tipo);
        }
    }

    // agrega las figuras al mazo
    for (let tipo of tipos) {
        for (let fig of figu) {
            baraja.push(fig + tipo);
        }
    }
    baraja = _.shuffle(baraja);
    return baraja;
}

// analiza si quedan cartas en el mazo
function pedirCarta() {
    
    if (baraja.length === 0) {
        console.error("No quedan cartas en la baraja.");
        return null;
    }
    return baraja.pop();
}

// da valor a las cartas
function valorCarta(carta) {
    const valor = carta.substring(0, carta.length - 1);
    return isNaN(valor) ? (valor === 'A' ? 11 : 10) : parseInt(valor);
}

// accion del boton pedir carta donde le da al jugador otra carta y analiza si se ha pasado o no
function pedirOtraCarta() {
    //crea la carta
    const carta = pedirCarta();
    const crearCarta = document.createElement('img');
    crearCarta.src = `img/${carta}.png`;
    crearCarta.classList.add('carta');

    divCartaJugador[numturno].append(crearCarta);

    const valor = valorCarta(carta);
    puntosJugador[numturno] += valor;

    marcadorJugador[numturno].innerHTML = "<b> " + puntosJugador[numturno] + " </b>";

    // mira si el jugador se ha pasado de 21
    if (puntosJugador[numturno] > 21) {
        alert(`Jugador ${numturno + 1} se ha pasado de 21 puntos y ha perdido.`);
        numturno++;

        // revisa que todos los jugadores han jugado
        if (numturno >= jugadores) {
            numturno = 0;
            btnPedir.disabled = true;
            btnPasar.disabled = true;
            revelarCartaPc();
            cartasPc();
        }
    }
}

// reaprte cartas a los jugadores
function repartirCartasJugador() {
    
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < jugadores; j++) {
            const carta = pedirCarta();
            const crearCarta = document.createElement('img');
            crearCarta.src = `img/${carta}.png`;
            crearCarta.classList.add('carta');

            
            divCartaJugador[j].append(crearCarta);
            const valor = valorCarta(carta);

            // reinicia el puntiaje
            if (!puntosJugador[j]) {
                puntosJugador[j] = 0;
            }

            // actualizar el puntaje del jugador actual
            puntosJugador[j] += valor;
            if (marcadorJugador[j]) {
                marcadorJugador[j].innerHTML = "<b> " + puntosJugador[j] + " </b>";
            }
        }
    }
}

// solicita la apuesta del jugador, comprueba la apuesata y la actualiza en el html
function manejarApuestas() {
    for (let i = 0; i < jugadores; i++) {
        let apuesta;
        do {
            apuesta = prompt(`Jugador ${i + 1}, ¿cuánto dinero deseas apostar? (Dinero disponible: ${dineroJugadores[i]})`);
            apuesta = parseFloat(apuesta);
        } while (isNaN(apuesta) || apuesta <= 0 || apuesta > dineroJugadores[i]);
       
        //actualiza la apuesta en el html
        apuestas[i] = apuesta;
        dineroJugadores[i] -= apuesta;
        document.querySelector(`#dinero${i + 1}`).innerHTML = `<b>Dinero restante: ${dineroJugadores[i]}</b>`;
    }
}

// Repartir cartas al PC
function repartirCartasPc() {
    // carta oculta del pc
    cartaOcultaPc = document.createElement('img');
    cartaOcultaPc.src = `img/reverso-gris.png`;
    cartaOcultaPc.classList.add('carta');
    divCartaPc.append(cartaOcultaPc);

    // carta visible del pc
    const segundaCartaPc = pedirCarta();
    const crearCarta = document.createElement('img');
    crearCarta.src = `img/${segundaCartaPc}.png`;
    crearCarta.classList.add('carta');
    divCartaPc.append(crearCarta);

    // pide la carta que quedara oculta
    primeraCartaPc = pedirCarta();

    const valorSegundaCartaPc = valorCarta(segundaCartaPc);
    puntosPc += valorSegundaCartaPc;
    if (marcadorPc) {
        marcadorPc.innerHTML = "<b> " + puntosPc + " </b>";
    }
}

// muestra la carta oculta del pc
function revelarCartaPc() {
    cartaOcultaPc.src = `img/${primeraCartaPc}.png`;
    const valorPrimeraCartaPc = valorCarta(primeraCartaPc);
    puntosPc += valorPrimeraCartaPc;
    marcadorPc.innerHTML = "<b> " + puntosPc + " </b>";
}

// jugada del pc
function cartasPc() {
    
    while (puntosPc < 17) {
        const cartaPc = pedirCarta();
        const crearCarta = document.createElement('img');
        crearCarta.src = `img/${cartaPc}.png`;
        crearCarta.classList.add('carta');
        divCartaPc.append(crearCarta);

        const valorPc = valorCarta(cartaPc);
        puntosPc += valorPc;
        marcadorPc.innerHTML = "<b> " + puntosPc + " </b>";
    }

    // dice si el pc pierde
    setTimeout(() => {
        if (puntosPc > 21) {
            alert('La computadora ha perdido, se ha pasado de 21 puntos.'); // Mensaje de pérdida
        } else {
            determinarGanador();
        }
    }, 500);
}

// dice quien gana y quien pierde y en el caso de empate te devuelve el dinero y en caso de ganar te multiplica la apuesta 
function determinarGanador() {
    for (let i = 0; i < jugadores; i++) {
        if (puntosJugador[i] > 21) {
            alert(`Jugador ${i + 1} ha perdido (más de 21 puntos).`);
        } else if (puntosPc > 21 || puntosJugador[i] > puntosPc) {
            alert(`¡Jugador ${i + 1} ha ganado!`);
            dineroJugadores[i] += apuestas[i] * 2;
        } else if (puntosJugador[i] < puntosPc) {
            alert(`Jugador ${i + 1} ha perdido (PC tiene más puntos).`);
        } else {
            alert(`Jugador ${i + 1} ha empatado con la PC.`);
            dineroJugadores[i] += apuestas[i];
        }
        document.querySelector(`#dinero${i + 1}`).innerHTML = `<b>Dinero restante: ${dineroJugadores[i]}</b>`;
    }
}

// funcionamiento botones y cantidad de jugadores
document.addEventListener('DOMContentLoaded', () => {
    crearDeck();

    // preguntar la cantidad de jugadores
    let pregjugadores = prompt("Ingrese cantidad de jugadores");
    jugadores = parseInt(pregjugadores);

    // verifica que la cantidad de jugadores es correcta
    while (jugadores < 2 || jugadores > 6) {
        pregjugadores = prompt("Cantidad de jugadores no válida. Ingrese un número entre 2 y 6.");
        jugadores = parseInt(pregjugadores);
    }
    
    // establece el dinero para cada jugador
    for (let i = 0; i < jugadores; i++) {
        dineroJugadores[i] = 1000;
    }

    // maneja la apuesta
    manejarApuestas();

    // inicia los turnos y establece turnos
    for (let i = 0; i < jugadores; i++) {
        turno[i] = i;
        puntosJugador[i] = 0;
    }

    // reparte cartas al jugador
    repartirCartasJugador();
    // reparte carta al pc
    repartirCartasPc();

    // boton par pedir otra carta
    btnPedir.addEventListener('click', () => {
        pedirOtraCarta();
    });

    //boton pasar donde le da turno al siguiente y si no hay mas jugadores pasa el turno al pc
    btnPasar.addEventListener('click', () => {
        numturno++;
        if (numturno >= jugadores) {
            numturno = 0;
            btnPedir.disabled = true;
            btnPasar.disabled = true;
            revelarCartaPc();
            cartasPc();
        }
    });
    // recarga el juego
    btnNuevo.addEventListener('click', () => {
        location.reload();
    });
});
