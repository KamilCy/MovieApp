const views = [document.getElementById("mainView"),document.getElementById("movieDetailView")]
function disableViews() {
    for (view of views) {
        view.style.display="none"
    }
}

//GET request for server api with option to provide search 
async function getData(search="") {
    try {
        const json = await getDataAsync(`${BASE_URL}${search}`);
        disableViews();
        document.getElementById("mainView").style.display="block";
        if (json != null) {
            return (json);
        } else {           
            return {searchError: "no results"};
        }

    }
    catch (err) {

    }
}

async function getDetails(movie, id) {

    try {
        const json = await getDataAsync(`${BASE_URL}${movie}/${id}`);
        disableViews();
        document.getElementById("movieDetailView").style.display="block";
        if (json[0]) {

            return (json);
        } else {
            return {searchError: "no results"};
        }

    }
    catch (err) {
        console.log(err);
    }
}

//homepage view
//function displaying json in table rows
async function mainView(search="") {
    let rows =[];
    movies = await getData(search)
    if (movies.hasOwnProperty("searchError")) {
        rows = [`<tr>
                    <td>${movies.searchError}</td>
                    </tr>`]
    } else {
    rows = movies.map(movies => {
        let row = `<tr>
                    <td onclick="movieDetailView('movie',${movies.MovieId})">${movies.Title}</td>
                    <td>${movies.ReleseDate}</td>`;
        if (userLoggedIn() === true) {      
            row+= `<td class="text-center"><button class="btn" data-toggle="modal" data-target="#MovieUpdateFormDialog" onclick="prepareMovieUpdate(${movies.MovieId})"><span class="oi oi-pencil"></span></button></td>
                    <td class="text-center"><button class="btn" onclick="deleteMovie(${movies.MovieId})"><span class="oi oi-trash"></span></button></td>`
            }
        row+= '</tr>';
        return row
        });
    }

    document.getElementById('index-table').innerHTML = rows.join('')

}
mainView();

//search function reading input from search field and feding it to request function
document.getElementById("searchButton").addEventListener("click", searchMovies);

function searchMovies() {
    let searchInput = document.getElementById("searchBox");
    let searchValue = searchInput.value;
    if (searchValue.length < 3) {
        searchInput.value = "min 3 characters"
    } else {
        mainView(`search/name/${searchValue}`);
    }

}
//if clicked on update button this function fills out form for update
async function prepareMovieUpdate(id) {
    try {

        const movie = await getDataAsync(`${BASE_URL}search/id/${id}`);
        document.getElementById('movieId').value = movie.MovieId;
        document.getElementById('movieCategory').value = movie.Category;
        document.getElementById('releseDate').value = movie.ReleseDate;
        document.getElementById('movieCountry').value = movie.Country;
        document.getElementById('movieDirector').value = movie.Director;
        document.getElementById('movieTitle').value = movie.Title;
    } 
    catch (err) {

    }
  }
//function reads inputs from update form ands sends json with PUT OR POST
  async function addOrUpdateMovie() {
  
    let url = `${BASE_URL}update`
  
    const movieId = Number(document.getElementById('movieId').value);
    const movieTitle = document.getElementById('movieTitle').value;
    const movieCategory = document.getElementById('movieCategory').value;
    const movieReleseDate = document.getElementById('releseDate').value;
    const movieCountry = document.getElementById('movieCountry').value;
    const movieDirector = document.getElementById('movieDirector').value;

    // build request body
    const reqBody = JSON.stringify({
    Title: movieTitle,
    Category: movieCategory,
    ReleseDate: movieReleseDate,
    Country: movieCountry,
    Director: movieDirector
    });
    // Try catch 
    try {
        let json = "";
        // determine if this is an insert (POST) or update (PUT)
        // update will include movie id
        if (movieId > 0) {
            url+= `/${movieId}`;
            json = await postOrPutDataAsync(url, reqBody, 'PUT');
            if (json.error) {
                alert(json.error)
            }
            mainView();
            document.getElementById("updateForm").reset();
            document.getElementById("movieId").value = "0";
        }
        else {  
            json = await postOrPutDataAsync(url, reqBody, 'POST');
            mainView();
            document.getElementById("updateForm").reset();
            document.getElementById("movieId").value = "0";
            
        }
    } catch (err) {


    }
  }
  // Delete Movie by id using an HTTP DELETE request
  async function deleteMovie(id) {
        
    if (confirm("Are you sure?")) {
        // url
        const url = `${BASE_URL}update/${id}`;
        
        // Try catch 
        try {
            const json = await deleteDataAsync(url);
            if (json.error) {
                alert(json.error)
            }
            mainView();

        // catch and log any errors
        } catch (err) {


        }
    }
  }
//movie detail view

async function movieDetailView(movie, id) {
    let detail = await getDetails(movie, id)
    let rows =[];
    if (detail.hasOwnProperty("searchError")) {
        document.getElementById('movieDetailTitle').innerHTML = detail.searchError;
        document.getElementById('movieDetailCategory').innerHTML = detail.searchError;
        document.getElementById('movieDetailReleseDate').innerHTML = detail.searchError;
        document.getElementById('movieDetailCountry').innerHTML = detail.searchError;
        document.getElementById('movieDetailDirector').innerHTML = detail.searchError;
        document.getElementById('poster').src = "webApp/defalut-image.jpg";
        rows = [`<tr>
                    <td>${detail.searchError}</td>
                    </tr>`];
    } else {
        document.getElementById('movieDetailTitle').innerHTML = detail[0].Title;
        document.getElementById('movieDetailCategory').innerHTML = detail[0].Category;
        document.getElementById('movieDetailReleseDate').innerHTML = detail[0].ReleseDate;
        document.getElementById('movieDetailCountry').innerHTML = detail[0].Country;
        document.getElementById('movieDetailDirector').innerHTML = detail[0].Director;
        document.getElementById('poster').src = `${BASE_URL}posters/${detail[0].poster}.jpg`;
        rows = detail.map(actors => {
        let row = `<tr>
                    <td >${actors.ActorName}</td>`;
        return row
        });
    }
    document.getElementById('movieDetailActors').innerHTML = rows.join('');
}