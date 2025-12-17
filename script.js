// category selection menu bar

// product contents to be displayed on the page
var allHeader = document.querySelector("#shop-all");
var racquets = document.querySelector(".racquets");
var shoes = document.querySelector(".shoes");
var shuttlecocks = document.querySelector(".shuttlecocks");

// function clears the main element of all categories
function clear() {
  var content = document.querySelector("main");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
}

// function for filtering display based on the category clicked on the menu bar
function menuSelection(choice, display) {
  document.querySelector(choice).addEventListener("click", function () {
    clear();
    document.querySelector("main").appendChild(display);
  });
}

// if racquets is clicked, only display racquet products
menuSelection("#racquets-category", racquets);

// if shoes is clicked, only display shoes products
menuSelection("#shoes-category", shoes);

// if shuttlecocks is clicked, display only shuttlecocks
menuSelection("#shuttlecocks-category", shuttlecocks);

// if shop all is clicked, display all item categories
document.querySelector("#all-categories").addEventListener("click", function () {
  clear();
  document.querySelector("main").appendChild(allHeader);
  document.querySelector("main").appendChild(racquets);
  document.querySelector("main").appendChild(shoes);
  document.querySelector("main").appendChild(shuttlecocks);
});

// addToCart
// addToCart + efek tombol
function addToCart(btn, nama, harga, gambar) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItem = cart.find((item) => item.nama === nama);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      nama,
      harga,
      gambar,
      qty: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  // EFEK TOMBOL
  const originalText = btn.innerText;

  btn.innerText = "✓ Berhasil Ditambahkan";
  btn.disabled = true;
  btn.classList.add("ditambahkan");

  setTimeout(() => {
    btn.innerText = originalText;
    btn.disabled = false;
    btn.classList.remove("ditambahkan");
  }, 1500);
}

//
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.getElementById("cart-count").innerText = cart.length;
}

function toggleCart() {
  let popup = document.getElementById("cart-popup");
  popup.style.display = popup.style.display === "block" ? "none" : "block";
  renderCart();
}

function closeCart() {
  document.getElementById("cart-popup").style.display = "none";
}

function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.harga * item.qty;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <img src="${item.gambar}" alt="${item.nama}">
      <div class="cart-info">
        <strong>${item.nama}</strong>
        <span>Rp ${item.harga.toLocaleString("id-ID")}</span>
        <div class="qty-control">
          <button onclick="changeQty(${index}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${index}, 1)">+</button>
        </div>
      </div>
      <button class="remove-btn" onclick="removeItem(${index})">✕</button>
    `;

    cartItems.appendChild(div);
  });

  cartTotal.innerText = "Rp " + total.toLocaleString("id-ID");
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

function changeQty(index, change) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart[index].qty += change;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

window.onload = function () {
  updateCartCount();
};

document.addEventListener("DOMContentLoaded", () => {
  const menuMap = {
    "all-categories": "shop-all",
    "racquets-category": "racquets",
    "shoes-category": "shoes",
    "shuttlecocks-category": "shuttlecocks",
  };

  // CLICK EFFECT
  Object.keys(menuMap).forEach((menuId) => {
    const menuItem = document.getElementById(menuId);
    const section = document.getElementById(menuMap[menuId]);

    if (!menuItem || !section) return;

    menuItem.addEventListener("click", () => {
      window.scrollTo({
        top: section.offsetTop - 120,
        behavior: "smooth",
      });

      setActive(menuItem);
    });
  });

  // SCROLL EFFECT
  window.addEventListener("scroll", () => {
    let currentSection = "";

    Object.values(menuMap).forEach((id) => {
      const section = document.getElementById(id);
      if (window.scrollY >= section.offsetTop - 140) {
        currentSection = id;
      }
    });

    Object.entries(menuMap).forEach(([menuId, sectionId]) => {
      const menuItem = document.getElementById(menuId);
      if (sectionId === currentSection) {
        setActive(menuItem);
      }
    });
  });

  function setActive(activeItem) {
    document.querySelectorAll(".menu-bar li").forEach((li) => li.classList.remove("active"));

    activeItem.classList.add("active");
  }
});

/* =============================
   js IMPROVEMENT - 
   ============================= */
document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("search-btn");
  const searchInput = document.getElementById("search-input");
  const categories = document.querySelectorAll(".racquets, .shoes, .shuttlecocks");

  // toggle input search
  searchBtn.addEventListener("click", () => {
    searchInput.classList.toggle("show");
    searchInput.focus();
  });

  // tekan ENTER
  searchInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const keyword = searchInput.value.toLowerCase().trim();
    if (!keyword) return;

    // 1️⃣ reset dulu SEMUA kategori
    categories.forEach((cat) => {
      cat.style.display = "block";
      cat.classList.remove("highlight");
    });

    // 2️⃣ cari kategori
    let target = null;
    categories.forEach((cat) => {
      const title = cat.querySelector("h2").innerText.toLowerCase();
      if (title.includes(keyword) && !target) {
        target = cat;
      }
    });

    // 3️⃣ scroll ke kategori
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // 4️⃣ highlight sebentar
      target.classList.add("highlight");
      setTimeout(() => {
        target.classList.remove("highlight");
      }, 1500);
    } else {
      alert("Kategori tidak ditemukan");
    }
  });
});

/* =============================
   js IMPROVEMENT subscribe- 
   ============================= */
const subscribeForm = document.getElementById("subscribeForm");
const successMsg = document.getElementById("subscribe-success");

subscribeForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(subscribeForm);

  const response = await fetch(subscribeForm.action, {
    method: subscribeForm.method,
    body: formData,
    headers: {
      Accept: "application/json",
    },
  });

  if (response.ok) {
    subscribeForm.reset();
    successMsg.style.display = "block";
  }
});
