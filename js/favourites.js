let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

const canvas = document.getElementById("canvas");
const superheroList = document.getElementById("superhero-list");
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
    themeToggleBtn.textContent = "Dark Mode"; 
} else {
    body.classList.add("dark-mode");
    themeToggleBtn.textContent = "Light Mode";
}

function displayFavoriteSuperhero(superhero) {
  const templateCanvas = canvas.content.cloneNode(true);
  templateCanvas.querySelector("#my-img").src = `${superhero.thumbnail.path}.${superhero.thumbnail.extension}`;
  templateCanvas.querySelector("#name").textContent = superhero.name;
  templateCanvas
    .querySelector("#about")
    .addEventListener("click", function () {
      localStorage.setItem("id", superhero.id);
      window.location.assign("./about.html");
    });

  templateCanvas
    .querySelector("#fav")
    .addEventListener("click", function () {
      removeFromFavorites(superhero.id);
      templateCanvas.remove();
    });

  superheroList.appendChild(templateCanvas);
}

function removeFromFavorites(id) {
  favorites = favorites.filter((fav) => fav.id !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayFavorites();
}

function displayFavorites() {
  superheroList.innerHTML = "";

  if (favorites.length === 0) {
    superheroList.innerHTML = "<b>No Super Hero To Display</b>";
  } else {
    favorites.forEach(displayFavoriteSuperhero);
  }
}

displayFavorites();
