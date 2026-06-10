    document.addEventListener('DOMContentLoaded', () => {
    const scenes = document.querySelectorAll('.scene');
    const scrollIndicator = document.getElementById('scroll-indicator');
    let currentScene = 0;
    let isTransitioning = false;

    // --- NAVEGACIÓN ---
    function goToScene(index) {
        if (isTransitioning || index < 0 || index >= scenes.length) return;
        isTransitioning = true;

        // Ocultar indicador de scroll en la última escena
        if (index === scenes.length - 1) {
            scrollIndicator.classList.add('hidden');
        } else {
            scrollIndicator.classList.remove('hidden');
        }

        const prev = scenes[currentScene];
        prev.classList.remove('active');
        prev.classList.add('passed');

        currentScene = index;
        const next = scenes[currentScene];
        next.classList.remove('passed');
        next.classList.add('active');

        // Disparar efectos ambientales según escena
        updateParticlesForScene(currentScene);
        if (currentScene === scenes.length - 1) triggerLetterAnimation();

        // Bloqueo temporal para transiciones fluidas
        setTimeout(() => {
            isTransitioning = false;
        }, 3200);
    }

    // Scroll con rueda del ratón
    let wheelTimeout;
    window.addEventListener('wheel', (e) => {
        if (wheelTimeout) clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
            if (e.deltaY > 25) goToScene(currentScene + 1);
            else if (e.deltaY < -25) goToScene(currentScene - 1);
        }, 40);
    }, { passive: true });

    // Gestos táctiles eficientes
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > 40) {
            if (diff > 0) goToScene(currentScene + 1);
            else goToScene(currentScene - 1);
        } else {
            // Tap dinámico en tercios de pantalla
            if (touchEndY > window.innerHeight * 0.75) goToScene(currentScene + 1);
            else if (touchEndY < window.innerHeight * 0.25) goToScene(currentScene - 1);
        }
    }, { passive: true });


    // --- CINEMATIC PARALLAX MULTICAPA ---
    window.addEventListener('mousemove', (e) => {
        if (currentScene === scenes.length - 1) return; // Desactivar en la carta final
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        const activeLayers = scenes[currentScene].querySelectorAll('.layer');
        activeLayers.forEach(layer => {
            let speed = 0;
            if (layer.classList.contains('bg')) speed = 8;
            if (layer.classList.contains('mid')) speed = 18;
            if (layer.classList.contains('fg')) speed = 32;

            layer.style.transform = `translate(${x * -speed}px, ${y * -speed}px) scale(1.1)`;
        });
    });


    // --- MOTOR DE PARTÍCULAS ATMOSFÉRICAS ---
    const canvas = document.getElementById('fx-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor(type) {
            this.type = type;
            this.reset();
            this.y = Math.random() * canvas.height; // Distribución inicial uniforme
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 80;
            this.size = Math.random() * 2 + 0.5;
            this.speedY = 0;
            this.speedX = 0;
            this.opacity = Math.random() * 0.6 + 0.1;
            this.life = 0;
            this.maxLife = Math.random() * 250 + 150;

            if (this.type === 'stars') {
                this.y = Math.random() * canvas.height;
                this.speedY = (Math.random() - 0.5) * 0.08;
                this.speedX = (Math.random() - 0.5) * 0.08;
                this.color = `rgba(255, 255, 255, ${this.opacity})`;
            } else if (this.type === 'dust') {
                this.speedY = -(Math.random() * 0.4 + 0.1);
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.color = `rgba(255, 235, 190, ${this.opacity})`;
            } else if (this.type === 'leaves') {
                this.size = Math.random() * 4 + 2.5;
                this.speedY = Math.random() * 1.2 + 0.6;
                this.speedX = (Math.random() - 0.5) * 1.5;
                this.angle = Math.random() * Math.PI * 2;
                this.spin = (Math.random() - 0.5) * 0.08;
                this.color = `rgba(165, 210, 135, ${this.opacity})`;
                this.y = -40;
            } else if (this.type === 'sunset') {
                this.speedY = -(Math.random() * 0.8 + 0.2);
                this.speedX = (Math.random() - 0.5) * 0.6;
                this.color = `rgba(255, 160, 90, ${this.opacity})`;
                this.size = Math.random() * 3 + 1;
            }
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life++;

            if (this.type === 'leaves') {
                this.angle += this.spin;
                this.x += Math.sin(this.life * 0.04) * 0.8;
            }

            if (this.life > this.maxLife || this.y < -90 || this.y > canvas.height + 90 || this.x < -50 || this.x > canvas.width + 50) {
                this.reset();
            }

            let currentOpacity = this.opacity;
            if (this.life < 60) currentOpacity *= (this.life / 60);
            if (this.maxLife - this.life < 60) currentOpacity *= ((this.maxLife - this.life) / 60);
            
            this.color = this.color.replace(/[\d.]+\)$/g, `${currentOpacity})`);
        }

        draw() {
            ctx.beginPath();
            if (this.type === 'leaves') {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.fillStyle = this.color;
                ctx.ellipse(0, 0, this.size, this.size * 0.5, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            } else {
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }
    }

    function initParticles(type, count) {
        particles = [];
        if (type === 'none') return;
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(type));
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    function updateParticlesForScene(index) {
        if (index === 0 || index === 1 || index === 10 || index === 11) initParticles('stars', 80);
        else if (index === 2 || index === 3 || index === 7) initParticles('dust', 50);
        else if (index === 4 || index === 5 || index === 6) initParticles('leaves', 35);
        else if (index === 8 || index === 9) initParticles('sunset', 65);
        else initParticles('none', 0);
    }

    // Inicializar primera escena
    updateParticlesForScene(0);


    // --- ELEMENTOS DE LA ESCENA 5 (PÁGINAS VOLANTES) ---
    const pagesContainer = document.querySelector('.floating-pages-container');
    for (let i = 0; i < 12; i++) {
        const page = document.createElement('div');
        page.style.position = 'absolute';
        page.style.width = '24px';
        page.style.height = '34px';
        page.style.background = 'rgba(255, 250, 240, 0.55)';
        page.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        page.style.left = `${Math.random() * 100}%`;
        page.style.top = `${Math.random() * 100}%`;
        page.style.transform = `rotate(${Math.random() * 360}deg)`;
        page.style.filter = `blur(${Math.random() * 1.5}px)`;
        page.style.transition = 'transform 12s ease-in-out';
        
        setInterval(() => {
            if (currentScene === 4) {
                page.style.transform = `translate(${(Math.random() - 0.5) * 150}px, ${(Math.random() - 0.5) * 150}px) rotate(${Math.random() * 360}deg)`;
            }
        }, 4000 + Math.random() * 2000);

        pagesContainer.appendChild(page);
    }


    // --- ANIMACIÓN DE LA CARTA ESCRITA A MANO ---
    const letterLines = [
      "¿Qué haría un día entero contigo?",
  "Es una pregunta que me hizo pensar, porque si tuviera que elegir, tenemos muchísimas opciones.",
  "Podríamos irnos a un bosque, a la playa, a un museo, a una librería, o simplemente perdernos por ahí.",
  "Pero siendo realistas, un día no sería suficiente para todo esto.",
  "Después de pensarlo mucho, llegué a una conclusión:",
  "No necesito un día extraordinario para disfrutarlo,",
  "si el simple hecho de que tú estuvieras, lo haría más que extraordinario.",
  "Empezaría desde temprano, tal vez no tanto para no molestarte, mi dormilona,",
  "con un café y un desayuno que te hiciera feliz.",
  "Escucharía todo lo que tengas que contarme,",
  "sin fijarnos en la hora, sin preocuparnos por el tiempo.",
  "Después, visitaríamos esa librería pendiente,",
  "caminaríamos descubriendo libros y leyendo juntos, aunque fuera por un momento.",
  "Luego, pasearíamos por algún lugar bonito,",
  "donde cualquier sitio se siente diferente si camino contigo.",
  "Seguramente terminaría dándote pequeños empujones y tú regresándomelos con el triple de fuerza.",
  "Como a los dos nos gusta comer, pasaríamos más tiempo decidiendo qué probar que comiendo,",
  "pero seguramente compartiríamos platos y descubriríamos sabores nuevos.",
  "Después, bastaría con sentarnos juntos,",
  "hablar de nosotros y disfrutar del silencio sin que se vuelva incómodo.",
  "Aunque vivamos muy lejos y esto sea una ilusión por ahora,",
  "tengo la certeza de que algún día, no tendremos que imaginarlo, sino vivirlo.",
  "Pero aún así, un solo día no sería suficiente.",
  "Porque tenemos muchas conversaciones pendientes, muchos lugares por conocer,",
  "y muchísimos recuerdos por crear.",
  "Entonces, si me preguntas qué haría un día entero contigo,",
  "mi respuesta sería: disfrutar cada momento a tu lado.",
  "Al final, lo importante no es qué haríamos ni cómo lo haríamos.",
  "Lo importante sería estar contigo.",
  "Donde sea, pero contigo."
];

    let letterTriggered = false;

    function triggerLetterAnimation() {
        if (letterTriggered) return;
        letterTriggered = true;
        
        const container = document.getElementById('letter-text');
        container.innerHTML = '';
        
        setTimeout(() => {
            letterLines.forEach((text, index) => {
                const lineDiv = document.createElement('div');
                lineDiv.className = 'letter-line';
                lineDiv.textContent = text;
                container.appendChild(lineDiv);
                
                setTimeout(() => {
                    lineDiv.classList.add('visible');
                }, index * 2200); 
            });
        }, 2500);
    }
});

const music = document.getElementById('bgMusic');

function startMusic() {
    music.volume = 0;
    music.play();

    let volume = 0;
    const fade = setInterval(() => {
        volume += 0.02;

        if (volume >= 0.5) {
            volume = 0.5;
            clearInterval(fade);
        }

        music.volume = volume;
    }, 100);

    document.removeEventListener('click', startMusic);
}

document.addEventListener('click', startMusic);
