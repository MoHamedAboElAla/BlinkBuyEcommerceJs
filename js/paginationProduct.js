const mostPopProducts = document.querySelector(".most-popular-products");
const searchForm = document.querySelector(".search-form");
const searchInput = document.getElementById("search-input");

let productsData = []; // Store fetched products
const PRODUCTS_PER_PAGE = 6; // Number of products per page

// Fetch products from the server
async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:3000/products");
    const data = await response.json();
    productsData = data;
    renderProducts(data, 1);
    renderPaginationControls(data, 1); // Render pagination for the first page
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Render product cards
function renderProducts(products, currentPage = 1) {
  console.log("Rendering products for page:", currentPage);
  mostPopProducts.innerHTML = "";

  if (!products.length) {
    mostPopProducts.innerHTML = `<p class="no-results">No products found.</p>`;
    return;
  }

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  paginatedProducts
    .filter(product => product.approved)
    .forEach(({ id, name, price, category, images }) => {
      const firstColor = images[0]?.color || "#ccc";

      mostPopProducts.innerHTML += `
        <div class="product-card" data-product-id="${id}" style="border: 3px solid ${firstColor};">
          <div class="product-card__container">
            <div class="product-card__btn cart" data-tooltip="add to cart" onclick="addToCart(${id})">
              <i class="fas fa-shopping-cart"></i>
            </div>
            <div class="product-card__btn fav" data-tooltip="add to wishlist" onclick="addToWishlist(${id})">
              <i class="fas fa-heart"></i>
            </div>
            <div class="product-card__img">
              <img src="${images[0].url}" alt="${name}" />
            </div>
          </div>
          <div class="product-card__description">
            <div class="product-card__text">${name}</div>
            <div class="product-card__price">${price}</div>
            <div class="product-card__category">${category}</div>
          </div>
        </div>
      `;
    });

 
}
function addColorButtonListeners() {
  const radioBtns = document.querySelectorAll(".product-card__btn-radio");

  document.querySelectorAll(".product-card").forEach(card => {
    const firstBtn = card.querySelector(".product-card__btn-radio");
    if (firstBtn) {
      firstBtn.classList.add("selected");
      const color = firstBtn.querySelector("span").style.backgroundColor;
      card.style.border = `3px solid ${color}`;
    }
  });

  radioBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".product-card");
      const img = card.querySelector(".product-card__img > img");
      const allBtns = card.querySelectorAll(".product-card__btn-radio");

      allBtns.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      img.src = btn.dataset.img;

     
      const color = btn.querySelector('span').style.backgroundColor;
      card.style.border = `3px solid ${color}`;
    });
  });
}

// Filter products by search query
function filterProducts(query) {
  const q = query.toLowerCase();
  const filtered = productsData.filter(({ name, price, category }) =>
    name.toLowerCase().includes(q) ||
    price.toString().includes(q) ||
    category.toLowerCase().includes(q)
  );
  renderProducts(filtered, 1); // Render first page of filtered products
  renderPaginationControls(filtered, 1); // Render pagination for filtered products
}

// Search form submit handler
searchForm.addEventListener("submit", event => {
  event.preventDefault();
  filterProducts(searchInput.value.trim());
});

// Real-time search
searchInput.addEventListener("input", () => {
  filterProducts(searchInput.value.trim());
});
function renderPaginationControls(products, currentPage) {
  let paginationContainer = document.querySelector(".pagination");

  // Create container if not found
  if (!paginationContainer) {
    paginationContainer = document.createElement("div");
    paginationContainer.className = "pagination";
    mostPopProducts.parentElement.appendChild(paginationContainer);
  }

  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = "pagination-btn";

    // Base styles
    btn.style.background = "linear-gradient(to right, #4facfe, #00f2fe)";
    btn.style.color = "white";
    btn.style.fontWeight = "bold";
    btn.style.border = "none";
    btn.style.padding = "10px 15px";
    btn.style.borderRadius = "12px";
    btn.style.cursor = "pointer";
    btn.style.transition = "all 0.3s ease";
    btn.style.boxShadow = "0 4px 12px rgba(0, 242, 254, 0.2)";
    btn.style.margin = "5px";

    // Active button style
    if (i === currentPage) {
      btn.style.background = "linear-gradient(to right, #43e97b, #38f9d7)";
      btn.style.boxShadow = "0 6px 20px rgba(67, 233, 123, 0.5)";
      btn.style.transform = "scale(1.1)";
    }

    // Hover effect using JS events
    btn.addEventListener("mouseover", () => {
      btn.style.transform = "scale(1.1)";
      btn.style.boxShadow = "0 6px 18px rgba(0, 242, 254, 0.4)";
    });
    btn.addEventListener("mouseout", () => {
      btn.style.transform = i === currentPage ? "scale(1.1)" : "scale(1)";
      btn.style.boxShadow =
        i === currentPage
          ? "0 6px 20px rgba(67, 233, 123, 0.5)"
          : "0 4px 12px rgba(0, 242, 254, 0.2)";
    });

    btn.addEventListener("click", () => {
      renderProducts(products, i);
      renderPaginationControls(products, i);
    });

    paginationContainer.appendChild(btn);
  }

  // Center container
  paginationContainer.style.display = "flex";
  paginationContainer.style.justifyContent = "center";
  paginationContainer.style.alignItems = "center";
  paginationContainer.style.flexWrap = "wrap";
  paginationContainer.style.margin = "20px 0";
}
// Initial fetch
fetchProducts();
