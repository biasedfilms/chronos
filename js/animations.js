function showResults() {
    landingScreen.classList.add("fade-out");

    setTimeout(() => {
        landingScreen.classList.remove("active", "fade-out");

        resultsScreen.classList.add("active");
    }, 500);
}


function showLanding() {
    resultsScreen.classList.add("fade-out");

    setTimeout(() => {
        resultsScreen.classList.remove("active", "fade-out");

        landingScreen.classList.add("active");
    }, 500);
}


function animateNumber(element, target, duration = 1600, delay = 0) {

    const animationId =
        String(
            Number(element.dataset.animationId || 0) + 1
        );

    element.dataset.animationId =
        animationId;

    setTimeout(() => {

        if (element.dataset.animationId !== animationId) {
            return;
        }

        const startTime = performance.now();

        function update(currentTime) {

            if (element.dataset.animationId !== animationId) {
                return;
            }

            const elapsed =
                currentTime - startTime;

            const progress =
                Math.min(elapsed / duration, 1);

            const eased =
                1 - Math.pow(1 - progress, 4);

            const value =
                Math.floor(target * eased);

            element.textContent =
                value.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);

    }, delay);
}
