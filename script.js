// Initialize Lucide icons
lucide.createIcons();

// Get the current year for the footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Smooth scrolling and active navigation state
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('main section');

// Function to update active navigation item
const updateActiveNavItem = () => {
    let currentActiveSection = 'home';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100; // Adjust for fixed nav height
        const sectionBottom = sectionTop + section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
            currentActiveSection = section.id;
        }
    });

    navItems.forEach(item => {
        item.classList.remove('text-purple-600', 'bg-purple-50', 'shadow-inner', 'active-nav');
        item.classList.add('text-gray-600', 'hover:text-purple-600', 'hover:bg-gray-100');
        if (item.dataset.sectionId === currentActiveSection) {
            item.classList.add('text-purple-600', 'bg-purple-50', 'shadow-inner', 'active-nav');
            item.classList.remove('text-gray-600', 'hover:text-purple-600', 'hover:bg-gray-100');
        }
    });
};

// Event listener for navigation item clicks
navItems.forEach(item => {
    item.addEventListener('click', (event) => {
        const sectionId = event.currentTarget.dataset.sectionId;
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Intersection Observer for fade-in animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Stop observing once visible to prevent re-triggering
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1, // Trigger when 10% of the section is visible
    rootMargin: '0px 0px -50px 0px' // Adjust to trigger slightly before reaching the bottom
});

// Add 'animate-fade-in' class to all sections and observe them
sections.forEach(section => {
    section.classList.add('animate-fade-in');
    observer.observe(section);
});

// Add slide-down-fade-in animation to the nav bar on load
document.addEventListener('DOMContentLoaded', () => {
    const mainNav = document.getElementById('main-nav');
    mainNav.classList.add('nav-slide-in');
    updateActiveNavItem(); // Initial call to set active nav item on page load
});

// Add scroll event listener for navigation updates
window.addEventListener('scroll', updateActiveNavItem);

// Basic form submission handling (for demonstration)
const contactForm = document.querySelector('#contact form');
if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission
        // In a real application, you would send this data to a backend server
        console.log('Form submitted!');
        console.log('Name:', document.getElementById('name').value);
        console.log('Email:', document.getElementById('email').value);
        console.log('Message:', document.getElementById('message').value);

        // You could add a success message or clear the form here
        // Using a custom modal for alert as per instructions
        const messageBox = document.createElement('div');
        messageBox.className = 'fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-[9999]';
        messageBox.innerHTML = `
            <div class="bg-white p-8 rounded-lg shadow-xl text-center max-w-sm mx-4">
                <h3 class="text-xl font-bold text-gray-900 mb-4">Message Sent!</h3>
                <p class="text-gray-700 mb-6">Thank you for your message! I will get back to you soon.</p>
                <button id="closeMessageBox" class="bg-purple-600 text-white py-2 px-5 rounded-md font-semibold hover:bg-purple-700 transition duration-300">Close</button>
            </div>
        `;
        document.body.appendChild(messageBox);

        document.getElementById('closeMessageBox').addEventListener('click', () => {
            document.body.removeChild(messageBox);
        });

        contactForm.reset(); // Clear the form fields
    });
}
