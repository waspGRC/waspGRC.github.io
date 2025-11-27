const track = document.querySelector(".carousel-track");
const slides = Array.from(document.querySelectorAll(".slide"));
const indicators = Array.from(document.querySelectorAll(".indicator"));

let currentIndex = 0;
const totalSlides = slides.length;

/* --------------------------------
   FUNCIONES BASE DEL CARRUSEL
-----------------------------------*/
function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateIndicators();
}

function updateIndicators() {
    indicators.forEach((dot, index) => {
        if (index === currentIndex) dot.classList.add("active");
        else dot.classList.remove("active");
    });
}

function goToNext() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
}

function goToPrev() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

/* --------------------------------
   SWIPE PARA MOVIL
-----------------------------------*/
let startX = 0;
let isSwiping = false;

track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
});

track.addEventListener("touchmove", (e) => {
    if (!isSwiping) return;
});

track.addEventListener("touchend", (e) => {
    if (!isSwiping) return;

    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (diff > 50) {
        goToNext();
    } else if (diff < -50) {
        goToPrev();
    }

    isSwiping = false;
});

/* --------------------------------
   CLICK EN INDICADORES (OPCIONAL)
-----------------------------------*/
indicators.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        currentIndex = index;
        updateCarousel();
    });
});

/* Inicializa */
updateCarousel();
