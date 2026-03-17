const CART_KEY = "onlinepetite_cart_v2";
const PROMO_KEY = "onlinepetite_promo_v2";
const FREE_SHIPPING_FROM = 120000;
const BASE_SHIPPING = 2500;

const state = {
  search: "",
  category: "all",
  size: "all",
  color: "all",
  maxPrice: 150000,
  sort: "popular"
};

function formatPrice(price) {
  return new Intl.NumberFormat("ru-RU").format(price) + " ₸";
}

function getDiscountedPrice(product) {
  if (!product.discount) return product.price;
  return Math.round(product.price * (1 - product.discount / 100));
}

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateHeaderCartCount();
}

function getPromo() {
  return JSON.parse(localStorage.getItem(PROMO_KEY)) || null;
}

function savePromo(promo) {
  localStorage.setItem(PROMO_KEY, JSON.stringify(promo));
}

function clearPromo() {
  localStorage.removeItem(PROMO_KEY);
}

function updateHeaderCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("#headerCartCount").forEach((el) => {
    el.textContent = count;
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function getCategoryList() {
  return [...new Set(PRODUCTS.map((item) => item.category))];
}

function getColorList() {
  return [...new Set(PRODUCTS.flatMap((item) => item.colors.map((c) => c.name)))];
}

function productIdentity(productId, color, size) {
  return `${productId}__${color}__${size}`;
}

function addToCart(productId, color, size) {
  const cart = getCart();
  const product = PRODUCTS.find((item) => item.id === productId);
  if (!product) return;

  const finalPrice = getDiscountedPrice(product);
  const identity = productIdentity(productId, color, size);
  const existing = cart.find((item) => item.identity === identity);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      identity,
      productId,
      name: product.name,
      category: product.category,
      color,
      size,
      price: finalPrice,
      quantity: 1
    });
  }

  saveCart(cart);
  showToast(`Добавлено в корзину: ${product.name}`);
}

function removeFromCart(identity) {
  const cart = getCart().filter((item) => item.identity !== identity);
  saveCart(cart);
  renderCartPage();
}

function changeCartQty(identity, delta) {
  const cart = getCart();
  const item = cart.find((el) => el.identity === identity);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    const filtered = cart.filter((el) => el.identity !== identity);
    saveCart(filtered);
  } else {
    saveCart(cart);
  }

  renderCartPage();
}

function clearCart() {
  saveCart([]);
  clearPromo();
  renderCartPage();
}

function initCatalogPage() {
  const productsGrid = document.getElementById("productsGrid");
  if (!productsGrid || typeof PRODUCTS === "undefined") return;

  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const sizeFilter = document.getElementById("sizeFilter");
  const colorFilter = document.getElementById("colorFilter");
  const sortFilter = document.getElementById("sortFilter");
  const priceRange = document.getElementById("priceRange");
  const priceRangeValue = document.getElementById("priceRangeValue");
  const resetFiltersBtn = document.getElementById("resetFiltersBtn");

  getCategoryList().forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  getColorList().forEach((color) => {
    const option = document.createElement("option");
    option.value = color;
    option.textContent = color;
    colorFilter.appendChild(option);
  });

  function renderProducts() {
    const resultsInfo = document.getElementById("resultsInfo");

    let items = PRODUCTS.filter((product) => {
      const discounted = getDiscountedPrice(product);

      const matchSearch =
        product.name.toLowerCase().includes(state.search.toLowerCase()) ||
        product.description.toLowerCase().includes(state.search.toLowerCase());

      const matchCategory = state.category === "all" || product.category === state.category;
      const matchSize = state.size === "all" || product.sizes.includes(state.size);
      const matchColor =
        state.color === "all" ||
        product.colors.some((color) => color.name === state.color);
      const matchPrice = discounted <= state.maxPrice;

      return matchSearch && matchCategory && matchSize && matchColor && matchPrice;
    });

    if (state.sort === "price-asc") {
      items.sort((a, b) => getDiscountedPrice(a) - getDiscountedPrice(b));
    } else if (state.sort === "price-desc") {
      items.sort((a, b) => getDiscountedPrice(b) - getDiscountedPrice(a));
    } else if (state.sort === "new") {
      items.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    } else if (state.sort === "sale") {
      items.sort((a, b) => b.discount - a.discount);
    } else {
      items.sort((a, b) => b.rating - a.rating);
    }

    resultsInfo.textContent = `Найдено товаров: ${items.length}`;

    if (items.length === 0) {
      productsGrid.innerHTML = `
        <div class="empty-products">
          <h3>Ничего не найдено</h3>
          <p>Попробуй изменить фильтры или сбросить параметры.</p>
        </div>
      `;
      return;
    }

    productsGrid.innerHTML = items
      .map((product) => {
        const finalPrice = getDiscountedPrice(product);
        const mainColor = product.colors[0]?.hex || "#e5e7eb";

        return `
          <article class="product-card" data-product-id="${product.id}">
            <div class="product-cover" style="background: linear-gradient(135deg, ${mainColor}, #ffffff);">
              <div class="product-cover-tag">${product.category}</div>
              <div class="product-cover-title">${product.name}</div>
            </div>

            <div class="product-body">
              <div class="product-meta">
                <div class="product-badges">
                  ${product.isNew ? `<span class="badge badge-new">NEW</span>` : ""}
                  ${product.discount ? `<span class="badge badge-sale">-${product.discount}%</span>` : ""}
                </div>
                <span class="rating">★ ${product.rating}</span>
              </div>

              <h3 class="product-title">${product.name}</h3>
              <p class="product-desc">${product.description}</p>

              <div class="price-row">
                <strong class="current-price">${formatPrice(finalPrice)}</strong>
                ${product.discount ? `<span class="old-price">${formatPrice(product.price)}</span>` : ""}
              </div>

              <div class="option-block">
                <span class="option-title">Цвет</span>
                <div class="color-options">
                  ${product.colors
                    .map(
                      (color, index) => `
                        <button
                          type="button"
                          class="color-btn ${index === 0 ? "active" : ""}"
                          data-color="${color.name}"
                          title="${color.name}"
                          style="background:${color.hex};"
                        ></button>
                      `
                    )
                    .join("")}
                </div>
                <div class="selected-text">
                  Выбран цвет: <span class="selected-color">${product.colors[0].name}</span>
                </div>
              </div>

              <div class="option-block">
                <span class="option-title">Размер</span>
                <div class="size-options">
                  ${product.sizes
                    .map(
                      (size, index) => `
                        <button
                          type="button"
                          class="size-btn ${index === 0 ? "active" : ""}"
                          data-size="${size}"
                        >
                          ${size}
                        </button>
                      `
                    )
                    .join("")}
                </div>
              </div>

              <button type="button" class="btn btn-primary btn-full add-to-cart-btn">
                Добавить в корзину
              </button>
            </div>
          </article>
        `;
      })
      .join("");

    attachProductCardEvents();
  }

  function attachProductCardEvents() {
    document.querySelectorAll(".product-card").forEach((card) => {
      const productId = Number(card.dataset.productId);
      const colorButtons = card.querySelectorAll(".color-btn");
      const sizeButtons = card.querySelectorAll(".size-btn");
      const addBtn = card.querySelector(".add-to-cart-btn");
      const selectedColorText = card.querySelector(".selected-color");

      colorButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          colorButtons.forEach((item) => item.classList.remove("active"));
          btn.classList.add("active");
          selectedColorText.textContent = btn.dataset.color;
        });
      });

      sizeButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          sizeButtons.forEach((item) => item.classList.remove("active"));
          btn.classList.add("active");
        });
      });

      addBtn.addEventListener("click", () => {
        const selectedColor = card.querySelector(".color-btn.active")?.dataset.color;
        const selectedSize = card.querySelector(".size-btn.active")?.dataset.size;

        if (!selectedColor || !selectedSize) {
          showToast("Выбери цвет и размер");
          return;
        }

        addToCart(productId, selectedColor, selectedSize);
      });
    });
  }

  searchInput.addEventListener("input", (e) => {
    state.search = e.target.value.trim();
    renderProducts();
  });

  categoryFilter.addEventListener("change", (e) => {
    state.category = e.target.value;
    renderProducts();
  });

  sizeFilter.addEventListener("change", (e) => {
    state.size = e.target.value;
    renderProducts();
  });

  colorFilter.addEventListener("change", (e) => {
    state.color = e.target.value;
    renderProducts();
  });

  sortFilter.addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderProducts();
  });

  priceRange.addEventListener("input", (e) => {
    state.maxPrice = Number(e.target.value);
    priceRangeValue.textContent = formatPrice(state.maxPrice);
    renderProducts();
  });

  resetFiltersBtn.addEventListener("click", () => {
    state.search = "";
    state.category = "all";
    state.size = "all";
    state.color = "all";
    state.maxPrice = 150000;
    state.sort = "popular";

    searchInput.value = "";
    categoryFilter.value = "all";
    sizeFilter.value = "all";
    colorFilter.value = "all";
    sortFilter.value = "popular";
    priceRange.value = "150000";
    priceRangeValue.textContent = formatPrice(150000);

    renderProducts();
  });

  renderProducts();
}

function calculateCartSummary(cart) {
  const promo = getPromo();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discount = 0;
  let shipping = subtotal > 0 ? BASE_SHIPPING : 0;

  if (subtotal >= FREE_SHIPPING_FROM) {
    shipping = 0;
  }

  if (promo?.code === "STYLE10") {
    discount = Math.round(subtotal * 0.1);
  }

  if (promo?.code === "FREESHIP") {
    shipping = 0;
  }

  const total = Math.max(subtotal - discount + shipping, 0);

  return {
    count,
    subtotal,
    discount,
    shipping,
    total,
    promo
  };
}

function buildOrderText(cart, summary) {
  if (cart.length === 0) return "Корзина пустая";

  const lines = cart.map((item, index) => {
    const total = item.price * item.quantity;
    return `${index + 1}. ${item.name} | Цвет: ${item.color} | Размер: ${item.size} | ${item.quantity} шт. × ${formatPrice(item.price)} = ${formatPrice(total)}`;
  });

  lines.push("");
  lines.push(`Количество товаров: ${summary.count}`);
  lines.push(`Сумма: ${formatPrice(summary.subtotal)}`);
  lines.push(`Скидка: ${formatPrice(summary.discount)}`);
  lines.push(`Доставка: ${formatPrice(summary.shipping)}`);
  lines.push(`Итого: ${formatPrice(summary.total)}`);
  lines.push(`Промокод: ${summary.promo?.code || "нет"}`);

  return lines.join("\n");
}

function renderCartPage() {
  const cartContainer = document.getElementById("cartPageItems");
  if (!cartContainer) return;

  const cart = getCart();
  const summary = calculateCartSummary(cart);

  const summaryCount = document.getElementById("summaryCount");
  const summarySubtotal = document.getElementById("summarySubtotal");
  const summaryDiscount = document.getElementById("summaryDiscount");
  const summaryShipping = document.getElementById("summaryShipping");
  const summaryTotal = document.getElementById("summaryTotal");
  const shippingHint = document.getElementById("shippingHint");
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (summaryCount) summaryCount.textContent = summary.count;
  if (summarySubtotal) summarySubtotal.textContent = formatPrice(summary.subtotal);
  if (summaryDiscount) summaryDiscount.textContent = formatPrice(summary.discount);
  if (summaryShipping) summaryShipping.textContent = formatPrice(summary.shipping);
  if (summaryTotal) summaryTotal.textContent = formatPrice(summary.total);

  if (shippingHint) {
    if (summary.subtotal > 0 && summary.subtotal < FREE_SHIPPING_FROM && summary.shipping > 0) {
      shippingHint.textContent = `До бесплатной доставки осталось ${formatPrice(FREE_SHIPPING_FROM - summary.subtotal)}`;
    } else if (summary.subtotal >= FREE_SHIPPING_FROM || (summary.promo && summary.promo.code === "FREESHIP")) {
      shippingHint.textContent = "У тебя бесплатная доставка 🎉";
    } else {
      shippingHint.textContent = "";
    }
  }

  if (!checkoutBtn) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart">
        <h3>Корзина пуста</h3>
        <p>Добавь товары из каталога, чтобы оформить заказ.</p>
        <a hreftmlПерейти в каталог</a>
      </div>
    `;
    checkoutBtn.disabled = true;
    checkoutBtn.classList.add("disabled");
  } else {
    checkoutBtn.disabled = false;
    checkoutBtn.classList.remove("disabled");

    cartContainer.innerHTML = cart
      .map(
        (item) => `
          <article class="cart-item">
            <div class="cart-item-cover">${item.category}</div>

            <div class="cart-item-info">
              <h3>${item.name}</h3>
              <div class="cart-item-meta">
                <span>Цвет: <b>${item.color}</b></span>
                <span>Размер: <b>${item.size}</b></span>
              </div>
              <div class="cart-item-price">${formatPrice(item.price)}</div>
            </div>

            <div class="cart-item-actions">
              <div class="qty-control">
                <button type="button" class="qty<span>${item.quantity}</span>
                <button type="button"        </div>

              <strong class="line-total">${formatPrice(item.price * item.quantity)}</strong>

              <button type="button" class="remove-link     </button>
            </div>
          </article>
        `
      )
      .join("");
  }

  document.querySelectorAll("[data-action='minus']").forEach((btn) => {
    btn.addEventListener("click", () => changeCartQty(btn.dataset.identity, -1));
  });

  document.querySelectorAll("[data-action='plus']").forEach((btn) => {
    btn.addEventListener("click", () => changeCartQty(btn.dataset.identity, 1));
  });

  document.querySelectorAll("[data-action='remove']").forEach((btn) => {
    btn.addEventListener("click", () => removeFromCart(btn.dataset.identity));
  });

  const orderDataField = document.getElementById("orderDataField");
  const orderTotalField = document.getElementById("orderTotalField");
  const orderCountField = document.getElementById("orderCountField");
  const orderPromoField = document.getElementById("orderPromoField");

  if (orderDataField) orderDataField.value = buildOrderText(cart, summary);
  if (orderTotalField) orderTotalField.value = formatPrice(summary.total);
  if (orderCountField) orderCountField.value = String(summary.count);
  if (orderPromoField) orderPromoField.value = summary.promo?.code || "нет";
}

function initCartPage() {
  const cartContainer = document.getElementById("cartPageItems");
  if (!cartContainer) return;

  const applyPromoBtn = document.getElementById("applyPromoBtn");
  const promoInput = document.getElementById("promoInput");
  const promoMessage = document.getElementById("promoMessage");
  const clearCartBtn = document.getElementById("clearCartBtn");
  const checkoutForm = document.getElementById("checkoutForm");

  const currentPromo = getPromo();
  if (currentPromo && promoInput && promoMessage) {
    promoInput.value = currentPromo.code;
    promoMessage.textContent = `Промокод ${currentPromo.code} уже применён`;
    promoMessage.className = "promo-message success";
  }

  if (applyPromoBtn) {
    applyPromoBtn.addEventListener("click", () => {
      const code = promoInput.value.trim().toUpperCase();

      if (!code) {
        clearPromo();
        promoMessage.textContent = "Промокод очищен";
        promoMessage.className = "promo-message";
        renderCartPage();
        return;
      }

      if (code === "STYLE10") {
        savePromo({ code: "STYLE10" });
        promoMessage.textContent = "Промокод STYLE10 применён: скидка 10%";
        promoMessage.className = "promo-message success";
      } else if (code === "FREESHIP") {
        savePromo({ code: "FREESHIP" });
        promoMessage.textContent = "Промокод FREESHIP применён: доставка 0 ₸";
        promoMessage.className = "promo-message success";
      } else {
        clearPromo();
        promoMessage.textContent = "Промокод не найден";
        promoMessage.className = "promo-message error";
      }

      renderCartPage();
    });
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      clearCart();
      showToast("Корзина очищена");
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      const cart = getCart();

      if (cart.length === 0) {
        e.preventDefault();
        showToast("Корзина пустая");
        return;
      }

      setTimeout(() => {
        saveCart([]);
        clearPromo();
      }, 500);
    });
  }

  renderCartPage();
}

function initThanksPageCleanup() {
  if (!window.location.pathname.includes("thanks.html")) return;
  saveCart([]);
  clearPromo();
}

updateHeaderCartCount();
initCatalogPage();
initCartPage();
initThanksPageCleanup();