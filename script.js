
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        searchMovies();
    }
}

function showHomePage() {
    document.getElementById('content').innerHTML = `
        <h2 >Home Page</h2>
        <div >
            <input type="text" id="search-input" placeholder="Search for a movie" oninput="showSuggestions()" onkeypress="handleKeyPress(event)">
            <button onclick="searchMovies()">Search</button>
            <div id="suggestions"></div>
        </div>
        <div id="movies-list"></div>
    `;
}

function showFavoritesPage() {
    displayFavorites();
}

function showMoviePage(movie) {
    document.getElementById('content').innerHTML = `
        <h2>${movie.title} (${movie.year})</h2>
        <div>
            <p>IMDb ID: ${movie.imdbID}</p>
            <p>Type: ${movie.type}</p>
            <p>Poster: <img src="${movie.poster}" alt="${movie.title}"></p>
        </div>
        <button class="favorite-button" onclick="addFavorite('${movie.imdbID}')">Add to Favorites</button>
    `;
}

function showSuggestions() {
    const searchInput = document.getElementById('search-input').value;
    const suggestions = document.getElementById('suggestions');

    fetch(`https://www.omdbapi.com/?s=${searchInput}&apikey=433187c2`)
        .then(response => response.json())
        .then(data => {
            if (data.Search) {
                suggestions.innerHTML = '';
                data.Search.forEach(movie => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.classList.add('suggestion-item');
                    suggestionItem.textContent = movie.Title;
                    suggestionItem.addEventListener('click', () => {
                        document.getElementById('search-input').value = movie.Title;
                        suggestions.style.display = 'none';
                    });
                    suggestions.appendChild(suggestionItem);
                });
                suggestions.style.display = 'block';
            } else {
                suggestions.style.display = 'none';
            }
        })
        .catch(error => {
            console.error(error);
            suggestions.style.display = 'none';
        });
}

function searchMovies() {
    const searchInput = document.getElementById('search-input').value;

    fetch(`https://www.omdbapi.com/?s=${searchInput}&apikey=433187c2`)
        .then(response => response.json())
        .then(data => {
            if (data.Search) {
                const moviesList = document.getElementById('movies-list');
                moviesList.innerHTML = '';

                data.Search.forEach(movie => {
                    const movieCard = document.createElement('div');
                    movieCard.classList.add('movie-card');
                    movieCard.innerHTML = `
                        <div>
                            <strong>${movie.Title} (${movie.Year} )</strong>
                        </div>
                        <button class="favorite-button" onclick="showMoviePage({ title: '${movie.Title}', year: '${movie.Year}', imdbID: '${movie.imdbID}', type: '${movie.Type}', poster: '${movie.Poster}' })">View Details</button>
                        
                    `;
                    moviesList.appendChild(movieCard);
                });
            }
        })
        .catch(error => console.error(error));
}

const favorites = [];

function addFavorite(imdbID) {
    fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=433187c2`)
        .then(response => response.json())
        .then(data => {
            const movie = {
                title: data.Title,
                year: data.Year,
                imdbID: data.imdbID,
                type: data.Type,
                poster: data.Poster,
            };

            if (data.Poster === 'N/A') {
                movie.poster = 'https://via.placeholder.com/150';
            }

            
            if (favorites.some(fav => fav.imdbID === movie.imdbID)) {
                alert('Movie is already in your favorites!');
                return;
            }

            favorites.push(movie);
            alert('Added to Favorites!');
            showFavoritesPage();
        })
        .catch(error => {
            console.error(error);
            alert('Error fetching movie details. Please try again.');
        });
}

function displayFavorites() {
    const favoritesList = document.getElementById('content');
    favoritesList.innerHTML = '<h2>Favorites</h2>';

    if (favorites.length === 0) {
        favoritesList.innerHTML += '<p>No favorites yet.</p>';
    } else {
        favorites.forEach(movie => {
            const favoriteCard = document.createElement('div');
            favoriteCard.classList.add('movie-card');
            favoriteCard.innerHTML = `
                <div>
                    <strong>${movie.title} (${movie.year}) (${movie.poster})</strong>
                </div>
                <button class="favorite-button" onclick="removeFavorite('${movie.imdbID}')">Remove from Favorites</button>
            `;
            favoritesList.appendChild(favoriteCard);
        });
    }
}
function removeFavorite(imdbID) {
    const index = favorites.findIndex(fav => fav.imdbID === imdbID);
    if (index !== -1) {
        favorites.splice(index, 1);
        showFavoritesPage();
    }
}
showHomePage();