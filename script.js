// --- Dark Mode Toggle ---
const html = document.documentElement;

// Function to update icon based on theme
function updateIcons(isDark) {
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        if (isDark) {
            btn.innerHTML = '<i class="fa-solid fa-sun text-yellow-500 text-xl"></i>';
        } else {
            btn.innerHTML = '<i class="fa-solid fa-moon text-gray-700 dark:text-gray-200 text-xl"></i>';
        }
    });
}

// Check local storage for theme preference
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
    updateIcons(true);
} else {
    html.classList.remove('dark');
    updateIcons(false);
}

document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
            updateIcons(false);
        } else {
            html.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
            updateIcons(true);
        }
    });
});

// --- Mobile Menu Toggle ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Hide mobile menu on link click
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// --- Sticky Navbar & Back to Top ---
const header = document.getElementById('header');
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('shadow-md', 'glass');
        header.classList.remove('bg-transparent', 'border-transparent', 'text-white');
        header.classList.add('text-gray-900', 'dark:text-white', 'border-gray-100', 'dark:border-gray-800');
        // Ensure nav links change color
        document.querySelectorAll('#header nav a').forEach(a => {
            if(!a.classList.contains('bg-primary')) {
                a.classList.replace('text-white', 'text-gray-800');
                a.classList.replace('dark:text-white', 'dark:text-gray-200');
            }
        });
        document.querySelector('#header h1 a, #header .flex-shrink-0 a').classList.remove('text-white');
        
        backToTopBtn.classList.remove('hidden');
        backToTopBtn.classList.add('flex');
    } else {
        header.classList.remove('shadow-md', 'glass', 'text-gray-900', 'dark:text-white', 'border-gray-100', 'dark:border-gray-800');
        header.classList.add('bg-transparent', 'border-transparent', 'text-white');
        // Revert nav links color
        document.querySelectorAll('#header nav a').forEach(a => {
            if(!a.classList.contains('bg-primary')) {
                a.classList.replace('text-gray-800', 'text-white');
                a.classList.replace('dark:text-gray-200', 'dark:text-white');
            }
        });
        document.querySelector('#header .flex-shrink-0 a').classList.add('text-white');

        backToTopBtn.classList.remove('flex');
        backToTopBtn.classList.add('hidden');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- Hero Slider ---
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
if(slides.length > 0) {
    const nextSlide = () => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    };
    setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

// --- Lightbox ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightboxBtn = document.querySelector('.lightbox-close');

function openLightbox(src) {
    lightbox.classList.add('show');
    lightboxImg.src = src;
    document.body.style.overflow = 'hidden'; // prevent background scrolling
}

function closeLightbox() {
    lightbox.classList.remove('show');
    setTimeout(() => {
        lightboxImg.src = '';
    }, 300);
    document.body.style.overflow = 'auto'; // restore scrolling
}

if(closeLightboxBtn) {
    closeLightboxBtn.addEventListener('click', closeLightbox);
}
if(lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) closeLightbox();
    });
}
// Listeners for images added after DOM load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.gallery-img').forEach(img => {
        img.addEventListener('click', () => {
            openLightbox(img.src);
        });
    });
});

// --- Form Submission ---
const form = document.getElementById('booking-form');
const formStatus = document.getElementById('form-status');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Sending...';
        submitBtn.disabled = true;

        const formData = new FormData(form);

        try {
            const response = await fetch('send_mail.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.status === 'success') {
                formStatus.innerHTML = `<div class="p-4 mb-6 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">${result.message}</div>`;
                form.reset();
            } else {
                formStatus.innerHTML = `<div class="p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">${result.message}</div>`;
            }
        } catch (error) {
            formStatus.innerHTML = `<div class="p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">An error occurred. Please try again.</div>`;
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            
            // hide status after some time
            setTimeout(() => {
                formStatus.innerHTML = '';
            }, 5000);
        }
    });
}
