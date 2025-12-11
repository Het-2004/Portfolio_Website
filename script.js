// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Get the current year for the footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ========== MOBILE MENU ==========
    let isMobileMenuOpen = false;

    function toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        
        if (!mobileMenu || !mobileMenuOverlay) {
            console.error('Mobile menu elements not found!');
            return;
        }
        
        isMobileMenuOpen = !isMobileMenuOpen;
        console.log('Toggling menu. Open:', isMobileMenuOpen);
        
        if (isMobileMenuOpen) {
            // Open menu
            mobileMenu.classList.remove('translate-x-full');
            mobileMenu.classList.add('translate-x-0');
            mobileMenuOverlay.classList.remove('opacity-0', 'pointer-events-none');
            mobileMenuOverlay.classList.add('opacity-100');
            document.body.style.overflow = 'hidden';
        } else {
            // Close menu
            mobileMenu.classList.add('translate-x-full');
            mobileMenu.classList.remove('translate-x-0');
            mobileMenuOverlay.classList.add('opacity-0', 'pointer-events-none');
            mobileMenuOverlay.classList.remove('opacity-100');
            document.body.style.overflow = '';
        }
    }

    // Mobile menu initialization
    const mobileLogoTrigger = document.getElementById('mobile-logo-trigger');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    
    console.log('Mobile menu init:', {
        logo: !!mobileLogoTrigger,
        overlay: !!mobileMenuOverlay,
        items: mobileNavItems.length
    });
    
    // Logo button click handler
    if (mobileLogoTrigger) {
        mobileLogoTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Logo clicked!');
            toggleMobileMenu();
        });
        console.log('Logo click listener attached');
    }
    
    // Overlay click to close
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', function() {
            if (isMobileMenuOpen) {
                toggleMobileMenu();
            }
        });
    }
    
    // Menu items click handlers
    mobileNavItems.forEach((item) => {
        item.addEventListener('click', function(event) {
            const sectionId = event.currentTarget.dataset.sectionId;
            console.log('Menu item clicked:', sectionId);
            
            if (isMobileMenuOpen) {
                toggleMobileMenu();
            }
            
            setTimeout(() => {
                const section = document.getElementById(sectionId);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
        });
    });
    
    // Escape key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMobileMenuOpen) {
            toggleMobileMenu();
        }
    });

    // ========== STATISTICS COUNTER ==========

    // Statistics Counter Animation
    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('[data-count]');
                counters.forEach(counter => {
                    if (counter.textContent === '0') {
                        animateCounter(counter);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const statsSection = document.getElementById('statistics');
    if (statsSection) {
        statsObserver.observe(statsSection);
        
        // Check if statistics section is already in view on page load
        setTimeout(() => {
            const rect = statsSection.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom >= 0;
            if (isInView) {
                const counters = statsSection.querySelectorAll('[data-count]');
                counters.forEach(counter => animateCounter(counter));
            }
        }, 100);
    }

    // Observe all project cards for animation
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        projectCardObserver.observe(card);
    });

    // Add slide-down-fade-in animation to the nav bar on load
    const mainNav = document.getElementById('main-nav');
    if (mainNav) {
        mainNav.classList.add('nav-slide-in');
    }
    updateActiveNavItem(); // Initial call to set active nav item on page load
});

// Scroll Progress Indicator
const scrollProgress = document.getElementById('scroll-progress');
if (scrollProgress) {
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.width = scrollPercentage + '%';
    });
}

// Scroll to Top Button
const scrollToTopBtn = document.getElementById('scroll-to-top');
if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
            scrollToTopBtn.classList.add('opacity-100');
        } else {
            scrollToTopBtn.classList.add('opacity-0', 'pointer-events-none');
            scrollToTopBtn.classList.remove('opacity-100');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    let isDark = false;
    themeToggle.addEventListener('click', () => {
        isDark = !isDark;
        document.body.classList.toggle('dark-mode');
        
        const icon = themeToggle.querySelector('i');
        if (isDark) {
            icon.setAttribute('data-lucide', 'moon');
        } else {
            icon.setAttribute('data-lucide', 'sun');
        }
        lucide.createIcons();
    });
}

// Download Resume Handler
const downloadResumeBtn = document.getElementById('download-resume');
if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Use the actual resume file in your folder
        const resumePath = 'Het_resume.pdf';
        
        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = resumePath;
        link.download = 'Het_Solanki_Resume.pdf';
        link.target = '_blank';
        
        // Try to download, show message if file doesn't exist
        fetch(resumePath, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    // File exists, download it
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    // File doesn't exist, show message
                    showResumeMessage();
                }
            })
            .catch(() => {
                // Error or file doesn't exist, show message
                showResumeMessage();
            });
    });
}

function showResumeMessage() {
    const messageBox = document.createElement('div');
    messageBox.className = 'fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-[9999]';
    messageBox.innerHTML = `
        <div class="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl text-center max-w-sm mx-4">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i data-lucide="file-text" class="w-8 h-8 text-white"></i>
            </div>
            <h3 class="text-2xl font-bold text-slate-100 mb-3">Resume Coming Soon</h3>
            <p class="text-slate-400 mb-6">Please add your resume file (Het_Solanki_Resume.pdf) to enable download functionality.</p>
            <button id="closeResumeBox" class="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105">
                Got it
            </button>
        </div>
    `;
    document.body.appendChild(messageBox);
    lucide.createIcons();
    
    document.getElementById('closeResumeBox').addEventListener('click', () => {
        document.body.removeChild(messageBox);
    });
    
    // Close on background click
    messageBox.addEventListener('click', (e) => {
        if (e.target === messageBox) {
            document.body.removeChild(messageBox);
        }
    });
}

// Smooth scrolling and active navigation state
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('main section');

// Function to update active navigation item
const updateActiveNavItem = () => {
    let currentActiveSection = 'home';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
            currentActiveSection = section.id;
        }
    });

    navItems.forEach(item => {
        item.classList.remove('text-cyan-400', 'font-semibold');
        item.classList.add('text-slate-300');
        if (item.dataset.sectionId === currentActiveSection) {
            item.classList.add('text-cyan-400', 'font-semibold');
            item.classList.remove('text-slate-300');
        }
    });
};

// Event listener for navigation item clicks
navItems.forEach(item => {
    item.addEventListener('click', (event) => {
        const sectionId = event.currentTarget.dataset.sectionId;
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Intersection Observer for fade-in animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Add 'animate-fade-in' class to all sections and observe them
sections.forEach(section => {
    section.classList.add('animate-fade-in');
    observer.observe(section);
});

// Project cards animation observer
const projectCardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            projectCardObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
});

// Add scroll event listener for navigation updates
window.addEventListener('scroll', updateActiveNavItem);

// Add ripple effect to navigation items
navItems.forEach(item => {
    item.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add hover effect with magnetic pull for buttons
document.querySelectorAll('.magnetic').forEach(element => {
    element.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = 'translate(0, 0)';
    });
});

// Contact section uses direct links - no form handling needed

// Particle Animation System
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = (Math.random() - 0.5) * 1.2;
        this.color = this.getRandomColor();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        
        // Random particle type - stars, planets, or regular
        const particleType = Math.random();
        
        if (particleType > 0.95) {
            // 5% Special celestial bodies (planets/nebula)
            this.size = Math.random() * 6 + 3;
            this.opacity = Math.random() * 0.4 + 0.5;
            this.isCelestial = true;
            this.celestialColor = this.getCelestialColor();
        } else if (particleType > 0.85) {
            // 10% Bright stars
            this.size = Math.random() * 2 + 2;
            this.opacity = Math.random() * 0.3 + 0.7;
            this.isStar = true;
            this.twinkleSpeed = Math.random() * 0.02 + 0.01;
            this.twinklePhase = Math.random() * Math.PI * 2;
        } else if (particleType > 0.4) {
            // 45% Medium stars
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.3 + 0.4;
            this.isStar = particleType > 0.6;
            this.twinkleSpeed = Math.random() * 0.015 + 0.005;
            this.twinklePhase = Math.random() * Math.PI * 2;
        } else {
            // 40% Dim distant stars
            this.size = Math.random() * 1.5 + 0.5;
            this.opacity = Math.random() * 0.3 + 0.1;
            this.isStar = true;
            this.twinkleSpeed = Math.random() * 0.01 + 0.003;
            this.twinklePhase = Math.random() * Math.PI * 2;
        }
        
        this.baseOpacity = this.opacity;
    }

    getCelestialColor() {
        const colors = [
            'rgba(100, 149, 237, ',  // Cornflower blue - like Neptune
            'rgba(255, 140, 0, ',     // Dark orange - like Mars
            'rgba(238, 232, 170, ',   // Pale golden - like Saturn
            'rgba(135, 206, 250, ',   // Sky blue - like Uranus
            'rgba(255, 192, 203, ',   // Pink - nebula
            'rgba(147, 112, 219, '    // Medium purple - nebula
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    getRandomColor() {
        return 'rgba(255, 255, 255, ';  // white only
    }

    update(mouseX, mouseY) {
        // Mouse interaction - particles move away from cursor
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;

        if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            const angle = Math.atan2(dy, dx);
            this.vx += Math.cos(angle) * force * 0.4;
            this.vy += Math.sin(angle) * force * 0.4;
        }

        // Apply velocity
        this.x += this.vx;
        this.y += this.vy;

        // Damping
        this.vx *= 0.98;
        this.vy *= 0.98;

        // Bounce off edges
        if (this.x < 0 || this.x > this.canvas.width) {
            this.vx *= -1;
            this.x = Math.max(0, Math.min(this.canvas.width, this.x));
        }
        if (this.y < 0 || this.y > this.canvas.height) {
            this.vy *= -1;
            this.y = Math.max(0, Math.min(this.canvas.height, this.y));
        }
    }

    draw(ctx) {
        ctx.save();
        
        // Twinkling effect for stars
        if (this.isStar) {
            this.twinklePhase += this.twinkleSpeed;
            const twinkleFactor = Math.sin(this.twinklePhase) * 0.3 + 1;
            this.opacity = this.baseOpacity * twinkleFactor;
            this.opacity = Math.max(0.1, Math.min(1, this.opacity));
        }
        
        if (this.isCelestial) {
            // Special celestial bodies with colored glow
            ctx.fillStyle = this.celestialColor + this.opacity + ')';
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.celestialColor + '0.8)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Add bright center
            ctx.shadowBlur = 10;
            ctx.fillStyle = 'rgba(255, 255, 255, ' + this.opacity + ')';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 0.4, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Regular stars with white glow
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.shadowBlur = this.opacity > 0.7 ? 8 : this.opacity > 0.4 ? 5 : 3;
            ctx.shadowColor = 'rgba(255, 255, 255, ' + this.opacity + ')';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Add star flare for bright stars
            if (this.opacity > 0.7) {
                ctx.strokeStyle = 'rgba(255, 255, 255, ' + (this.opacity * 0.3) + ')';
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(this.x - this.size * 2, this.y);
                ctx.lineTo(this.x + this.size * 2, this.y);
                ctx.moveTo(this.x, this.y - this.size * 2);
                ctx.lineTo(this.x, this.y + this.size * 2);
                ctx.stroke();
            }
        }
        
        ctx.restore();
    }
}

// Initialize particle system
const particleCanvas = document.getElementById('particle-canvas');
if (particleCanvas) {
    const ctx = particleCanvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    let animationFrameId;

    function resizeCanvas() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }

    function initParticles() {
        particles = [];
        const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 8000);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(particleCanvas));
        }
    }

    function animate() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

        // Update and draw particles
        particles.forEach(particle => {
            particle.update(mouseX, mouseY);
            particle.draw(ctx);
        });

        // Draw connections between nearby particles
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.globalAlpha = (150 - distance) / 150 * 0.4;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    // Mouse move event
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Touch move event for mobile
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
        }
    });

    // Resize event
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    // Initialize
    resizeCanvas();
    initParticles();
    animate();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });
}
