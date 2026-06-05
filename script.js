window.addEventListener("resize", ajustarEscenaDespensa);
window.addEventListener("load", ajustarEscenaDespensa);

function abrirLibro(){

    document.getElementById("pantalla1")
        .classList.add("hidden");

    const pantalla2 =
        document.getElementById("pantalla2");

    pantalla2.classList.remove("hidden");

    setTimeout(() => {

    pageSound.play();

}, 100);

setTimeout(() => {

    document.getElementById("magicSound").play();

}, 2800);

setTimeout(() => {

    document.querySelector(".left-page")
        .classList.add("animate-left");

    document.querySelector(".right-page")
        .classList.add("animate-right");

}, 350);

    document.getElementById("texto1")
        .classList.add("show1");

    document.getElementById("texto2")
        .classList.add("show2");

    document.getElementById("btnBuscar")
        .classList.add("showBtn");
}

// =========================
// DATOS DE LOS INGREDIENTE
// =========================
const ingredientes = [
{
id: 'ternura',
nombre: 'Resiliencia',
emoji: 'Resiliencia',
desc: 'Una cucharada generosa, porque siempre encuentras la forma de seguir adelante, incluso cuando estas nerviosa y es algo que admiro mucho de ti.',
img: 'frasco4.png'
},
{
id: 'alegria',
nombre: 'Alegría',
emoji: 'Alegria',
desc: 'Dos cucharadas de alegría, porque tienes una manera hermosa de iluminar incluso los días más grises sin que lo notes',
img: 'frasco4.png'
},
{
id: 'enojo',
nombre: 'Enojo',
emoji: 'Enojo',
desc: 'Una pizca de enojo, porque cuando te enojas si me das miedo.',
img: 'frasco4.png'
},
{
id: 'paciencia',
nombre: 'Paciencia',
emoji: 'Paciencia',
desc: 'Una taza de paciencia, porque sabes como escuchar y acompañar, en especial mucho conmigo.',
img: 'frasco4.png'
},
{
id: 'dulzura',
nombre: 'Dulzura',
emoji: 'Dulzura',
desc: 'Tres cucharadas de dulzura, porque aun por mas pequeña que sea la situacion, siempre encuentras una manera de hacerla unica, y porque también te encantan los postres.',
img: 'frasco4.png'
},
{
id: 'determinacion',
nombre: 'Determinación',
emoji: 'Determinacion',
desc: 'Dos cucharadas de determinación, porque cuando quieres algo siempre lo obtienes.',
img: 'frasco4.png'
},
{
id: 'sensibilidad',
nombre: 'Sensibilidad',
emoji: 'Sensibilidad',
desc: 'Una cucharada de sensibilidad, porque sientes muy profundo y aunque a veces te lastime, también es lo que te hace ser abby',
img: 'frasco4.png'
},
{
id: 'amor',
nombre: 'Amor',
emoji: 'Amor',
desc: 'La cantidad necesaria de amor, porque aunque en principio no lo demuestres, tienes muchisimo amor para dar y eso es algo hermoso e inesperado de ti',
img: 'frasco4.png'
}
];


let recolectados = 0;
let ingredienteActualId = null;

// =========================
// LÓGICA DE LA DESPENSA
// =========================

function irADespensa() {
    // Transición de la escena 2 a la 3
    document.getElementById("pantalla2").classList.add("hidden");
    const pantalla3 = document.getElementById("pantalla3");
    pantalla3.classList.remove("hidden");
    
    // Generar frascos en el HTML
    renderizarFrascos();
    ajustarEscenaDespensa();
}

function renderizarFrascos() {
    const contenedor = document.getElementById("contenedor-frascos");
    contenedor.innerHTML = ""; 

    ingredientes.forEach((ing, index) => {
        const frasco = document.createElement("div");
        
        // Le asignamos la clase base "frasco" y su posición única (pos-0, pos-1...)
        frasco.className = `frasco pos-${index}`;
        frasco.id = `frasco-${ing.id}`;
        frasco.onclick = () => abrirModalIngrediente(ing);
        
        // Reemplazamos el emoji por la etiqueta img. 
        // Nota: asumo que tendrás un archivo como 'frasco-calma.png' guardado
        frasco.innerHTML = `
            <img src="${ing.img}" alt="${ing.nombre}">
        `;
        
        contenedor.appendChild(frasco);
    });
}

function añadirIngrediente() {
    // Sonido de confirmación suave
    const dingSnd = document.getElementById("dingSound");
    if(dingSnd) { dingSnd.currentTime = 0; dingSnd.play(); }

    // Ocultar modal
    document.getElementById("modal-ingrediente").classList.add("hidden");

    // Marcar frasco como recolectado
    const frascoVisual = document.getElementById(`frasco-${ingredienteActualId}`);
    frascoVisual.classList.add("recolectado");

    // Actualizar contadores
    recolectados++;
    document.getElementById("tracker-count").innerText = `${recolectados}/8`;
    
    // Buscar emoji del ingrediente actual para añadirlo a la lista superior
    const ing = ingredientes.find(i => i.id === ingredienteActualId);
    document.getElementById("tracker-emojis").innerText += ing.emoji;

    ingredientesSeleccionados++;
    actualizarBowl();


    // Checar si ya completó la receta
    if (recolectados === 8) {
        setTimeout(activarMagiaFinal, 1000); // Pequeña pausa dramática
    }
}


function activarMagiaFinal() {
    // Sonido mágico de mezcla
    const mixSnd = document.getElementById("mixSound");
    if(mixSnd) { mixSnd.currentTime = 0; mixSnd.play(); }

    // Mostrar modal final oscuro con brillo
    document.getElementById("modal-final").classList.remove("hidden");
    
    // Aquí podrías agregar librerías de partículas como canvas-confetti o hacer animaciones extra
}

function ajustarEscenaDespensa() {
    const escena = document.getElementById("escena-despensa");
    if (!escena) return;

    const baseW = 1920;
    const baseH = 1080;

    const scaleX = window.innerWidth / baseW;
    const scaleY = window.innerHeight / baseH;
    const scale = Math.min(scaleX, scaleY);

    escena.style.transform = `scale(${scale})`;
    escena.style.left = `${(window.innerWidth - baseW * scale) / 2}px`;
    escena.style.top = `${(window.innerHeight - baseH * scale) / 2}px`;
}

let ingredientesSeleccionados = 0;

function actualizarBowl() {
    const bowl = document.getElementById("bowl-magico");
    const bowlImg = document.getElementById("bowl-img");

    // 1. Efecto de crecimiento progresivo
    // Cada ingrediente aumenta el tamaño base. 
    // Empezamos en 15%, cada uno suma 1% adicional.
    const nuevoTamano = 15 + (ingredientesSeleccionados * 1.5); 
    bowl.style.width = nuevoTamano + "%";

    // 2. Efecto de iluminación
    // A medida que agregamos ingredientes, el brillo aumenta
    if (ingredientesSeleccionados > 0) {
        bowl.classList.add("bowl-iluminado");
        // Aumentamos el resplandor según la cantidad
        bowlImg.style.filter = `brightness(${1 + (ingredientesSeleccionados * 0.1)}) drop-shadow(0 0 ${ingredientesSeleccionados * 5}px rgba(255, 255, 255, 0.6))`;
    }

    // 3. Si llega a los 8, puedes disparar una animación extra
    if (ingredientesSeleccionados === 8) {
        console.log("¡La receta está lista!");
        bowl.style.transform = "scale(1.2) rotate(5deg)"; // Animación de finalización
    }
}

function abrirModalIngrediente(ing) {
    // 1. Sonido de vidrio
    const glassSnd = document.getElementById("glassSound");
    if(glassSnd) { glassSnd.currentTime = 0; glassSnd.play(); }

    // 2. Guardar ID del ingrediente
    ingredienteActualId = ing.id;
    
    // 3. Llenar datos de la tarjeta
    document.getElementById("modal-emoji").innerText = ing.emoji;
    document.getElementById("modal-titulo").innerText = ing.nombre;
    const texto = document.getElementById("modal-texto");
    texto.innerText = ing.desc;
    
    // 4. Mostrar modal
    document.getElementById("modal-ingrediente").classList.remove("hidden");
}

function activarMagiaFinal() {
    // 1. Primero, mostramos el modal que ya tenías de "Receta Completada"
    const modalFinal = document.getElementById("modal-final");
    modalFinal.classList.remove("hidden");



    // 2. Esperar 5 segundos y luego hacer la transición a la carta
    setTimeout(() => {
        // Desvanecer toda la pantalla
        const pantalla3 = document.getElementById("pantalla3");
        pantalla3.style.transition = "opacity 2s ease";
        pantalla3.style.opacity = "0";

        // Iniciar música
        const music = document.getElementById("musicBackground");
        if(music) music.play();

        // 3. Mostrar la carta en blanco
        setTimeout(() => {
            const carta = document.getElementById("carta-final");
            carta.classList.remove("hidden");
            carta.style.opacity = "1"; // Animación de aparición
            
            const cartaMusic = document.getElementById("cartaMusic");

if (cartaMusic) {
    cartaMusic.volume = 0.3;
    cartaMusic.play();
     let volumen = 0;

    const fade = setInterval(() => {
        volumen += 0.02;

        if (volumen >= 0.35) {
            volumen = 0.35;
            clearInterval(fade);
        }

        cartaMusic.volume = volumen;
    }, 100);
}


      // Efecto de escritura
escribirCarta(`Pensé que podría hacerte una receta

Pensé que, si observaba lo suficiente, podría explicarte con algunos ingredientes

Un poquito de resiliencia
Un poquito de alegría
Una pizquita de enojo
Un puñado de dulzura
Paciencia
Sensibilidad
Amor

Y por un momento pense que si los mezclaba todos podría recrearte

Pero estaba equivocado
porque tu no eres la suma de tus cualidades, no eres solo una lista de cosas bonitas
no eres un conjunto de ingredientes cuidadosamente seleccionados

Eres esas risas (sonrisas) que aparecen cuando menos las espero
Los momentos que hacen que un día muy difícil se sienta mucho más ligero

La calma que encuentro cuando todo parece interminable
La personita que hace que mi mundo sea un lugar mucho mejor simplemente por existir
Y por eso nunca pude terminar la receta

Por eso nunca pude hornearte
Porque alguien como tú no se puede crear.
Ni se puede copiar
Ni se puede explicar por completo

Solo se puede encontrar
Y de todas las casualidades que pudieron ocurrir en mi vida...

Encontrarte a ti siempre será lo mejor que me pudo pasar`);

}, 2000); // 2 segundos para completar el desvanecimiento
}, 5000); // Los 5 segundos que pediste de espera
}


// Función para el efecto de escritura
function escribirCarta(mensaje) {
const contenedor = document.getElementById("texto-carta");

contenedor.innerHTML = "";

let i = 0;

function escribir() {
    if (i < mensaje.length) {
        contenedor.innerHTML += mensaje.charAt(i);
        i++;
        setTimeout(escribir, 35);
    }
}

escribir();

}


