document.addEventListener('DOMContentLoaded', () => {
    const mediaContainers = document.querySelectorAll('.card-media-container');

    mediaContainers.forEach(container => {
        const slides = container.querySelectorAll('.slide');
        if (slides.length <= 1) return;

        let currentIndex = 0;
        const intervalTime = 4000; // 4 seconds per slide

        const showSlide = (index) => {
            slides.forEach(slide => {
                slide.classList.remove('active');
                if (slide instanceof HTMLVideoElement) {
                    slide.pause();
                }
            });

            const currentSlide = slides[index];
            currentSlide.classList.add('active');

            if (currentSlide instanceof HTMLVideoElement) {
                currentSlide.muted = true;
                currentSlide.currentTime = 0;
                currentSlide.play().catch(error => {
                    console.log("Autoplay prevented:", error);
                });
            }
        };

        // Initialize first slide
        showSlide(currentIndex);

        setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        }, intervalTime);
    });
});