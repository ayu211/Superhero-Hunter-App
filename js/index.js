document.addEventListener('DOMContentLoaded', () => {
  const cardTemplate = document.getElementById("canvas").content;

  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  

const PUBLIC_KEY = '654ea5868b2eed5e890b1e6b439dbe2d';
const PRIVATE_KEY = '943a8cb5f362ea52d640082ed1966e37091018ea';
const BASE_URL = "https://gateway.marvel.com/v1/public/";

// Hash generation function
function generateHash(ts) {
    return CryptoJS.MD5(ts + PRIVATE_KEY + PUBLIC_KEY).toString();
}
const themeToggleBtn = document.getElementById("themeToggleBtn");
  const body = document.body;
  function toggleTheme() {
    body.classList.toggle("light-mode");
    body.classList.toggle("dark-mode");

    if (body.classList.contains("light-mode")) {
        localStorage.setItem("theme", "light");
        themeToggleBtn.textContent = "Dark Mode";

    } else {
        localStorage.setItem("theme", "dark");
        themeToggleBtn.textContent = "Light Mode";

    }
}
themeToggleBtn.addEventListener("click", toggleTheme);
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
    body.classList.add("light-mode");
} else {
    body.classList.add("dark-mode");
}

function fetchCharacters(nameStartsWith = '') {
    const ts = Date.now().toString();
    const hash = generateHash(ts);
    const url = `${BASE_URL}/characters?${
        nameStartsWith ? `nameStartsWith=${nameStartsWith}&` : ''
    }ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`;

    var req = new XMLHttpRequest();
    req.open("get", url, true);
    req.send();

    req.onload = function () {
        if (req.status >= 200 && req.status < 400) {
            var allCharacters = JSON.parse(req.responseText);
            getAllCharactersList(allCharacters.data.results);
        } else {
            console.error('Error fetching characters:', req.statusText);
        }
    };
}


function display(data) {
  console.log(data.data.results)
  getAllCharactersList(data.data.results);
}

// Display superhero list
function getAllCharactersList(results) {
  const superheroList = document.getElementById("superhero-list");
  superheroList.innerHTML = "";

  if (results.length === 0) {
      superheroList.innerHTML = "<b>No Super Hero To Display</b>";
  } else {
      for (let result of results) {
          const superheroCard = cardTemplate.cloneNode(true);
          const superhero = superheroCard.querySelector("#superhero");
          
          const img = superhero.querySelector("#my-img");
          img.src = `${result.thumbnail.path}.${result.thumbnail.extension}`;
          img.alt = result.name;
          
          const name = superhero.querySelector("#name");
          name.textContent = result.name;

          const desc = superhero.querySelector("#des");
          if(result.description.length > 100){
            var split = result.description.slice(0,100).concat("....");
            desc.textContent = split;
          }else if(result.description.length == 0){
            desc.textContent = "(No Description About the Character)";
          }else{
            desc.textContent = result.description;
          }

          const aboutButton = superhero.querySelector("#about");
          aboutButton.addEventListener("click", () => {
              localStorage.setItem("id", result.id);
              window.location.assign("./about.html"); 
          });

          const favButton = superhero.querySelector("#fav");
          const isFavorite = favorites.some(fav => fav.id === result.id);

          favButton.textContent = isFavorite ? "Remove from Favorites" : "Add to Favorites";
          favButton.classList.toggle("btn-outline-dark", !isFavorite);
          favButton.classList.toggle("btn-danger", isFavorite);

          favButton.addEventListener("click", () => {
              if (isFavorite) {
                  removeFromFavorites(result.id);
                  favButton.textContent = "Add to Favorites";
                  favButton.classList.remove("btn-danger");
                  favButton.classList.add("btn-outline-dark");
              } else {
                  addToFavorites(result);
                  favButton.textContent = "Remove from Favorites";
                  favButton.classList.remove("btn-outline-dark");
                  favButton.classList.add("btn-danger");
              }
              
              display(data);
          });

          superheroList.appendChild(superheroCard);
      }
  }
}
function addToFavorites(character) {
  favorites.push(character);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function removeFromFavorites(id) {
  favorites = favorites.filter(fav => fav.id !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function getUrl() {
  var searchQuery = document.getElementById("search-string").value;
  if (!searchQuery) {
    return `https://gateway.marvel.com/v1/public/characters?ts=1&apikey=${PUBLIC_KEY}&hash=${generateHash("1")}`;
  } else {
    return `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${searchQuery}&ts=1&apikey=${PUBLIC_KEY}&hash=${generateHash("1")}`;
  }
}


document.getElementById("search-form").addEventListener("keyup", function () {
  var url = getUrl();
  var req = new XMLHttpRequest();
  req.open("get", url, true);
  req.send();
  req.onload = function () {
    var data = JSON.parse(req.responseText);
    display(data);
  };
});

fetchCharacters();
});