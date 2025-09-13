// Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelector('.cards');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const totalCards = document.querySelectorAll('.cards li').length;
    
    let currentIndex = 0;
    
    // Function to update carousel position
    function updateCarousel() {
        const cardWidth = 70; // Card width percentage
        const cardGap = 10; // Gap between cards as percentage of container
        const translateX = -currentIndex * (cardWidth + cardGap);
        cards.style.transform = `translateX(${translateX}%)`;
        
        // Update button states
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex >= totalCards - 1;
    }
    
    // Next button event
    nextButton.addEventListener('click', () => {
        if (currentIndex < totalCards - 1) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    // Previous button event
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevButton.click();
        } else if (e.key === 'ArrowRight') {
            nextButton.click();
        }
    });
    
    // Touch/swipe support
    let startX = 0;
    let endX = 0;
    
    cards.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    cards.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = startX - endX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe left - go to next
                nextButton.click();
            } else {
                // Swipe right - go to previous
                prevButton.click();
            }
        }
    }
    
    // Mouse wheel support for more scroll sensitivity
    let wheelTimeout;
    cards.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
            if (e.deltaY > 0) {
                nextButton.click();
            } else {
                prevButton.click();
            }
        }, 100);
    });
    
    // Initialize
    updateCarousel();
});