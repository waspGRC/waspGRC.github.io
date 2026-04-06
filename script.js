// 🎵 LETRAS SINCRONIZADAS
const letras = [
  { tiempo: 2, texto: "No quiero tomar café..." },
  { tiempo: 6, texto: "Porque el café quita el sueño..." },
  { tiempo: 11, texto: "Lo que quiero es tomar té..." },
  { tiempo: 16, texto: "Pues tomando té me duermo..." },
  { tiempo: 21, texto: "Y una vez que te tomé..." },
  { tiempo: 26, texto: "Yo tan suave te encontré..." },
  { tiempo: 32, texto: "Que todo el tiempo quiero estar..." },
  { tiempo: 38, texto: "Tomando té 💖" }
];

// 🎯 VARIABLES
let currentIndex = 0;
let playing = false;

const lyricsContainer = document.getElementById("lyrics");
const progress = document.getElementById("progress");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const audio = document.getElementById("audio");

// ▶️ PLAY / PAUSA
function togglePlay() {
  const btn = document.querySelector(".play");

  if (!playing) {
    audio.play();
    btn.innerText = "⏸";
    playing = true;
  } else {
    audio.pause();
    btn.innerText = "▶";
    playing = false;
  }
}

// 💚 LIKE
function like() {
  document.querySelector(".like").innerText = "💚";
}

// ⏱ ACTUALIZAR TIEMPO + BARRA + LETRAS
audio.addEventListener("timeupdate", () => {
  // progreso
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = progressPercent + "%";

  // tiempo actual
  let minutes = Math.floor(audio.currentTime / 60);
  let seconds = Math.floor(audio.currentTime % 60);
  currentTime.innerText = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  // 🎤 LETRAS SINCRONIZADAS
  if (currentIndex < letras.length) {
    if (audio.currentTime >= letras[currentIndex].tiempo) {

      lyricsContainer.innerHTML = `
        <p class="past">${letras[currentIndex - 1]?.texto || ""}</p>
        <p class="current">${letras[currentIndex].texto}</p>
      `;

      currentIndex++;
    }
  }
});

// ⏳ DURACIÓN TOTAL
audio.addEventListener("loadedmetadata", () => {
  let minutes = Math.floor(audio.duration / 60);
  let seconds = Math.floor(audio.duration % 60);

  totalTime.innerText =
    `${minutes}:${seconds.toString().padStart(2, "0")}`;
});

// 🔁 CUANDO TERMINA LA CANCIÓN
audio.addEventListener("ended", () => {
  playing = false;
  document.querySelector(".play").innerText = "▶";

  // reiniciar
  currentIndex = 0;
  lyricsContainer.innerHTML = "";
  progress.style.width = "0%";
  currentTime.innerText = "0:00";
});
