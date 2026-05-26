document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("catalog-grid");
  const searchInput = document.getElementById("search-input");
  const filterButtons = document.getElementById("filter-buttons");
  const genreSelect = document.getElementById("genre-select");
  const sortSelect = document.getElementById("sort-select");
  const noResultsMsg = document.getElementById("no-results");

  const modal = document.getElementById("detail-modal");
  const closeModalBtn = document.querySelector(".close-modal");

  let activeCategory = "all";

  function createFilters() {
    filterButtons.innerHTML = "";

    const categories = ["all", ...new Set(franchises.map(item => item.category))];

    categories.forEach(category => {
      const button = document.createElement("button");

      button.textContent = category === "all" ? "Все" : category;
      button.dataset.category = category;

      if (category === "all") {
        button.classList.add("active");
      }

      button.addEventListener("click", () => {
        document
          .querySelectorAll("#filter-buttons button")
          .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");
        activeCategory = category;

        applyFilters();
      });

      filterButtons.appendChild(button);
    });
  }

  function createGenres() {
    const genres = [
      ...new Set(
        franchises.flatMap(item =>
          item.genre.split(",").map(genre => genre.trim())
        )
      )
    ].sort((a, b) => a.localeCompare(b, "ru"));

    genres.forEach(genre => {
      const option = document.createElement("option");

      option.value = genre;
      option.textContent = genre;

      genreSelect.appendChild(option);
    });
  }

  function renderCards(data) {
    grid.innerHTML = "";

    if (data.length === 0) {noResultsMsg.classList.remove("hidden");
      return;
    }

    noResultsMsg.classList.add("hidden");

    data.forEach(item => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div class="card-img" style="background-image: url('${item.image}')"></div>

        <div class="card-body">
          <h3>${item.name}</h3>
          <p class="card-category">${item.category}</p>
          <p class="card-short">${item.shortDesc}</p>
          <button class="btn-details" data-id="${item.id}">Подробнее</button>
        </div>
      `;

      grid.appendChild(card);
    });

    document.querySelectorAll(".btn-details").forEach(button => {
      button.addEventListener("click", () => {
        openModal(button.dataset.id);
      });
    });
  }

  function applyFilters() {
    const query = searchInput.value.toLowerCase().trim();
    const selectedGenre = genreSelect.value;
    const sortValue = sortSelect.value;

    let filtered = franchises.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(query);
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchesGenre =
        selectedGenre === "all" || item.genre.includes(selectedGenre);

      return matchesSearch && matchesCategory && matchesGenre;
    });

    switch (sortValue) {
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name, "ru"));
        break;

      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name, "ru"));
        break;

      case "category":
        filtered.sort((a, b) => a.category.localeCompare(b.category, "ru"));
        break;

      case "genre":
        filtered.sort((a, b) => a.genre.localeCompare(b.genre, "ru"));
        break;
    }

    renderCards(filtered);
  }

  function openModal(id) {
    const item = franchises.find(franchise => franchise.id == id);

    if (!item) return;

    document.getElementById("modal-img").src = item.image;
    document.getElementById("modal-title").textContent = item.name;
    document.getElementById("modal-category").textContent = item.category;
    document.getElementById("modal-genre").textContent = item.genre;
    document.getElementById("modal-desc").textContent = item.fullDesc;

    modal.classList.remove("hidden");
  }

  closeModalBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", event => {
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  });

  searchInput.addEventListener("input", applyFilters);
  genreSelect.addEventListener("change", applyFilters);
  sortSelect.addEventListener("change", applyFilters);

  createFilters();
  createGenres();
  applyFilters();
});