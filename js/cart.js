document.addEventListener("DOMContentLoaded", () => {
  const mostPopProducts = document.querySelector(".most-popular-products");
  fetch("http://localhost:3000/products")
    .then((response) => response.json())
    .then((data) => {
      data.forEach(renderProductCard);
      setupColorSelection();
    })
    .catch((error) => console.error("Error fetching products:", error));
});

function renderProductCard(product) {
  const { id, name, price, category, images, approved } = product;
  if (!approved) return;

  const productHTML = `
    <div class="product-card" data-product-id="${id}">
      <div class="product-card__container">
        <div class="product-card__btn cart" data-tooltip="add to cart" onclick="addToCart(${id})">
          <i class="fas fa-shopping-cart"></i>
        </div>
        <div class="product-card__btn fav" data-tooltip="add to wishlist">
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
      <div class="product-card__color">
        ${images.map(image => `
          <button class="product-card__btn-radio" data-img="${image.url}">
            <span style="background-color: ${image.color};"></span>
          </button>
        `).join("")}
      </div>
    </div>
  `;
  document.querySelector(".most-popular-products").innerHTML += productHTML;
}

function setupColorSelection() {
  document.querySelectorAll(".product-card__color").forEach(pcc => {
    pcc.firstElementChild?.classList.add("selected");
  });

  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("product-card__btn-radio")) {
      const radioBtn = event.target;
      const productCard = radioBtn.closest(".product-card");
      const productImg = productCard.querySelector(".product-card__img > img");
      const proRadioBtns = productCard.querySelectorAll(".product-card__btn-radio");

      proRadioBtns.forEach(btn => btn.classList.remove("selected"));
      radioBtn.classList.add("selected");
      productImg.src = radioBtn.dataset.img;
    }
  });
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartTotal = document.getElementById("cart-total");
const cartItemCount = document.getElementById("cart-item-count");

window.addToCart = function (productId) {
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCounter();
  displayCartItems();
  Swal.fire({ title: "Added to Cart!", text: "The product has been added to your cart.", icon: "success", confirmButtonColor: "#fd5d5c" });
};

function updateCartCounter() {
  const cartCounter = document.getElementById("cart-counter");
  if (cartCounter) {
    cartCounter.textContent = cart.length;
  }
}

function displayCartItems() {
  const cartItemsContainer = document.querySelector(".cart-items");
  if (!cartItemsContainer) return console.warn("Cart items container not found on this page.");

  cartItemsContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<tr><td colspan="5" style="text-align: center;">Your cart is empty.</td></tr>`;
    if (cartTotal) cartTotal.textContent = "0.00";
    return;
  }

  cart.forEach(item => {
    fetch(`http://localhost:3000/products/${item.id}`)
      .then(res => res.json())
      .then(product => {
        const price = parseFloat((product.price || "0").replace(/[^0-9.-]+/g, ""));
        if (isNaN(price)) return;
        const itemTotal = price * item.quantity;
        total += itemTotal;

        cartItemsContainer.innerHTML += `
          <tr class="cart-item" data-product-id="${product.id}">
            <td><img src="${product.images[0].url}" alt="${product.name}" /><span>${product.name}</span></td>
            <td>$${price.toFixed(2)}</td>
            <td><input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateQuantity(${product.id}, this.value)"/></td>
            <td>$${itemTotal.toFixed(2)}</td>
            <td><button class="remove-btn" onclick="removeFromCart(${product.id})">Remove</button></td>
          </tr>`;

        if (cartTotal) cartTotal.textContent = total.toFixed(2);
      })
      .catch(err => console.error("Error fetching product details:", err));
  });
}

window.updateQuantity = function (productId, quantity) {
  const parsedQuantity = parseInt(quantity);
  if (isNaN(parsedQuantity) || parsedQuantity < 1) return alert("Please enter a valid quantity.");

  cart = cart.map(item => item.id === productId ? { ...item, quantity: parsedQuantity } : item);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCartItems();
};

window.removeFromCart = function (productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCounter();
  displayCartItems();
  Swal.fire({ title: "Removed!", text: "The product has been removed from your cart.", icon: "success", confirmButtonColor: "#fd5d5c" });
};

function openCheckoutModal() {
  if (cart.length === 0) {
    Swal.fire({ title: "Cart is Empty!", text: "Add some products before proceeding to checkout.", icon: "warning", confirmButtonColor: "#fd5d5c" });
    return;
  }
  const modal = document.getElementById("checkout-modal");
  if (modal) modal.style.display = "flex";
}

function closeCheckoutModal() {
  const modal = document.getElementById("checkout-modal");
  if (modal) modal.style.display = "none";
}

async function confirmPurchase() {
  try {
    const customerId = localStorage.getItem("currentCustomerId");
    if (!customerId) throw new Error("Customer ID not found in local storage.");
    const customer = await fetch(`http://localhost:3000/users/${customerId}`).then(res => res.json());

    const orderProducts = [];
    let total = 0;

    await Promise.all(cart.map(async item => {
      const product = await fetch(`http://localhost:3000/products/${item.id}`).then(res => res.json());
      const price = parseFloat((product.price || "0").replace(/[^0-9.-]+/g, ""));
      if (isNaN(price)) return;

      orderProducts.push({ productID: item.id, quantity: item.quantity, price: price.toFixed(2), sellerId: product.sellerId });
      total += price * item.quantity;
    }));

    const orders = await fetch("http://localhost:3000/orders").then(res => res.json());
    const newOrderId = orders.length ? Math.max(...orders.map(order => order.id)) + 1 : 1;

    const order = {
      id: newOrderId,
      customerName: customer.name,
      customerEmail: customer.email,
      products: orderProducts,
      address: customer.address,
      date: new Date().toLocaleString(),
      total: total.toFixed(2),
      status: "Pending"
    };
    
    await fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    });

    localStorage.removeItem("cart");
    updateCartCounter();
    closeCheckoutModal();

    Swal.fire({ title: "Order Placed!", text: "Your order has been placed successfully.", icon: "success", confirmButtonColor: "#fd5d5c" })
      .then(() => window.location.href = "orders.html");
  } catch (error) {
    console.error("Error saving order:", error);
    Swal.fire({ title: "Error!", text: error.message || "Failed to place the order.", icon: "error", confirmButtonColor: "#fd5d5c" });
  }
}

window.addEventListener("load", () => {
  updateCartCounter();
  displayCartItems();
});