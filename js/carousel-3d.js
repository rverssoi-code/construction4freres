/**
 * CAROUSEL 3D - Construction 4 Frères
 * Fichier JavaScript séparé pour le slideshow 3D
 * Supporte: Navigation par flèches, swipe mobile, indicateurs
 */

class Carousel3D {
    constructor(selector, options = {}) {
        this.container = document.querySelector(selector);
        if (!this.container) return;

        // Options par défaut
        this.options = {
            autoPlay: options.autoPlay || false,
            autoPlayDelay: options.autoPlayDelay || 5000,
            enableSwipe: options.enableSwipe !== false,
            visibleCards: options.visibleCards || 3, // 3 cards de chaque côté + 1 au centre = 7 total
            cardSpacing: options.cardSpacing || 180, // Distance entre les cartes
            ...options
        };

        this.currentIndex = 0;
        this.totalCards = 0;
        this.cards = [];
        this.autoPlayInterval = null;
        this.touchStartX = 0;
        this.touchEndX = 0;

        this.init();
    }

    init() {
        this.cards = Array.from(this.container.querySelectorAll('.carousel-card'));
        this.totalCards = this.cards.length;

        if (this.totalCards === 0) {
            console.warn('Aucune carte trouvée dans le carousel');
            return;
        }

        this.setupCards();
        this.setupNavigation();
        this.setupIndicators();
        this.setupCounter();
        this.setupSwipe();
        this.updateCarousel();

        if (this.options.autoPlay) {
            this.startAutoPlay();
        }
    }

    setupCards() {
        this.cards.forEach((card, index) => {
            card.dataset.index = index;
            card.addEventListener('click', () => {
                const clickedIndex = parseInt(card.dataset.index);
                if (clickedIndex !== this.currentIndex) {
                    this.goToSlide(clickedIndex);
                }
            });
        });
    }

    setupNavigation() {
        const prevBtn = this.container.closest('.carousel-3d-section').querySelector('.carousel-nav.prev');
        const nextBtn = this.container.closest('.carousel-3d-section').querySelector('.carousel-nav.next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prev());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.next());
        }

        // Navigation au clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
    }

    setupIndicators() {
        const indicatorsContainer = this.container.closest('.carousel-3d-section').querySelector('.carousel-indicators');
        if (!indicatorsContainer) return;

        indicatorsContainer.innerHTML = '';
        
        for (let i = 0; i < this.totalCards; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'carousel-indicator';
            indicator.dataset.index = i;
            indicator.addEventListener('click', () => this.goToSlide(i));
            indicatorsContainer.appendChild(indicator);
        }
    }

    setupCounter() {
        const counter = this.container.closest('.carousel-3d-section').querySelector('.carousel-counter');
        if (counter) {
            this.updateCounter();
        }
    }

    setupSwipe() {
        if (!this.options.enableSwipe) return;

        const wrapper = this.container.closest('.carousel-3d-wrapper');

        wrapper.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
            wrapper.classList.add('grabbing');
        }, { passive: true });

        wrapper.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            wrapper.classList.remove('grabbing');
            this.handleSwipe();
        }, { passive: true });

        // Desktop drag support
        let isDragging = false;
        let startX = 0;

        wrapper.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            wrapper.classList.add('grabbing');
        });

        wrapper.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });

        wrapper.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            wrapper.classList.remove('grabbing');
            
            const endX = e.clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        });

        wrapper.addEventListener('mouseleave', () => {
            isDragging = false;
            wrapper.classList.remove('grabbing');
        });
    }

    handleSwipe() {
        const diff = this.touchStartX - this.touchEndX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
    }

    updateCarousel() {
        this.cards.forEach((card, index) => {
            const position = this.getCardPosition(index);
            this.applyCardTransform(card, position);
            
            // Active state
            if (index === this.currentIndex) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        this.updateIndicators();
        this.updateCounter();
    }

    getCardPosition(index) {
        const diff = index - this.currentIndex;
        const totalCards = this.totalCards;

        // Gérer le wrap-around circulaire
        let position = diff;
        if (Math.abs(diff) > totalCards / 2) {
            position = diff > 0 ? diff - totalCards : diff + totalCards;
        }

        return position;
    }

    applyCardTransform(card, position) {
        const angle = position * 15; // Angle de rotation
        const translateZ = position === 0 ? 0 : -200; // Profondeur
        const translateX = position * this.options.cardSpacing; // Espacement horizontal
        const scale = position === 0 ? 1 : 0.8; // Échelle

        card.style.transform = `
            translate(-50%, -50%)
            translateX(${translateX}px)
            translateZ(${translateZ}px)
            rotateY(${angle}deg)
            scale(${scale})
        `;

        // Visibilité des cartes
        if (Math.abs(position) > this.options.visibleCards) {
            card.style.opacity = '0';
            card.style.pointerEvents = 'none';
        } else {
            card.style.opacity = position === 0 ? '1' : '0.6';
            card.style.pointerEvents = 'auto';
        }
    }

    updateIndicators() {
        const indicators = this.container.closest('.carousel-3d-section').querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            if (index === this.currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    updateCounter() {
        const counter = this.container.closest('.carousel-3d-section').querySelector('.carousel-counter');
        if (!counter) return;

        const current = counter.querySelector('.current');
        const total = counter.querySelector('.total');

        if (current) current.textContent = this.currentIndex + 1;
        if (total) total.textContent = this.totalCards;
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.totalCards;
        this.updateCarousel();
        this.resetAutoPlay();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.totalCards) % this.totalCards;
        this.updateCarousel();
        this.resetAutoPlay();
    }

    goToSlide(index) {
        if (index >= 0 && index < this.totalCards) {
            this.currentIndex = index;
            this.updateCarousel();
            this.resetAutoPlay();
        }
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, this.options.autoPlayDelay);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resetAutoPlay() {
        if (this.options.autoPlay) {
            this.stopAutoPlay();
            this.startAutoPlay();
        }
    }

    destroy() {
        this.stopAutoPlay();
        // Cleanup event listeners if needed
    }
}

// Initialisation automatique quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    const carousel = new Carousel3D('.carousel-3d', {
        autoPlay: true,          // Change à true si tu veux l'auto-play
        autoPlayDelay: 2000,      // 5 secondes entre chaque slide
        enableSwipe: true,        // Support tactile
        visibleCards: 3,          // 3 cartes de chaque côté
        cardSpacing: 180          // Distance entre les cartes
    });
});
