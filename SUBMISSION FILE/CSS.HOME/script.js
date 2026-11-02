/* =========================================================
   SLIDESHOW SCRIPT  -  script.js
   Works for EVERY element with class="slideshow" on the page.
   Keep this file in the SAME folder as home.html.
   ========================================================= */

const SECONDS_PER_PICTURE = 4;   // change this to make the pictures change faster or slower

/* A black and sky blue "Picture 1 of 3" card. It is used automatically
   for any picture file that can't be found, so you can see the slideshow
   working before your real pictures are ready. */
function makePlaceholder(number, total) {
    const svg =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">' +
        '<rect width="600" height="600" fill="#000000"/>' +
        '<text x="300" y="290" fill="#87ceeb" font-family="Arial, sans-serif" font-size="44" text-anchor="middle">' +
        'Picture ' + number + ' of ' + total + '</text>' +
        '<text x="300" y="345" fill="#ffffff" font-family="Arial, sans-serif" font-size="26" text-anchor="middle">' +
        'coming soon</text></svg>';
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".slideshow").forEach(function (show) {

        const slides  = show.querySelectorAll(".slide");
        const prevBtn = show.querySelector(".prev");
        const nextBtn = show.querySelector(".next");
        let dotsBox   = show.querySelector(".dots");

        if (slides.length === 0) { return; }     // nothing to show

        // Make the dots holder if it is missing from the HTML
        if (!dotsBox) {
            dotsBox = document.createElement("div");
            dotsBox.className = "dots";
            show.appendChild(dotsBox);
        }

        let current = 0;
        let timer = null;
        const dots = [];

        // 1. Swap any missing picture for a numbered placeholder
        slides.forEach(function (img, i) {
            function usePlaceholder() {
                if (img.dataset.placeholder) { return; }     // already done
                img.dataset.placeholder = "yes";
                img.src = makePlaceholder(i + 1, slides.length);
            }
            img.addEventListener("error", usePlaceholder);   // picture fails while loading
            if (img.complete && img.naturalWidth === 0) {    // picture had ALREADY failed before this script ran
                usePlaceholder();
            }
        });

        // 2. Build one little dot for every picture
        slides.forEach(function (_, i) {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.setAttribute("aria-label", "Go to picture " + (i + 1));
            dot.addEventListener("click", function () {
                goTo(i);
                startTimer();
            });
            dotsBox.appendChild(dot);
            dots.push(dot);
        });

        // 3. Show picture number n (and loop round at the start and the end)
        function goTo(n) {
            current = (n + slides.length) % slides.length;
            slides.forEach(function (img, i) {
                img.classList.toggle("active", i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("active", i === current);
            });
        }

        // 4. Automatic change every few seconds (skipped for people who asked their device for less motion)
        function startTimer() {
            clearInterval(timer);
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { return; }
            timer = setInterval(function () { goTo(current + 1); }, SECONDS_PER_PICTURE * 1000);
        }

        // 5. Arrow buttons
        if (prevBtn) { prevBtn.addEventListener("click", function () { goTo(current - 1); startTimer(); }); }
        if (nextBtn) { nextBtn.addEventListener("click", function () { goTo(current + 1); startTimer(); }); }

        // 6. Pause while the mouse is over the slideshow
        show.addEventListener("mouseenter", function () { clearInterval(timer); });
        show.addEventListener("mouseleave", startTimer);

        goTo(0);
        startTimer();
    });
});