const movieInput = document.getElementById('movieInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const errorMsg = document.getElementById('errorMsg');
const movieContainer = document.getElementById('movieContainer');

searchBtn.addEventListener('click', () => {
    const query = movieInput.value.trim();
    if (query) {
        searchMovies(query);
    }
});

movieInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = movieInput.value.trim();
        if (query) {
            searchMovies(query);
        }
    }
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
    movies.forEach(movie => {
        // Create card element
        const cardContainer = document.createElement('div');
        cardContainer.className = 'movie-card';

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

        movieContainer.appendChild(cardContainer);
    });
};
