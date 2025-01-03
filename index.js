
// API URL
const API_URL = 'Тут має бути апі яке я не знайшов';


async function getMovies() {
    try {
        const response = await fetch(API_URL);
        const movies = await response.json();
        displayMovies(movies);
    } catch (error) {
        console.error('Помилка при отриманні фільмів:', error);
        alert('Помилка при отриманні фільмів');
    }
}

// Додавання нового фільму (POST)
async function addMovie(movieData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movieData)
        });
        if (response.ok) {
            getMovies(); 
            return true;
        }
        throw new Error('Помилка при додаванні фільму');
    } catch (error) {
        console.error('Помилка при додаванні фільму:', error);
        alert('Помилка при додаванні фільму');
        return false;
    }
}

// Оновлення фільму (PUT)
async function updateMovie(id, movieData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movieData)
        });
        if (response.ok) {
            getMovies(); 
            return true;
        }
        throw new Error('Помилка при оновленні фільму');
    } catch (error) {
        console.error('Помилка при оновленні фільму:', error);
        alert('Помилка при оновленні фільму');
        return false;
    }
}

// Часткове оновлення фільму (PATCH)
async function patchMovie(id, partialData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(partialData)
        });
        if (response.ok) {
            getMovies(); 
            return true;
        }
        throw new Error('Помилка при частковому оновленні фільму');
    } catch (error) {
        console.error('Помилка при частковому оновленні фільму:', error);
        alert('Помилка при частковому оновленні фільму');
        return false;
    }
}


async function deleteMovie(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            getMovies(); // Оновлюємо список фільмів
            return true;
        }
        throw new Error('Помилка при видаленні фільму');
    } catch (error) {
        console.error('Помилка при видаленні фільму:', error);
        alert('Помилка при видаленні фільму');
        return false;
    }
}


function displayMovies(movies) {
    const tbody = document.getElementById('moviesTableBody');
    tbody.innerHTML = '';
    
    movies.forEach(movie => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${movie.id}</td>
            <td>${movie.title}</td>
            <td>${movie.genre}</td>
            <td>${movie.director}</td>
            <td>${movie.year}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="openEditModal(${JSON.stringify(movie).replace(/"/g, '&quot;')})">
                    Редагувати
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteMovie(${movie.id})">
                    Видалити
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Відкриття модального вікна для редагування
function openEditModal(movie) {
    document.getElementById('editMovieId').value = movie.id;
    document.getElementById('editTitle').value = movie.title;
    document.getElementById('editGenre').value = movie.genre;
    document.getElementById('editDirector').value = movie.director;
    document.getElementById('editYear').value = movie.year;
    
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
}


document.addEventListener('DOMContentLoaded', () => {

    getMovies();


    document.getElementById('addMovieForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const movieData = {
            title: document.getElementById('title').value,
            genre: document.getElementById('genre').value,
            director: document.getElementById('director').value,
            year: parseInt(document.getElementById('year').value)
        };
        
        if (await addMovie(movieData)) {
            e.target.reset();
        }
    });


    document.getElementById('refreshMovies').addEventListener('click', getMovies);

    document.getElementById('saveEdit').addEventListener('click', async () => {
        const id = document.getElementById('editMovieId').value;
        const partialData = {};
        
        // Збираємо тільки змінені поля
        const fields = ['title', 'genre', 'director', 'year'];
        fields.forEach(field => {
            const value = document.getElementById(`edit${field.charAt(0).toUpperCase() + field.slice(1)}`).value;
            if (value) {
                partialData[field] = field === 'year' ? parseInt(value) : value;
            }
        });

        if (await patchMovie(id, partialData)) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
            modal.hide();
        }
    });
});