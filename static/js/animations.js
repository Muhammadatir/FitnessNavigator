// Scroll animations

document.addEventListener('DOMContentLoaded', function() {
    // Define elements to animate
    const fadeElements = document.querySelectorAll('.fade-in');
    const slideLeftElements = document.querySelectorAll('.slide-in-left');
    const slideRightElements = document.querySelectorAll('.slide-in-right');
    const zoomElements = document.querySelectorAll('.zoom-in');
    
    // Common observer options
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // Single Intersection Observer for all animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add special effects for certain elements
                if (entry.target.classList.contains('feature-icon')) {
                    entry.target.classList.add('pulse');
                }
                if (entry.target.classList.contains('card')) {
                    entry.target.classList.add('card-hover-ready');
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements that should be animated
    [...fadeElements, ...slideLeftElements, ...slideRightElements, ...zoomElements].forEach(element => {
        observer.observe(element);
    });
    
    // Enhanced animations for interactive elements
    
    // Tab animations in workout plan
    const tabButtons = document.querySelectorAll('.nav-tabs .nav-link');
    tabButtons.forEach((button, index) => {
        button.style.animationDelay = `${index * 0.1}s`;
        button.classList.add('tab-animate');
    });
    
    // Staggered list animations
    document.querySelectorAll('.list-group').forEach(list => {
        list.querySelectorAll('.list-group-item').forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('list-animate');
        });
    });
    
    // Card hover effects
    document.querySelectorAll('.card.card-hover-ready').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('card-hover-active');
        });
        card.addEventListener('mouseleave', function() {
            this.classList.remove('card-hover-active');
        });
    });
    
    // Accordion animations
    document.querySelectorAll('.accordion-button').forEach(button => {
        button.addEventListener('click', function() {
            const content = this.nextElementSibling;
            if (!this.classList.contains('collapsed')) {
                content.classList.add('accordion-animate');
            }
        });
    });
    
    // Number counter animation
    function animateNumber(element, start, end, duration) {
        if (start === end) return;
        const range = end - start;
        let current = start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        const timer = setInterval(() => {
            current += increment;
            element.textContent = current;
            if (current === end) {
                clearInterval(timer);
            }
        }, stepTime);
    }
    
    // Animate numbers in stats
    document.querySelectorAll('.number-animate').forEach(element => {
        const finalValue = parseInt(element.getAttribute('data-value'));
        if (!isNaN(finalValue)) {
            animateNumber(element, 0, finalValue, 1000);
        }
    });
    
    // Animate BMI number
    const bmiElements = document.querySelectorAll('.number-animate');
    
    bmiElements.forEach(element => {
        const finalValue = parseFloat(element.dataset.value);
        let startValue = 0;
        const duration = 1500;
        const increment = finalValue / (duration / 16); // 60fps
        
        function updateNumber() {
            startValue += increment;
            if (startValue < finalValue) {
                element.textContent = startValue.toFixed(1);
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = finalValue.toFixed(1);
            }
        }
        
        // Start animation when element comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateNumber();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(element);
    });
});
