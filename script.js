
"use strict";

/*
  BERRY'S NAILS COLLECTIONS
  Frontend shopping cart and order-request system.

  IMPORTANT:
  1. Replace the WhatsApp number in CONFIG with the business number.
  2. Confirm your actual product prices before publishing.
  3. Product images are external demonstration images.
*/

const CONFIG = {
  // International format, numbers only. Example: 2348012345678
  whatsappNumber: "2349036525379",
  currency: "NGN",
  storageKey: "berrysNailsCartV1"
};

const products = [
  { id: 1, name: "Berry Blush", category: "classic", price: 8500, badge: "BESTSELLER", desc: "Soft pink, glossy almond elegance.", shape: "Almond", color: "#e8b2c4" },
  { id: 2, name: "French Kiss", category: "french", price: 9000, badge: "CLASSIC", desc: "Timeless French tips with a modern finish.", shape: "Almond", color: "#f4e2dc" },
  { id: 3, name: "Midnight Berry", category: "bold", price: 10000, badge: "SIGNATURE", desc: "Deep berry tones for a bold statement.", shape: "Coffin", color: "#63243f" },
  { id: 4, name: "Golden Hour", category: "glam", price: 12000, badge: "GLAM", desc: "Champagne shimmer with golden accents.", shape: "Coffin", color: "#d8b56c" },
  { id: 5, name: "Milky Nude", category: "classic", price: 7500, badge: "", desc: "Minimal, clean and effortlessly chic.", shape: "Oval", color: "#ead5c8" },
  { id: 6, name: "Pink Champagne", category: "glam", price: 11500, badge: "GLAM", desc: "Rosy shimmer for special occasions.", shape: "Almond", color: "#dfa2ba" },
  { id: 7, name: "Ruby Crush", category: "bold", price: 10000, badge: "", desc: "A rich red set with glossy shine.", shape: "Coffin", color: "#a92745" },
  { id: 8, name: "Cloud Nine", category: "classic", price: 8000, badge: "", desc: "A delicate milky-white finish.", shape: "Oval", color: "#f2e9e5" },
  { id: 9, name: "Chrome Queen", category: "glam", price: 13500, badge: "STATEMENT", desc: "Reflective metallic details.", shape: "Almond", color: "#b8a2b8" },
  { id: 10, name: "Mocha Muse", category: "classic", price: 8500, badge: "", desc: "Warm mocha shades with a polished finish.", shape: "Oval", color: "#956954" },
  { id: 11, name: "Buttercream", category: "bold", price: 8500, badge: "TRENDING", desc: "A playful soft-yellow manicure.", shape: "Square", color: "#e9d87e" },
  { id: 12, name: "Emerald Affair", category: "bold", price: 11000, badge: "", desc: "Elegant deep green statement nails.", shape: "Coffin", color: "#31594c" },
  { id: 13, name: "Rose Gold Dust", category: "glam", price: 12500, badge: "GLAM", desc: "Rose-gold sparkle for your next event.", shape: "Almond", color: "#c58c8f" },
  { id: 14, name: "Classic White Tip", category: "french", price: 8500, badge: "", desc: "A crisp French manicure with clean lines.", shape: "Square", color: "#eee5dc" },
  { id: 15, name: "Lilac Dream", category: "bold", price: 9000, badge: "", desc: "Soft lilac with a dreamy glossy finish.", shape: "Almond", color: "#bba6dc" },
  { id: 16, name: "Black Tie", category: "bold", price: 10500, badge: "SIGNATURE", desc: "Sleek black nails for a striking look.", shape: "Coffin", color: "#28252d" },
  { id: 17, name: "Pearl Princess", category: "glam", price: 14000, badge: "LUXE", desc: "Pearlescent finish with delicate accents.", shape: "Almond", color: "#e6d9d6" },
  { id: 18, name: "Caramel Swirl", category: "classic", price: 9500, badge: "", desc: "Warm caramel tones with a swirl effect.", shape: "Oval", color: "#c28a60" },
  { id: 19, name: "Ocean Blue", category: "bold", price: 9500, badge: "", desc: "Rich blue shades for standout styling.", shape: "Coffin", color: "#4479b6" },
  { id: 20, name: "The Berry Luxe", category: "glam", price: 15000, badge: "PREMIUM", desc: "A premium berry-toned statement set.", shape: "Almond", color: "#81244e" }
];

// Demonstration images. Replace with real photos of your own nail sets
// for the final published website.
const imagePool = [
  "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=700&q=80"
];

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: CONFIG.currency,
  maximumFractionDigits: 0
});

const $ = (selector) => document.querySelector(selector);

const productGrid = $("#productGrid");
const cartOverlay = $("#cartOverlay");
const cartItems = $("#cartItems");
const cartCount = $("#cartCount");
const cartSubtotal = $("#cartSubtotal");

let cart = loadCart();
let customRequests = [];

// Save and restore shopping cart in this browser.
function loadCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(CONFIG.storageKey) || "[]");
    if (!Array.isArray(stored)) return [];

    return stored.filter(item =>
      item &&
      (products.some(product => product.id === item.id) || item.id === "custom") &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0
    ).map(item => ({
      id: item.id,
      quantity: Math.min(item.quantity, 99),
      ...(item.id === "custom" ? { details: item.details || {} } : {})
    }));
  } catch {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(cart));
  } catch {
    // The cart still works for this page session if storage is unavailable.
  }
}

function getProduct(id) {
  return products.find(product => product.id === id);
}

function getCartEntryPrice(item) {
  if (item.id === "custom") {
    return Number(item.details?.price) || 0;
  }

  return getProduct(item.id)?.price || 0;
}

function cartTotal() {
  return cart.reduce((sum, item) =>
    sum + getCartEntryPrice(item) * item.quantity, 0);
}

function cartQuantity() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Build the product grid.
function renderProducts() {
  const search = $("#searchInput").value.trim().toLowerCase();
  const category = $("#categoryFilter").value;
  const sort = $("#sortFilter").value;

  let visible = products.filter(product => {
    const matchesSearch =
      `${product.name} ${product.desc} ${product.category}`
        .toLowerCase().includes(search);

    const matchesCategory =
      category === "all" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  if (sort === "low") visible.sort((a, b) => a.price - b.price);
  if (sort === "high") visible.sort((a, b) => b.price - a.price);
  if (sort === "name") visible.sort((a, b) => a.name.localeCompare(b.name));

  $("#productTotal").textContent =
    `${visible.length} design${visible.length === 1 ? "" : "s"}`;

  if (visible.length === 0) {
    productGrid.innerHTML =
      '<p class="empty-results">No designs found. Try another search.</p>';
    return;
  }

  productGrid.innerHTML = visible.map(product => {
    const image = imagePool[(product.id - 1) % imagePool.length];

    return `
      <article class="product-card">
        <div class="product-image-wrap">
          <img
            class="product-image"
            src="${image}"
            alt="${product.name} press-on nail design"
            loading="lazy"
            onerror="this.style.display='none';this.parentElement.style.background='${product.color}'"
          >
          ${product.badge
            ? `<span class="product-badge">${product.badge}</span>`
            : ""}
          <button class="quick-add" data-add="${product.id}">
            + Add to bag
          </button>
        </div>
        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <h3>${product.name}</h3>
          <p class="product-description">${product.desc}</p>
          <div class="product-bottom">
            <span class="product-price">${money.format(product.price)}</span>
            <button data-add="${product.id}" aria-label="Add ${product.name} to bag">
              Add +
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// Add products or custom requests to the cart.
function addToCart(id, details = null) {
  const existing = cart.find(item =>
    item.id === id &&
    (id !== "custom" || JSON.stringify(item.details) === JSON.stringify(details))
  );

  if (existing) {
    if (existing.quantity >= 99) {
      alert("Maximum quantity per cart line is 99.");
      return;
    }
    existing.quantity += 1;
  } else {
    cart.push({
      id,
      quantity: 1,
      ...(id === "custom" ? { details } : {})
    });
  }

  saveCart();
  renderCart();
  openCart();
}

function changeQuantity(index, delta) {
  const item = cart[index];
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    cart.splice(index, 1);
  } else {
    item.quantity = Math.min(item.quantity, 99);
  }

  saveCart();
  renderCart();
}

function removeCartItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function renderCart() {
  cartCount.textContent = cartQuantity();
  cartSubtotal.textContent = money.format(cartTotal());

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <p style="font-size:32px">♡</p>
        <strong>Your bag is waiting for something beautiful.</strong>
        <p>Add your favourite nail sets to get started.</p>
      </div>`;
    $("#checkoutButton").disabled = true;
    return;
  }

  $("#checkoutButton").disabled = false;

  cartItems.innerHTML = cart.map((item, index) => {
    const product = item.id === "custom" ? null : getProduct(item.id);
    const title = product ? product.name : "Custom nail request";
    const image = product
      ? imagePool[(product.id - 1) % imagePool.length]
      : "";

    const details = product
      ? product.shape
      : `${item.details?.shape || ""} · ${item.details?.length || ""}`;

    const price = getCartEntryPrice(item);

    return `
      <article class="cart-item">
        ${product
          ? `<img src="${image}" alt="${title}">`
          : `<div style="display:grid;place-items:center;background:#f7e7ed;color:#81244e;font-size:26px">✧</div>`
        }
        <div>
          <h4>${title}</h4>
          <p>${price > 0 ? money.format(price) : "Price to be confirmed"}</p>
          <small>${escapeHTML(details)}</small>
          ${item.id === "custom"
            ? `<small style="display:block">Sizing details included in order message.</small>`
            : ""}
          <div class="cart-item-actions">
            <button data-qty="${index}" data-delta="-1" aria-label="Decrease quantity">−</button>
            <span>${item.quantity}</span>
            <button data-qty="${index}" data-delta="1" aria-label="Increase quantity">+</button>
            <button class="remove-item" data-remove="${index}">Remove</button>
          </div>
        </div>
        <strong style="font-size:12px">
          ${price > 0 ? money.format(price * item.quantity) : "TBC"}
        </strong>
      </article>
    `;
  }).join("");
}

function openCart() {
  cartOverlay.hidden = false;
  document.body.classList.add("cart-open");
  $("#closeCart").focus();
}

function closeCart() {
  cartOverlay.hidden = true;
  document.body.classList.remove("cart-open");
  $("#openCart").focus();
}

// Avoid inserting customer-entered text as HTML.
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

// Create the ten measurement inputs.
const fingers = [
  { key: "leftThumb", label: "L Thumb" },
  { key: "leftIndex", label: "L Index" },
  { key: "leftMiddle", label: "L Middle" },
  { key: "leftRing", label: "L Ring" },
  { key: "leftPinky", label: "L Pinky" },
  { key: "rightThumb", label: "R Thumb" },
  { key: "rightIndex", label: "R Index" },
  { key: "rightMiddle", label: "R Middle" },
  { key: "rightRing", label: "R Ring" },
  { key: "rightPinky", label: "R Pinky" }
];

$("#measurementGrid").innerHTML = fingers.map(finger => `
  <div class="measurement-cell">
    <strong>${finger.label}</strong>
    <label for="${finger.key}Width">Width</label>
    <input id="${finger.key}Width" name="${finger.key}Width"
      type="number" min="3" max="40" step="0.1"
      placeholder="mm" required>
    <label for="${finger.key}Length">Length</label>
    <input id="${finger.key}Length" name="${finger.key}Length"
      type="number" min="3" max="50" step="0.1"
      placeholder="mm">
  </div>
`).join("");

// Add a custom request. The customer must provide all ten widths.
$("#customForm").addEventListener("submit", event => {
  event.preventDefault();

  const measurements = {};

  for (const finger of fingers) {
    const width = Number($(`#${finger.key}Width`).value);
    const lengthValue = $(`#${finger.key}Length`).value.trim();
    const length = lengthValue === "" ? null : Number(lengthValue);

    if (!Number.isFinite(width) || width < 3 || width > 40) {
      alert(`Please enter a valid width for ${finger.label}, between 3 and 40 mm.`);
      $(`#${finger.key}Width`).focus();
      return;
    }

    if (length !== null && (!Number.isFinite(length) || length < 3 || length > 50)) {
      alert(`Please enter a valid length for ${finger.label}, between 3 and 50 mm.`);
      $(`#${finger.key}Length`).focus();
      return;
    }

    measurements[finger.label] = { width, length };
  }

  const budgetValue = $("#customBudget").value.trim();
  const budget = budgetValue === "" ? null : Number(budgetValue);

  if (budget !== null && (!Number.isFinite(budget) || budget < 0)) {
    alert("Please enter a valid custom budget.");
    return;
  }

  const details = {
    shape: $("#customShape").value,
    length: $("#customLength").value,
    design: $("#customDesign").value.trim(),
    budget,
    measurements,
    // Custom pricing is not automatically determined.
    price: 0
  };

  addToCart("custom", details);
  $("#customForm").reset();
  $("#customShape").value = "Almond";
  $("#customLength").value = "Medium";
});

// Search and filters.
$("#searchInput").addEventListener("input", renderProducts);
$("#categoryFilter").addEventListener("change", renderProducts);
$("#sortFilter").addEventListener("change", renderProducts);

// Product add buttons.
productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  addToCart(Number(button.dataset.add));
});

// Quantity and removal controls.
cartItems.addEventListener("click", event => {
  const quantityButton = event.target.closest("[data-qty]");
  const removeButton = event.target.closest("[data-remove]");

  if (quantityButton) {
    changeQuantity(
      Number(quantityButton.dataset.qty),
      Number(quantityButton.dataset.delta)
    );
  }

  if (removeButton) {
    removeCartItem(Number(removeButton.dataset.remove));
  }
});

// Drawer controls.
$("#openCart").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#overlayDismiss").addEventListener("click", closeCart);
$("#continueShopping").addEventListener("click", closeCart);

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !cartOverlay.hidden) closeCart();
});

// Mobile navigation.
$("#menuToggle").addEventListener("click", () => {
  const navigation = $("#navigation");
  const isOpen = navigation.classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded", String(isOpen));
});

$("#navigation").addEventListener("click", event => {
  if (event.target.closest("a")) {
    $("#navigation").classList.remove("open");
    $("#menuToggle").setAttribute("aria-expanded", "false");
  }
});

// Prepare WhatsApp order text.
function createOrderMessage() {
  const lines = [
    "Hello Berry's Nails Collections! 💅",
    "",
    "I would like to place an order:",
    ""
  ];

  cart.forEach((item, index) => {
    const product = item.id === "custom" ? null : getProduct(item.id);

    if (product) {
      lines.push(
        `${index + 1}. ${product.name} x ${item.quantity} — ${money.format(product.price * item.quantity)}`
      );
      lines.push(`   Preferred shape: ${product.shape}`);
    } else {
      const d = item.details;
      lines.push(`${index + 1}. Custom nail request x ${item.quantity}`);
      lines.push(`   Shape: ${d.shape}`);
      lines.push(`   Length: ${d.length}`);

      if (d.design) lines.push(`   Design: ${d.design}`);
      if (d.budget !== null) lines.push(`   Budget: ${money.format(d.budget)}`);

      lines.push("   Measurements (mm):");

      Object.entries(d.measurements).forEach(([finger, measurement]) => {
        lines.push(
          `   ${finger}: width ${measurement.width} mm` +
          (measurement.length !== null
            ? `, length ${measurement.length} mm`
            : "")
        );
      });

      lines.push("   Custom price: Please confirm before payment.");
    }

    lines.push("");
  });

  lines.push(`Product subtotal: ${money.format(cartTotal())}`);
  lines.push("Please confirm availability, delivery charges and final total.");
  lines.push("");
  lines.push("Please let me know the next steps for completing my order.");

  return lines.join("\n");
}

$("#checkoutButton").addEventListener("click", () => {
  if (cart.length === 0) return;

  if (!/^234\d{10}$/.test(CONFIG.whatsappNumber)) {
    alert("Please configure the correct business WhatsApp number in script.js before taking orders.");
    return;
  }

  const message = createOrderMessage();
  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");
});

// Appointment requests are sent to the business WhatsApp for confirmation.
const appointmentDateInput = $("#appointmentDate");
if (appointmentDateInput) {
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString().slice(0, 10);
  appointmentDateInput.min = localToday;
}

$("#appointmentForm").addEventListener("submit", event => {
  event.preventDefault();

  if (!/^234\d{10}$/.test(CONFIG.whatsappNumber)) {
    alert("Please configure the correct business WhatsApp number in script.js before taking appointment requests.");
    return;
  }

  const name = $("#appointmentName").value.trim();
  const phone = $("#appointmentPhone").value.trim();
  const type = $("#appointmentType").value;
  const date = $("#appointmentDate").value;
  const time = $("#appointmentTime").value;
  const notes = $("#appointmentNotes").value.trim();

  if (!name || !phone || !type || !date || !time) {
    alert("Please complete all required appointment details.");
    return;
  }

  const dateObject = new Date(`${date}T00:00:00`);
  const formattedDate = dateObject.toLocaleDateString("en-NG", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
  const [hourString, minute] = time.split(":");
  const hour = Number(hourString);
  const displayHour = hour % 12 || 12;
  const period = hour >= 12 ? "PM" : "AM";
  const formattedTime = `${displayHour}:${minute} ${period}`;

  const message = [
    "Hello Berry's Nails Collections! 💅",
    "",
    "I'd like to request a nail appointment.",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Service: ${type}`,
    `Preferred date: ${formattedDate}`,
    `Preferred time: ${formattedTime}`,
    ...(notes ? [`Additional notes: ${notes}`] : []),
    "",
    "Please confirm if this date and time are available and let me know any next steps.",
    "I understand this appointment is not confirmed until you reply."
  ].join("\n");

  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
});

// Footer links and initial page setup.
$("#year").textContent = new Date().getFullYear();

$("#footerWhatsApp").href =
  `https://wa.me/${CONFIG.whatsappNumber}`;

renderProducts();
renderCart();