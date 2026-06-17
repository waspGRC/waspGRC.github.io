document.addEventListener("DOMContentLoaded", () => {
    // 1. Generar estrellas para el fondo
    const starsContainer = document.getElementById('stars-container');
    for (let i = 0; i < 60; i++) {
        let star = document.createElement('div');
        star.classList.add('star');
        star.style.width = `${Math.random() * 3 + 1}px`;
        star.style.height = star.style.width;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        starsContainer.appendChild(star);
    }

    // 2. Control de escenas
    const scenes = document.querySelectorAll('.scene');
    let currentScene = 0;
    const finalSceneIndex = 5; // Índice de la escena con los botones
    
    // Avanzar de escena al tocar en cualquier lugar (hasta llegar a la pregunta)
    document.getElementById('app').addEventListener('click', (e) => {
        // Evitar avanzar si estamos interactuando con botones o el input de fecha
        if(e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || currentScene >= finalSceneIndex) return;
        
        if (currentScene < finalSceneIndex) {
            scenes[currentScene].classList.remove('active');
            currentScene++;
            scenes[currentScene].classList.add('active');
        }
    });

    // 3. Lógica del botón escapadizo
    const btnNo = document.getElementById('btn-no');
    const funnyMessages = [
        "¿Segura?", 
        "Creo que fallaste.", 
        "Inténtalo otra vez.", 
        "Yo tampoco quería dejarme encontrar.", 
        "¡Casi!", 
        "Tus deditos no son tan rápidos."
    ];
    let msgIndex = 0;

    function escapeButton(e) {
        e.preventDefault();
        
        // Cambiamos a posición fixed para que se mueva por toda la pantalla
        btnNo.style.position = 'fixed';
        
        // Calculamos los límites de la pantalla respetando el tamaño del botón
        const maxX = window.innerWidth - btnNo.offsetWidth - 20;
        const maxY = window.innerHeight - btnNo.offsetHeight - 20;
        
        // Generamos una nueva posición aleatoria
        const randomX = Math.max(10, Math.floor(Math.random() * maxX));
        const randomY = Math.max(10, Math.floor(Math.random() * maxY));
        
        btnNo.style.left = `${randomX}px`;
        btnNo.style.top = `${randomY}px`;
        
        // Actualizamos el mensaje gracioso
        btnNo.innerText = funnyMessages[msgIndex % funnyMessages.length];
        msgIndex++;
    }

    // Funciona tanto con mouse como con táctil
    btnNo.addEventListener('mouseover', escapeButton);
    btnNo.addEventListener('touchstart', escapeButton);

    // 4. Lógica del botón SÍ
    const btnYes = document.getElementById('btn-yes');
    const datePicker = document.getElementById('date-picker');

    btnYes.addEventListener('click', async () => {
        const selectedDate = datePicker.value;
        
        if (!selectedDate) {
            alert("Por favor, elige un día para nuestra cita primero. ✨");
            return;
        }

        // Formatear fecha para mostrarla bonita
        const dateObj = new Date(selectedDate + 'T00:00:00'); // Evitar desfase de zona horaria
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('date-display').innerText = dateObj.toLocaleDateString('es-ES', options);

        // Cambiar a escena de éxito
        scenes[currentScene].classList.remove('active');
        document.getElementById('scene-success').classList.add('active');

        // Lanzar partículas (corazones y destellos)
        createHearts();

        // Enviar datos silenciosamente usando Web3Forms
        // REEMPLAZA "TU_ACCESS_KEY_DE_WEB3FORMS" con la llave que te den en web3forms.com
        const formData = new FormData();
        formData.append("access_key", "TU_ACCESS_KEY_DE_WEB3FORMS");
        formData.append("subject", "¡Dijo que SÍ a la cita!");
        formData.append("message", `Te han aceptado la cita. La fecha elegida es: ${selectedDate}`);

        try {
            await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });
            console.log("Notificación enviada silenciosamente.");
        } catch (error) {
            console.error("Error al enviar la notificación.", error);
        }
    });

    // Función para crear la animación de corazones
    function createHearts() {
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.classList.add('heart');
                heart.innerText = ['✨', '💜', '🤍', '🌙'][Math.floor(Math.random() * 4)];
                heart.style.left = `${Math.random() * 100}vw`;
                heart.style.top = `100vh`;
                document.body.appendChild(heart);
                
                // Limpiar el DOM después de la animación
                setTimeout(() => {
                    heart.remove();
                }, 3000);
            }, i * 100);
        }
    }
});
