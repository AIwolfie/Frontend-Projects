/**
 * GitHub Random Repository Finder
 * Core Logic: API fetching, UI state management, and random selection.
 */

// 1. Elements
const languageSelect = document.getElementById('language-select');
const fetchBtn = document.getElementById('fetch-btn');
const refreshBtn = document.getElementById('refresh-btn');
const retryBtn = document.querySelector('.retry-btn');

// State Containers
const states = {
    initial: document.getElementById('state-initial'),
    loading: document.getElementById('state-loading'),
    error: document.getElementById('state-error'),
    empty: document.getElementById('state-empty'),
    success: document.getElementById('repo-card')
};

// Repo Card Elements
const elRepoName = document.getElementById('repo-name');
const elRepoLink = document.getElementById('repo-link');
const elRepoDesc = document.getElementById('repo-desc');
const elRepoStars = document.getElementById('stat-stars');
const elRepoForks = document.getElementById('stat-forks');
const elRepoIssues = document.getElementById('stat-issues');
const elRepoLang = document.getElementById('stat-lang');
const elOwnerAvatar = document.getElementById('owner-avatar');
const elOwnerName = document.getElementById('owner-name');

// 2. State Management Functions
/**
 * Switch the visible UI state
 * @param {string} stateKey - The key of the state to show (initial, loading, error, empty, success)
 */
const setUIState = (stateKey) => {
    // Hide all states
    Object.values(states).forEach(el => el.hidden = true);

    // Show the target state
    if (states[stateKey]) {
        states[stateKey].hidden = false;
    }
};

/**
 * Update the repository card with data
 * @param {Object} repo - The repository object from GitHub API
 */
const updateRepoCard = (repo) => {
    elRepoName.textContent = repo.name;
    elRepoLink.href = repo.html_url;
    elRepoDesc.textContent = repo.description || 'No description provided.';
    elRepoStars.textContent = repo.stargazers_count.toLocaleString();
    elRepoForks.textContent = repo.forks_count.toLocaleString();
    elRepoIssues.textContent = repo.open_issues_count.toLocaleString();
    elRepoLang.textContent = repo.language || 'N/A';

    // Owner info
    elOwnerAvatar.src = repo.owner.avatar_url;
    elOwnerAvatar.alt = repo.owner.login;
    elOwnerName.textContent = repo.owner.login;

    setUIState('success');
};

// 3. API Fetching Logic
/**
 * Fetch repositories from GitHub and display a random one
 */
const fetchRandomRepo = async () => {
    const language = languageSelect.value;
    const url = `https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc`;

    // A. Start Loading
    setUIState('loading');
    fetchBtn.disabled = true;

    try {
        const response = await fetch(url);

        // B. Handle HTTP Errors (e.g., 403 Rate Limit)
        if (!response.ok) {
            const errorDesc = document.getElementById('error-desc');
            if (response.status === 403) {
                errorDesc.textContent = "GitHub API rate limit exceeded. Please wait a minute and try again.";
            } else {
                errorDesc.textContent = `Error ${response.status}: Failed to fetch data from GitHub.`;
            }
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        // C. Handle Empty Results
        if (data.items.length === 0) {
            setUIState('empty');
            return;
        }

        // D. Pick a Random Repository from the top results
        // We pick from the best results (usually top 30)
        const randomIndex = Math.floor(Math.random() * data.items.length);
        const randomRepo = data.items[randomIndex];

        // E. Success UI
        updateRepoCard(randomRepo);

    } catch (error) {
        console.error('Fetch error:', error);
        setUIState('error');
    } finally {
        fetchBtn.disabled = false;
    }
};

// 4. Event Listeners
fetchBtn.addEventListener('click', fetchRandomRepo);
refreshBtn.addEventListener('click', fetchRandomRepo);
retryBtn.addEventListener('click', fetchRandomRepo);

// Optional: Fetch on 'Enter' key in language select
languageSelect.addEventListener('change', () => {
    // If user changes language, they might want to fetch immediately
    // For this demo, we'll wait for the button click to keep it clean
});
