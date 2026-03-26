const movieInput = document.getElementById('movieInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const errorMsg = document.getElementById('errorMsg');
const movieContainer = document.getElementById('movieContainer');

// Modal Elements
const movieModal = document.getElementById('movieModal');
const closeBtn = document.querySelector('.close-btn');
const movieDetailsBody = document.getElementById('movieDetailsBody');

closeBtn.addEventListener('click', () => {
    movieModal.classList.add('hidden');
});

window.addEventListener('click', (e) => {
    if (e.target === movieModal) {
        movieModal.classList.add('hidden');
    }
});

// Debounce helper for real-time search
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};

const debouncedSearch = debounce((query) => {
    if (query) {
        searchMovies(query);
    } else {
        movieContainer.innerHTML = '';
        errorMsg.classList.add('hidden');
    }
}, 500);

searchBtn.addEventListener('click', () => {
    const query = movieInput.value.trim();
    if (query) {
        searchMovies(query);
    }
});

// Input event triggers debounced search (real-time typing)
movieInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    debouncedSearch(query);
});

const searchMovies = async (query) => {
    // Reset UI
    movieContainer.innerHTML = '';
    errorMsg.classList.add('hidden');
    loading.classList.remove('hidden');

    try {
        if (!OMDB_API_KEY || OMDB_API_KEY === 'YOUR_API_KEY') {
            throw new Error('Please set your expected OMDB_API_KEY in index.html to search for movies.');
        }

        const response = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            throw new Error('Failed to connect to OMDB API.');
        }

        const data = await response.json();

        // OMDB API returns Response: "False" on error (e.g., movie not found)
        if (data.Response === "False") {
            throw new Error(data.Error || 'No movies found.');
        }

        displayMovies(data.Search);
    } catch (error) {
        errorMsg.textContent = error.message;
        errorMsg.classList.remove('hidden');
    } finally {
        loading.classList.add('hidden');
    }
};

const displayMovies = (movies) => {
    movies.forEach((movie, index) => {
        // Create card element
        const cardContainer = document.createElement('div');
        cardContainer.className = 'movie-card';
        cardContainer.style.animationDelay = `${index * 0.05}s`; // Staggered animation
        cardContainer.dataset.id = movie.imdbID;

        // Check for placeholder image
        const posterSrc = movie.Poster !== "N/A" ? movie.Poster : '';
        const imgDisplay = posterSrc ? `<img src="${posterSrc}" alt="${movie.Title} poster" class="movie-poster">` : `<div class="movie-poster">No Image</div>`;

        cardContainer.innerHTML = `
            ${imgDisplay}
            <div class="movie-info">
                <h3 class="movie-title">${movie.Title}</h3>
                <span class="movie-year">${movie.Year}</span>
            </div>
        `;

        // Movie Details page on click
        cardContainer.addEventListener('click', () => {
            fetchMovieDetails(movie.imdbID);
        });

        movieContainer.appendChild(cardContainer);
    });
};

const fetchMovieDetails = async (id) => {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}&plot=full`);
        if (!response.ok) throw new Error('Failed to fetch movie details.');
        const data = await response.json();
        
        if (data.Response === "False") throw new Error(data.Error);
        
        displayMovieDetails(data);
    } catch (error) {
        alert(error.message);
    }
};

const displayMovieDetails = (movie) => {
    const posterSrc = movie.Poster !== "N/A" ? movie.Poster : '';
    const imgDisplay = posterSrc ? `<img src="${posterSrc}" alt="${movie.Title} poster" class="modal-poster">` : `<div class="modal-poster" style="display:flex;align-items:center;justify-content:center;background:#0f3460;min-height:300px;color:#888;">No Image</div>`;

    movieDetailsBody.innerHTML = `
        ${imgDisplay}
        <div class="modal-info">
            <h2>${movie.Title} (${movie.Year})</h2>
            <p><strong>Genre:</strong> ${movie.Genre}</p>
            <p><strong>Runtime:</strong> ${movie.Runtime}</p>
            <p><strong>Director:</strong> ${movie.Director}</p>
            <p><strong>Actors:</strong> ${movie.Actors}</p>
            <p><strong>IMDb Rating:</strong> ⭐ ${movie.imdbRating}</p>
            <p><strong>Plot:</strong><br> ${movie.Plot}</p>
        </div>
    `;
    
    // Show modal
    movieModal.classList.remove('hidden');
};
