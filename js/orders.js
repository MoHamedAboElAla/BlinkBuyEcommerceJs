import { Product } from './models/Product.js';
import { Order } from './models/Order.js';

// === Utilities ===
function parseFloatSafe(value) {
  return parseFloat(value || "0");
}

// === API Calls ===
async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch: ${url}`);
  return response.json();
}

async function getMaxOrderId() {
  try {
    const orders = await fetchJSON("http://localhost:3000/orders");
    const maxId = orders.length ? Math.max(...orders.map(o => o.id)) : 0;
    return String(maxId + 1);
  } catch (error) {
    console.error("Error getting max order ID:", error);
    throw error;
  }
}

async function fetchUserData(userId) {
  return await fetchJSON(`http://localhost:3000/users/${userId}`);
}

async function postOrder(newOrder) {
  const response = await fetch("http://localhost:3000/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newOrder),
  });
  if (!response.ok) throw new Error("Failed to create order.");
}
// === Order Display ===
async function displayOrders() {
  const ordersList = document.querySelector(".orders-list");
  ordersList.innerHTML = "";

  try {
    const orders = await fetchJSON("http://localhost:3000/orders");

    if (orders.length === 0) {
      ordersList.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center;">No orders found.</td>
        </tr>`;
      return;
    }

    for (const order of orders) {
      const productDetails = await Promise.all(
        order.products.map(async (product) => {
          const p = await Product.fetchById(product.productID);
          return `${p.name} (Qty: ${product.quantity}, Price: $${product.price})`;
        })
      );
      ordersList.innerHTML += `
        <tr class="order-item" data-order-id="${order.id}">
          <td>${order.id}</td>
          <td>${order.date}</td>
          <td>${order.customerName}</td>
          <td>${productDetails.join(", ")}</td>
          <td>$${parseFloat(order.total).toFixed(2)}</td>
          <td><span class="status ${order.status.toLowerCase()}">${order.status}</span></td>
        </tr>`;
    }

  } catch (error) {
    console.error("Error displaying orders:", error);
    ordersList.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center;">Failed to load orders.</td>
      </tr>`;
  }
}
// === Order Form Handling ===
async function handleOrderSubmit(event) {
  event.preventDefault();

  try {
    const userId = localStorage.getItem("currentCustomerId");
    const userData = await fetchUserData(userId);

    const newOrder = {
      id: await getMaxOrderId(),
      customerName: userData.name,
      customerEmail: userData.email,
      products: [
        {
          productID: "35", // dynamic value if needed
          quantity: 3,
          price: 100,
          sellerId: localStorage.getItem("currentUserId"),
        }
      ],
      address: document.querySelector("#address").value,
      date: new Date().toLocaleString(),
      total: parseFloatSafe(document.querySelector("#total").value).toFixed(2),
      status: document.querySelector("#status").value,
    };

    await postOrder(newOrder);
    await displayOrders();
    event.target.reset();
  } catch (error) {
    console.error("Order submission failed:", error);
  }
}

window.addEventListener("load", displayOrders);
document.querySelector("#order-form").addEventListener("submit", handleOrderSubmit);
