const position = localStorage.getItem("Position");
const results = JSON.parse(localStorage.getItem("Results"));

const favButton = document.querySelector("#favorites_search");

let favCount = 1;       // how many favorites the current user has
let userID;

// call loadFavorites() when page has loaded
document.addEventListener("DOMContentLoaded", () => {
	loadFavorites(); 
});


function loadFavorites() {
    getFavoritesCount();
    getFavorites(); 
}

// insert a movie/series to the database
function putToFavorite(entertainmentName, rate, poster) {

    let Name = entertainmentName;
    let Rating = rate
    console.log(Rating);
    let dateAdded = new Date().toISOString().slice(0, 10);
    let posterPath = poster

    const data = {
        "name": Name,
        "rating": Rating,
        "dateAdded": dateAdded,
        "posterPath": posterPath,
    }

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8080/api/favorites", false);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        console.log(xhr.responseText);

    }
    console.log(data);
    let eventString = JSON.stringify(data);
    xhr.send(eventString);
    return xhr.responseText;


}


// Get all favorites from current user
function getFavorites() {

    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8080/api/getFavoritesFromCurrentUser");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {

                let response = xhr.response;
                let parsedResponse = JSON.parse(response);
                

                printResults2(parsedResponse);
            }
        }
    }
    xhr.send();
}

// Get the number of favorite movies/series from the current user
function getFavoritesCount() {

    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8080/api/CountFavorites");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {

                let response = xhr.response;
                let parsedResponse = JSON.parse(response);

                favCount = parsedResponse.rowCount;
                console.log("favCount: " + favCount);       
            }
        }
    }
    xhr.send();
}


// -------------- Print favorites to page --------------------------
const printResults2 = (result) => {
    const favResultsDiv = document.querySelector("#favResults");
    
    let searchAmount =  favCount;
    console.log("searchAmount: " + searchAmount);
    favResultsDiv.innerHTML = ``;


    for (let i = 0; i < searchAmount; i++) {

        const container = document.createElement("div");
        container.setAttribute("id", "container");


        const cover = document.createElement("img");
        cover.src = "https://image.tmdb.org/t/p/original/" + result[i].imageURL;
        cover.setAttribute("class", "cover");
        cover.style = "width:100%";

        const title = document.createElement("p");
        title.setAttribute("class", "title");
        title.innerText = result[i].name;

        const delFavorite = document.createElement("button");
        delFavorite.setAttribute("class","deleteFavorite")
        delFavorite.innerText = "delete";
        delFavorite.onclick = function() {deleteFromDatabase(title.innerHTML)};

        favResultsDiv.appendChild(container);
        container.appendChild(title);
        container.appendChild(cover);
        container.appendChild(delFavorite);

    }
}


// Poistamistoiminto testauksia varten
function deleteFromDatabase(name) {

    const data = {
        "name": name
    }
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", "http://localhost:8080/api/favorites", false);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
        console.log(xhr.responseText);
    }

    let eventString = JSON.stringify(data);
    xhr.send(eventString);
    return xhr.responseText;

}