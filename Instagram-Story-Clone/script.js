/**
 * Instagram Story Clone - Client Side Logic
 * Handles: Persistence, Expiration, UI Rendering, and Story Viewing.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Core Elements
    const storyUpload = document.getElementById('story-upload');
    const storiesList = document.getElementById('stories-list');
    const viewer = document.getElementById('story-viewer');
    const viewerImg = document.getElementById('viewer-img');
    const closeViewer = document.getElementById('close-viewer');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressContainer = document.getElementById('progress-container');
    const viewerTime = document.getElementById('viewer-time');

    // 2. State & Constants
    const STORY_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 Hours
    const STORY_DURATION_MS = 5000; // 5 Seconds per story
    let stories = [];
    let currentStoryIndex = 0;
    let storyTimer = null;
    let progressInterval = null;

    // 3. Persistent Storage Handlers
    const loadStories = () => {
        const stored = localStorage.getItem('insta_stories');
        if (stored) {
            const allStories = JSON.parse(stored);
            const now = Date.now();

            // Filter out expired stories
            stories = allStories.filter(story => (now - story.createdAt) < STORY_EXPIRY_MS);

            // Save cleaned list back if it changed
            if (stories.length !== allStories.length) {
                saveStories();
            }
        }
        renderStories();
    };

    const saveStories = () => {
        localStorage.setItem('insta_stories', JSON.stringify(stories));
    };

    // 4. Rendering logic
    const renderStories = () => {
        // Remove existing dynamic items (keep the 'Add' button)
        const dynamicItems = storiesList.querySelectorAll('.story-item:not(.add-story)');
        dynamicItems.forEach(item => item.remove());

        stories.forEach((story, index) => {
            const storyEl = document.createElement('div');
            storyEl.className = 'story-item';
            storyEl.innerHTML = `
                <div class="story-circle active">
                    <img src="${story.image}" alt="Story">
                </div>
                <span class="story-label">User ${index + 1}</span>
            `;
            storyEl.onclick = () => openViewer(index);
            storiesList.appendChild(storyEl);
        });
    };

    // 5. Upload Handler
    storyUpload.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic Validation
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const newStory = {
                id: Date.now().toString(),
                image: event.target.result, // Base64
                createdAt: Date.now()
            };

            stories.push(newStory);
            saveStories();
            renderStories();
        };
        reader.readAsDataURL(file);
    };

    // 6. Viewer Logic
    const openViewer = (index) => {
        currentStoryIndex = index;
        viewer.hidden = false;
        document.body.style.overflow = 'hidden'; // Prevent scroll
        updateViewer();
    };

    const closeViewerHandler = () => {
        viewer.hidden = true;
        document.body.style.overflow = 'auto';
        clearTimeout(storyTimer);
        clearInterval(progressInterval);
    };

    const updateViewer = () => {
        const story = stories[currentStoryIndex];
        if (!story) {
            closeViewerHandler();
            return;
        }

        viewerImg.src = story.image;

        // Calculate relative time
        const hoursAgo = Math.floor((Date.now() - story.createdAt) / (1000 * 60 * 60));
        viewerTime.textContent = hoursAgo === 0 ? 'Just now' : `${hoursAgo}h ago`;

        setupProgressBars();
        startStoryTimer();
    };

    const setupProgressBars = () => {
        progressContainer.innerHTML = '';
        stories.forEach((_, index) => {
            const segment = document.createElement('div');
            segment.className = 'progress-segment';
            if (index < currentStoryIndex) segment.classList.add('viewed');

            const inner = document.createElement('div');
            inner.className = 'progress-inner';
            if (index === currentStoryIndex) {
                inner.id = 'active-progress';
            }

            segment.appendChild(inner);
            progressContainer.appendChild(segment);
        });
    };

    const startStoryTimer = () => {
        clearTimeout(storyTimer);
        clearInterval(progressInterval);

        let startTime = Date.now();
        const progressInner = document.getElementById('active-progress');

        progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const percentage = Math.min((elapsed / STORY_DURATION_MS) * 100, 100);
            if (progressInner) progressInner.style.width = `${percentage}%`;

            if (elapsed >= STORY_DURATION_MS) {
                clearInterval(progressInterval);
                nextStory();
            }
        }, 30);
    };

    const nextStory = () => {
        if (currentStoryIndex < stories.length - 1) {
            currentStoryIndex++;
            updateViewer();
        } else {
            closeViewerHandler();
        }
    };

    const prevStory = () => {
        if (currentStoryIndex > 0) {
            currentStoryIndex--;
            updateViewer();
        }
    };

    // 7. Navigation & Gestures
    nextBtn.onclick = (e) => { e.stopPropagation(); nextStory(); };
    prevBtn.onclick = (e) => { e.stopPropagation(); prevStory(); };
    closeViewer.onclick = closeViewerHandler;

    // Basic Swipe Support
    let touchStartX = 0;
    viewer.ontouchstart = (e) => touchStartX = e.touches[0].clientX;
    viewer.ontouchend = (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) { // Threshold
            if (diff > 0) nextStory(); // Swipe Left
            else prevStory(); // Swipe Right
        }
    };

    // Initial Load
    loadStories();
});
