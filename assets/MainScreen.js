var PORT = 8000;

async function init() {
  //init modal features:
  var modal = document.getElementById("infoModal");
  var span = document.getElementsByClassName("close")[0];
  span.onclick = function () {
    modal.style.display = "none";
  };
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  //get top 10
  getTop10();

  //init search field
  var search = document.getElementById("search");
  search.addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      changeToSearch(search.value);
    }
  });
}

function changeToSearch(search) {
  //clear current movies:
  document.getElementById("top10Grid").innerHTML = "";
  document.getElementById("headText").innerHTML = "Search Results:";

  //ask server to search:
  url = "http://localhost:" + PORT + "/search?search=" + search;
  fetch(url).then((response) => {
    if (response.ok) {
      response.json().then((res) => {
        res.forEach((movie) => {
          // make a div out of movie and insert to grid
          div = createDivFromMovie(movie);
          document.getElementById("top10Grid").appendChild(div);
        });
      });
    } else {
      document.getElementById("headText").innerHTML =
        "Search error, please try again";
    }
  });
}

function returnToMain() {
  document.getElementById("top10Grid").innerHTML = "";
  document.getElementById("headText").innerHTML = "Today's Top 10:";
  //get top 10
  getTop10();
}

function createDivFromMovie(movie) {
  const div = document.createElement("div");
  div.className = "grid-item";
  div.addEventListener("click", function () {
    openDetails(movie);
  });
  div.innerHTML =
    `
  <p class="movieBlockP">` +
    movie["Title"] +
    `</p>
          <img
            src=` +
    movie["Poster"] +
    `
            style="height: 300px"
          />
          <p>IMDB Rating: ` +
    movie["imdbRating"] +
    `</p> 
  `;
  return div;
}

function openDetails(movie) {
  var modal = document.getElementById("infoModal");
  modal.style.display = "block";
  document.getElementById("modal-img").src = movie["Poster"];
  document.getElementById("modal-movie-name").innerHTML = movie["Title"];
  document.getElementById("modal-movie-desc").innerHTML = movie["Plot"];
  document.getElementById("modal-movie-genres").innerHTML =
    "Genres: " + movie["Genre"];
  document.getElementById("modal-movie-release").innerHTML =
    "Released: " + movie["Released"];
  document.getElementById("modal-movie-actors").innerHTML =
    "Actors: " + movie["Actors"];
}

async function getTop10() {
  url = "http://localhost:" + PORT + "/get_top_10";
  fetch(url).then((response) => {
    if (response.ok) {
      response.json().then((top10) => {
        top10.forEach((movie) => {
          // make a div out of movie and insert to grid
          div = createDivFromMovie(movie);
          document.getElementById("top10Grid").appendChild(div);
        });
      });
    } else {
      document.getElementById("headText").innerHTML =
        "Search error, please try again";
    }
  });
}
