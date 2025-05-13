function toggleSidebar() {
  const sidebar = document.getElementById("products-sidebar");
  sidebar.classList.toggle("active");
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  saveCart(cart);
  alert(`${product.name} added to cart`);
}

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".add-to-cart");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const productElement = btn.closest(".product");
      const id = productElement.getAttribute("prod_id");
      const name = productElement.querySelector("h3").innerText;
      const priceText = productElement.querySelector(".price").innerText;
      const price = parseInt(priceText.replace(/[^\d]/g, ""), 10);

      const img = productElement.querySelector("img").src;

      const product = { id, name, price, img };
      addToCart(product);
    });
  });

  if (window.location.pathname.includes("cart.html")) {
    loadCartItems();
    const clearBtn = document.querySelector(".clear-cart-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear your cart?")) {
          localStorage.removeItem("cart");
          loadCartItems();
        }
      });
    }
  }
});

function loadCartItems() {
  const cartItemsContainer = document.getElementById("cartItems");
  const subtotalSpan = document.getElementById("subtotal");
  const totalSpan = document.getElementById("total");
  const shipping = 100;

  const cart = getCart();
  let subtotal = 0;

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cart.forEach((item, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("cart-item");

      itemDiv.innerHTML = `
        <img src="${item.img}" alt="${item.name}" class="cart-img" />
        <div class="cart-info">
          <h4>${item.name}</h4>
          <p>Ksh. ${(item.price * item.quantity).toLocaleString()}</p>
          <div class="qty-controls">
            <button class="decrease" data-index="${index}">−</button>
            <span class="quantity">${item.quantity}</span>
            <button class="increase" data-index="${index}">+</button>
          </div>
        </div>
      `;

      cartItemsContainer.appendChild(itemDiv);
      subtotal += item.price * item.quantity;
    });
  }

  subtotalSpan.innerText = `Ksh. ${subtotal.toLocaleString()}`;
  totalSpan.innerText = `Ksh. ${(subtotal + shipping).toLocaleString()}`;

  document.querySelectorAll(".increase").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.getAttribute("data-index");
      cart[index].quantity += 1;
      saveCart(cart);
      loadCartItems();
    });
  });

  document.querySelectorAll(".decrease").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.getAttribute("data-index");
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
      } else {
        cart.splice(index, 1);
      }
      saveCart(cart);
      loadCartItems();
    });
  });
}
