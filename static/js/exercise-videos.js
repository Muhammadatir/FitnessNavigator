// Handle video initialization
document.addEventListener('DOMContentLoaded', function() {
    // Function to handle video loading errors
    function handleVideoError(iframe) {
        const container = iframe.closest('.exercise-video');
        if (container) {
            container.innerHTML = `
                <div class="video-error alert alert-warning">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Video is currently unavailable. Please try refreshing the page or check your internet connection.</p>
                    <a href="${iframe.src}" target="_blank" class="btn btn-sm btn-primary mt-2">
                        Watch on YouTube
                    </a>
                </div>
            `;
        }
    }

    // Add error handlers to all video iframes
    const videoIframes = document.querySelectorAll('.exercise-video iframe');
    videoIframes.forEach(iframe => {
        // Add loading indicator
        const container = iframe.closest('.exercise-video');
        if (container) {
            container.classList.add('loading');
        }

        // Handle successful load
        iframe.addEventListener('load', function() {
            if (container) {
                container.classList.remove('loading');
            }
        });

        // Handle errors
        iframe.addEventListener('error', function() {
            handleVideoError(this);
        });
    });
});
