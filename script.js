const letras = [
  "No quiero tomar cafe...",
  "Porque el cafe quita el sueño...",
  "Lo que quiero es tomar TE",
  "Pues tomando TE me duermo..",
  "Y una vez que TE tomé.",
  "Yo tan suave te encontré",
  "Que todo el tiempo quiero estar.",
  "Tomando TE"
];

let index = 0;
let playing = false;

const lyricsContainer = document.getElementById("lyrics");
const progress = document.getElementById("progress");
const currentTime = document.getElementById("currentTime");

function togglePlay() {
  playing = !playing;

  if (playing) {
    document.querySelector(".play").innerText = "⏸";
    reproducir();
  } else {
    document.querySelector(".play").innerText = "▶";
  }
}

function reproducir() {
  if (!playing) return;

  if (index < letras.length) {

    lyricsContainer.innerHTML = `
      <p class="past">${letras[index - 1] || ""}</p>
      <p class="current">${letras[index]}</p>
    `;

    progress.style.width = ((index + 1) / letras.length) * 100 + "%";

    currentTime.innerText = "0:" + (index * 3).toString().padStart(2, '0');

    index++;
    setTimeout(reproducir, 2500);
  }
}

function like() {
  document.querySelector(".like").innerText = "💚";
}
