/* =============================================
   CONSTRUCTION 4 FRÈRES - JAVASCRIPT PRINCIPAL
============================================= */

// ===== INITIALISATION AOS (ANIMATIONS) =====
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // ===== GESTION DU MENU MOBILE =====
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Fermer le menu quand on clique sur un lien
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // ===== GESTION DES COOKIES =====
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptBtn = document.getElementById('acceptCookies');
    const declineBtn = document.getElementById('declineCookies');

    // Vérifier si l'utilisateur a déjà accepté/refusé
    if (!localStorage.getItem('cookieConsent')) {
        cookieConsent.classList.add('show');
    }

    // Accepter les cookies
    acceptBtn.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieConsent.classList.remove('show');
        console.log('Cookies acceptés');
    });

    // Refuser les cookies
    declineBtn.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'declined');
        cookieConsent.classList.remove('show');
        console.log('Cookies refusés');
    });

    // ===== SMOOTH SCROLL POUR LES ANCRES =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ===== NAVBAR SCROLL EFFECT =====
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }

        lastScroll = currentScroll;
    });
});

// ===== FORMULAIRE DE CONTACT (pour emplois.html) =====
function handleContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validation basique
    const nom = formData.get('nom');
    const email = formData.get('email');
    const telephone = formData.get('telephone');
    const message = formData.get('message');
    
    if (!nom || !email || !telephone) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return false;
    }
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Veuillez entrer une adresse email valide.');
        return false;
    }
    
    // Si tout est bon, le formulaire se soumet
    alert('Merci! Votre candidature a été envoyée. Nous vous contacterons bientôt.');
    form.reset();
    
    return true;
}
