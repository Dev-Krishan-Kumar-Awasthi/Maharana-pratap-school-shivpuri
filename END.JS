document.addEventListener('DOMContentLoaded', function () {
    // 1. Preloader Fade Out
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            setTimeout(() => preloader.style.display = 'none', 500);
        }
    }, 1200);

    // 2. Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        if (cursorDot) {
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
        }

        if (cursorOutline) {
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        }
    });

    // Cursor hover effects on links/buttons
    document.querySelectorAll('a, button, .glass-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursorOutline) {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.backgroundColor = 'rgba(37, 99, 235, 0.1)';
            }
        });
        el.addEventListener('mouseleave', () => {
            if (cursorOutline) {
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.backgroundColor = 'transparent';
            }
        });
    });

    // 3. Scroll Progress Bar & Parallax Hero
    const scrollProgress = document.querySelector('.scroll-progress');
    const heroSlides = document.querySelector('.hero-slides');
    window.addEventListener('scroll', () => {
        const scrollPx = document.documentElement.scrollTop;
        const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollPx / winHeightPx) * 100;
        if (scrollProgress) scrollProgress.style.width = `${scrolled}%`;

        // Parallax Effect
        if (heroSlides && scrollPx < window.innerHeight) {
            heroSlides.style.transform = `translateY(${scrollPx * 0.4}px)`;
        }
    });

    // 4. Dark Mode Theme Switcher
    const themeSwitch = document.getElementById('theme-switch');
    const rootTheme = document.documentElement; // <html>
    if (localStorage.getItem('theme') === 'dark') {
        rootTheme.classList.add('dark-theme');
    }
    if (themeSwitch) {
        themeSwitch.addEventListener('click', () => {
            rootTheme.classList.toggle('dark-theme');
            if (rootTheme.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Sticky header on scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });

    // Smooth scrolling for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Admission form submission logic below

    const admissionForm = document.querySelector('.admission-enquiry form');
    if (admissionForm) {
        admissionForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let isValid = true;

            // Helper function to show/hide error
            const validateField = (id, condition, errorMsg) => {
                const input = document.getElementById(id);
                const group = input.parentElement;
                const errSpan = group.querySelector('.error-msg');
                if (!condition) {
                    group.classList.remove('success');
                    group.classList.add('error');
                    if (errSpan) errSpan.innerText = errorMsg;
                    isValid = false;

                    // Trigger reflow to restart CSS shake animation
                    group.style.animation = 'none';
                    group.offsetHeight;
                    group.style.animation = null;
                } else {
                    group.classList.remove('error');
                    group.classList.add('success');
                    if (errSpan) errSpan.innerText = '';
                }
            };

            const nameVal = document.getElementById('ad-name').value.trim();
            const emailVal = document.getElementById('ad-email').value.trim();
            const fnameVal = document.getElementById('ad-fname').value.trim();
            const classVal = document.getElementById('ad-class').value;
            const numberVal = document.getElementById('ad-number').value.trim();
            const addressVal = document.getElementById('ad-address').value.trim();

            validateField('ad-name', nameVal.length > 2, "Name must be at least 3 characters");
            validateField('ad-email', emailVal === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal), "Invalid Email Format");
            validateField('ad-fname', fnameVal.length > 2, "Father's name is required");
            validateField('ad-class', classVal !== '', "Please select a class");
            validateField('ad-number', /^\d{10}$/.test(numberVal), "Must be exactly 10 digits");
            validateField('ad-address', addressVal.length > 5, "Address must be at least 6 characters");

            if (isValid) {
                // Show floating toast progress indicator
                const toast = document.getElementById('toast');
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
                submitBtn.disabled = true;

                // Send to formspree (Krishan must replace this ID)
                fetch("https://formspree.io/f/mnjbkavn", {
                    method: "POST",
                    body: new FormData(form),
                    headers: {
                        'Accept': 'application/json'
                    }
                }).then(response => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;

                    if (response.ok) {
                        // Remove success validation colors before submitting
                        document.querySelectorAll('.custom-validation').forEach(el => el.classList.remove('success'));

                        if (toast) {
                            toast.querySelector('span').innerText = "Admission application received successfully. We will contact you soon!";
                            toast.classList.add('show');
                            setTimeout(() => toast.classList.remove('show'), 4000);
                        }
                        form.reset();
                    } else {
                        throw new Error('Form submission failed');
                    }
                }).catch(error => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    alert("Oops! There was a problem submitting your form. Please try again or contact us directly.");
                });
            }
        });
    }

    // Contact Form Logic & Validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let isValid = true;

            const validateField = (id, condition, errorMsg) => {
                const input = document.getElementById(id);
                const group = input.parentElement;
                const errSpan = group.querySelector('.error-msg');
                if (!condition) {
                    group.classList.remove('success');
                    group.classList.add('error');
                    if (errSpan) errSpan.innerText = errorMsg;
                    isValid = false;

                    group.style.animation = 'none';
                    group.offsetHeight;
                    group.style.animation = null;
                } else {
                    group.classList.remove('error');
                    group.classList.add('success');
                    if (errSpan) errSpan.innerText = '';
                }
            };

            const nameVal = document.getElementById('c-name').value.trim();
            const emailVal = document.getElementById('c-email').value.trim();
            const subjectVal = document.getElementById('c-subject').value.trim();
            const msgVal = document.getElementById('c-message').value.trim();

            validateField('c-name', nameVal.length > 2, "Name must be at least 3 characters");
            validateField('c-email', emailVal === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal), "Invalid Email Format");
            validateField('c-subject', subjectVal.length > 2, "Subject is required");
            validateField('c-message', msgVal.length > 10, "Message must be at least 10 characters");

            if (isValid) {
                const toast = document.getElementById('toast');
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
                submitBtn.disabled = true;

                // Send to formspree
                fetch("https://formspree.io/f/mnjbkavn", {
                    method: "POST",
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                }).then(response => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;

                    if (response.ok) {
                        document.querySelectorAll('.custom-validation').forEach(el => el.classList.remove('success'));
                        if (toast) {
                            toast.querySelector('span').innerText = "Message sent successfully! We will get back to you.";
                            toast.classList.add('show');
                            setTimeout(() => toast.classList.remove('show'), 4000);
                        }
                        contactForm.reset();
                    } else {
                        throw new Error('Form submission failed');
                    }
                }).catch(error => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    alert("Oops! There was a problem submitting your message. Please try again.");
                });
            }
        });
    }

    // 4. Advanced Number Counting Animation (Intersection Observer)
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower

    const startCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 15);
                    } else {
                        counter.innerText = target + (counter.getAttribute('data-target') > 100 ? '+' : '%');
                        if (target === 25) counter.innerText = "25+";
                        if (target === 50) counter.innerText = "50+";
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    };

    const counterObserver = new IntersectionObserver(startCounters, { threshold: 0.5 });
    counters.forEach(counter => counterObserver.observe(counter));

    // 5. Staggered Fade-Up Animations (Intersection Observer)
    const fadeElements = document.querySelectorAll('.about-content, .facility-card, .gallery-item, .testimonial, .contact-content, .stat-box, .developer-container');

    // Set initial state
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100); // Staggering effect
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // Initialize particles.js for the animated background
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 60,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"]
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    }
                },
                "opacity": {
                    "value": 0.4,
                    "random": false,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 4,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 2,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#3b82f6",
                    "opacity": 0.2,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "push": {
                        "particles_nb": 4
                    }
                }
            },
            "retina_detect": true
        });
    }

    // 7. Scroll-Spy: Auto-highlight active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-links a');

    function scrollSpy() {
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinksAll.forEach(link => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', scrollSpy);

    // 8. Event Countdown Timer
    function startCountdown() {
        // Set your target event date here (Year, Month-1, Day, Hour, Min, Sec)
        const eventDate = new Date('2026-04-01T08:00:00').getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = eventDate - now;

            if (distance < 0) {
                clearInterval(timer);
                document.getElementById('cd-days').innerText = '00';
                document.getElementById('cd-hours').innerText = '00';
                document.getElementById('cd-minutes').innerText = '00';
                document.getElementById('cd-seconds').innerText = '00';
                document.querySelector('.countdown-event-name').innerText = 'Event has started!';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('cd-days').innerText = String(days).padStart(2, '0');
            document.getElementById('cd-hours').innerText = String(hours).padStart(2, '0');
            document.getElementById('cd-minutes').innerText = String(minutes).padStart(2, '0');
            document.getElementById('cd-seconds').innerText = String(seconds).padStart(2, '0');
        }, 1000);
    }
    startCountdown();

});
