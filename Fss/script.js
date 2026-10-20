const intro = document.getElementById("intro");
const introName = document.getElementById("introName");

// Make each letter its own <span> so it can animate one by one
"AARON".split("").forEach((letter, i) => {
  const span = document.createElement("span");
  span.textContent = letter;
  span.style.animationDelay = 0.5 + i * 0.15 + "s";
  introName.appendChild(span);
});

// When the intro fades out, remove it and allow scrolling again
function finishIntro() {
  intro.remove();
  document.body.classList.remove("intro-lock");
}

intro.addEventListener("animationend", (e) => {
  if (e.animationName === "introOut") finishIntro();
});

// Safety: if animations are turned off, still open the page
setTimeout(() => {
  if (document.body.classList.contains("intro-lock")) finishIntro();
}, 5000);
