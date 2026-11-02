/* ==========================================================
   slideshow.js
   Runs every <div class="slideshow"> on the page.
   Each <img> inside the div becomes one slide.

   - Shows the first photo straight away
   - Changes photo every few seconds (set SLIDE_DELAY below)
   - Adds previous / next arrows when there are 2 or more photos
   - Pauses while the mouse is over the square or an arrow has focus
   - Does not auto-play if the visitor has animations turned off
   ========================================================== */

const SLIDE_DELAY = 3500;   // milliseconds between photos (3500 = 3.5 seconds)

document.querySelectorAll(".slideshow").forEach(function (show) {
  const slides = show.querySelectorAll("img");
  if (slides.length === 0) return;          // no photos yet: grey box stays

  let current = 0;
  let timer = null;

  slides[0].classList.add("active");
  if (slides.length === 1) return;          // one photo: nothing to rotate

  function showSlide(number) {
    slides[current].classList.remove("active");
    current = (number + slides.length) % slides.length;   // loops round
    slides[current].classList.add("active");
  }

  function makeButton(label, symbol, className, step) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "slide-btn " + className;
    button.setAttribute("aria-label", label);
    button.textContent = symbol;
    button.addEventListener("click", function () {
      showSlide(current + step);
    });
    show.appendChild(button);
  }

  makeButton("Previous photo", "\u2039", "prev", -1);
  makeButton("Next photo", "\u203A", "next", 1);

  function start() {
    stop();
    timer = setInterval(function () {
      showSlide(current + 1);
    }, SLIDE_DELAY);
  }

  function stop() {
    clearInterval(timer);
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    start();
    show.addEventListener("mouseenter", stop);
    show.addEventListener("mouseleave", start);
    show.addEventListener("focusin", stop);
    show.addEventListener("focusout", start);
  }
});