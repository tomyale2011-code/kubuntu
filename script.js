// ============================
// script.js - Interactividad para sitio Kubuntu
// ============================

// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    // Elementos
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.querySelector('.theme-icon');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const backToTop = document.getElementById('backToTop');
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const modalClose = document.querySelector('.modal-close');

    // ============================
    // MODO OSCURO/CLARO
    // ============================
    // Guardamos el tema en localStorage. Si el navegador lo bloquea
    // (por ejemplo, con la prevención de rastreo activada) seguimos
    // funcionando con el tema claro por defecto.
    function leerTemaGuardado() {
        try {
            return localStorage.getItem('theme');
        } catch (error) {
            return null;
        }
    }

    function guardarTema(tema) {
        try {
            localStorage.setItem('theme', tema);
        } catch (error) {
            /* Sin almacenamiento disponible: no pasa nada */
        }
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        themeIcon.textContent = (theme === 'dark') ? '☀️' : '🌙';
    }

    const currentTheme = leerTemaGuardado() || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const newTheme = (current === 'dark') ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            guardarTema(newTheme);
            updateThemeIcon(newTheme);
        });
    }

    // ============================
    // MENÚ RESPONSIVE
    // ============================
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Cerrar menú al hacer clic en enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // ============================
    // BOTÓN VOLVER ARRIBA
    // ============================
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ============================
    // SCROLL SUAVE Y DESTACADO DE ENLACES
    // ============================
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // ============================
    // ANIMACIONES AL APARECER SECCIONES
    // ============================
    // Cada sección empieza oculta (opacity: 0) y se muestra cuando entra
    // en la pantalla. Comprobamos su posición en cada scroll.
    // Usamos esta comprobación manual en lugar de IntersectionObserver
    // porque funciona igualmente en todos los navegadores y es fácil
    // de entender.
    function mostrarSeccionesVisibles() {
        const alto = window.innerHeight;

        sections.forEach(section => {
            if (section.classList.contains('visible')) return;

            const caja = section.getBoundingClientRect();

            // Si la sección ya está dentro de la ventana, la mostramos.
            if (caja.top < alto * 0.9 && caja.bottom > 0) {
                section.classList.add('visible');
            }
        });
    }

    sections.forEach(section => section.classList.add('fade-in'));
    mostrarSeccionesVisibles();
    window.addEventListener('scroll', mostrarSeccionesVisibles);
    window.addEventListener('resize', mostrarSeccionesVisibles);

    // ============================
    // MODAL PARA IMÁGENES
    // ============================
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            modalImage.src = item.getAttribute('data-src');
            modalImage.alt = item.getAttribute('data-alt');

            const caption = item.querySelector('figcaption');
            modalCaption.textContent = caption ? caption.textContent : '';

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Cerrar modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        modalImage.src = '';
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // ============================
    // SIN ERRORES EN CONSOLA
    // ============================
    console.log('Kubuntu - Sitio web cargado correctamente');
});