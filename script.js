    /* 1. GENERADOR DE LAS 50 ESTRELLAS DE FONDO */
        const contenedorEstrellas = document.getElementById('capa-estrellas');
        for (let i = 0; i < 50; i++) {
            const estrella = document.createElement('div');
            estrella.classList.add('star');
            const tamano = Math.random() * 1.8 + 0.8;
            estrella.style.width = `${tamano}px`;
            estrella.style.height = `${tamano}px`;
            estrella.style.top = `${Math.random() * 100}%`;
            estrella.style.left = `${Math.random() * 100}%`;
            estrella.style.animationDelay = `${Math.random() * 4}s`;
            estrella.style.animationDuration = `${Math.random() * 2 + 2}s`;
            contenedorEstrellas.appendChild(estrella);
        }

        /* 2. CONFIGURACIÓN DEL CONTADOR */
        const fechaInicio = new Date('October 7, 2025 01:30:00').getTime(); 

        setInterval(function() {
            const ahora = new Date().getTime();
            const diferencia = ahora - fechaInicio;
            const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
            const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

            const hDisplay = horas < 10 ? '0' + horas : horas;
            const mDisplay = minutos < 10 ? '0' + minutos : minutos;
            const sDisplay = segundos < 10 ? '0' + segundos : segundos;

            document.getElementById('contador').innerHTML = `${dias}d ${hDisplay}h ${mDisplay}m ${sDisplay}s`;
        }, 1000);

    /*  
        const audio = document.getElementById('audioFondo');
        const btnMúsica = document.getElementById('musicBtn');

        function toggleMúsica() {
            if (audio.paused) { audio.play(); btnMúsica.innerHTML = "🔊"; } 
            else { audio.pause(); btnMúsica.innerHTML = "🔇"; }
        }
        document.addEventListener('click', () => {
            if(audio.paused && btnMúsica.style.opacity == "1") { audio.play(); btnMúsica.innerHTML = "🔊"; }
        }, { once: true });*/


        /* LÓGICA DE AUDIO AUTÓNOMO POR INTERACCIÓN */
                const audio = document.getElementById('audioFondo');

                function iniciarMusicaClon() {
                    if (audio.paused) {
                        audio.play().catch(error => console.log("Esperando interacción..."));
                    }
                }
                // En cuanto ella haga el primer clic o toque la pantalla para leer, arranca la música
                document.addEventListener('click', iniciarMusicaClon);
                document.addEventListener('touchstart', iniciarMusicaClon);

        /* 4. CONFIGURACIÓN DE LAS 7 ESTRELLAS INTERACTIVAS Y SUS COORDENADAS */
       const recuerdos = [
    { x: 30, y: 35, texto: "Andrómeda observaba el cielo sin saber que su historia estaba por cambiar" }, // Andrómeda
    { x: 38, y: 48, texto: "Y solo a veces las historias más importantes comienzan como cualquier otro día, sin ninguna señal ni ninguna advertencia" },
    { x: 46, y: 60, texto: "Y aun así entre millones y millones de posibilidades dos destinos empezaban a encontrarse lentamente" },

    { x: 50, y: 50, texto: "Y desde entonces, cada vez que miro este cielo, recuerdo que la estrella más importante de aquella noche nunca estuvo sobre nosotros. Estaba a mi lado." }, // Estrella central

    { x: 60, y: 42, texto: "Aquel día nuestros caminos se cruzaron, lo que parecía un instante más terminó convirtiéndose en el comienzo de algo inolvidable" }, // Perseo
    { x: 68, y: 30, texto: "Y como Perseo encontró a Andrómeda yo encontré en ti a alguien capaz de iluminar mis días incluso en los momentos difíciles" },
    { x: 76, y: 20, texto: "Y con el tiempo comprendí que no se trataba solo de compartir momentos, sino de construir recuerdos, sueños y un futuro juntos" }
];


        const capaInteractiva = document.getElementById('estrellas-interactivas-layer');
        const modal = document.getElementById('modalRecuerdo');
        const modalTexto = document.getElementById('modalTexto');
        const svgLienzo = document.getElementById('svg-constelacion');

        /* [NUEVO] GENERAR LAS LÍNEAS CONECTIVAS DINÁMICAMENTE ENTRE LAS ESTRELLAS EN ORDEN */
        // Andrómeda
for (let i = 0; i < 2; i++) {
    const linea = document.createElementNS("http://www.w3.org/2000/svg", "line");
    linea.classList.add("constellation-line");

    linea.setAttribute("x1", `${recuerdos[i].x}%`);
    linea.setAttribute("y1", `${recuerdos[i].y}%`);

    linea.setAttribute("x2", `${recuerdos[i + 1].x}%`);
    linea.setAttribute("y2", `${recuerdos[i + 1].y}%`);

    svgLienzo.appendChild(linea);
}

// Perseo
for (let i = 4; i < 6; i++) {
    const linea = document.createElementNS("http://www.w3.org/2000/svg", "line");
    linea.classList.add("constellation-line");

    linea.setAttribute("x1", `${recuerdos[i].x}%`);
    linea.setAttribute("y1", `${recuerdos[i].y}%`);

    linea.setAttribute("x2", `${recuerdos[i + 1].x}%`);
    linea.setAttribute("y2", `${recuerdos[i + 1].y}%`);

    svgLienzo.appendChild(linea);
}

function crearLinea(origen, destino) {
    const linea = document.createElementNS("http://www.w3.org/2000/svg", "line");

    linea.classList.add("constellation-line");

    linea.setAttribute("x1", `${recuerdos[origen].x}%`);
    linea.setAttribute("y1", `${recuerdos[origen].y}%`);

    linea.setAttribute("x2", `${recuerdos[destino].x}%`);
    linea.setAttribute("y2", `${recuerdos[destino].y}%`);

    svgLienzo.appendChild(linea);
}

crearLinea(2, 3);
crearLinea(4, 3);


        // Creamos un set para rastrear los índices de estrellas visitadas únicas
        const estrellasVistas = new Set();

        recuerdos.forEach((recuerdo, index) => {
            const starDiv = document.createElement('div');
            starDiv.classList.add('interactive-star');
            starDiv.style.left = `${recuerdo.x}%`;
            starDiv.style.top = `${recuerdo.y}%`;
            starDiv.style.opacity = "0";
            starDiv.style.animation = "fadeInElement 3s ease-in-out forwards";
            starDiv.style.animationDelay = `${13 + (index * 0.3)}s`;

            const core = document.createElement('div');
            core.classList.add('star-core');
            starDiv.appendChild(core);

            // Al hacer clic
            starDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                modalTexto.innerText = recuerdo.texto;
                modal.classList.add('active');
                
                starDiv.classList.add('vista');
                estrellasVistas.add(index);

                /* [NUEVO] COMPROBACIÓN: ¿Ya vio las 7 estrellas únicas? */
                if (estrellasVistas.size === recuerdos.length) {
                    // Esperamos a que cierre el modal actual para desencadenar el clímax
                    modal.setAttribute("data-final", "true");
                }
            });

            capaInteractiva.appendChild(starDiv);
        });

        function cerrarRecuerdo() { 
            const esFinal = modal.getAttribute("data-final") === "true";
            modal.classList.remove('active'); 
            
            // Si es la última estrella, inicia la transición cinemática final
            if (esFinal) {
                modal.removeAttribute("data-final");
                
                // 1. Encendemos las líneas de la constelación con un delay elegante
                setTimeout(() => {
                    svgLienzo.classList.add('activa');
                    
                    // 2. Después de 3.5 segundos disfrutando el dibujo en el cielo, aparece la historia
                    setTimeout(() => {
                        document.getElementById('pantallaHistoria').classList.add('active');
                    }, 3500);
                    
                }, 600);
            }
        }
        document.addEventListener('click', () => { if(modal.classList.contains('active')) cerrarRecuerdo(); });
