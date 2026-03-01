// Load YouTube Player API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Initialize YouTube players when API is ready
function onYouTubeIframeAPIReady() {
    // Find all exercise video iframes
    const videoIframes = document.querySelectorAll('.exercise-video iframe');
    
    videoIframes.forEach((iframe, index) => {
        // Create a unique ID for each iframe
        iframe.id = 'exercise-video-' + index;
        
        // Initialize player
        new YT.Player('exercise-video-' + index, {
            events: {
                'onReady': function(event) {
                    // Video is ready to play
                    console.log('Video ready:', iframe.id);
                },
                'onError': function(event) {
                    // Handle video loading errors
                    console.error('Video error:', event.data);
                    const videoContainer = iframe.closest('.exercise-video');
                    if (videoContainer) {
                        videoContainer.innerHTML = `
                            <div class="video-error p-4 text-center">
                                <i class="fas fa-exclamation-circle text-warning mb-2" style="font-size: 2rem;"></i>
                                <p class="mb-0">Video unavailable. Please try again later.</p>
                            </div>
                        `;
                    }
                }
            }
        });
    });
}

// Add video loading states
document.addEventListener('DOMContentLoaded', function() {
    const videoContainers = document.querySelectorAll('.exercise-video');
    
    videoContainers.forEach(container => {
        // Add loading state
        container.classList.add('loading');
        
        // Listen for iframe load
        const iframe = container.querySelector('iframe');
        if (iframe) {
            iframe.addEventListener('load', function() {
                container.classList.remove('loading');
            });
        }
    });
});
