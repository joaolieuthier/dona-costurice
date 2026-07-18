const PHONE = "5581999796165";
let products = [];
let cart = [];
let category = "Todos";

const money = value => value == null ? "Consultar valor" : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
const cleanPhoto = image => /kit-floral|almofada-amamentacao/.test(image);

async function loadProducts() {
  try {
    const response = await fetch("data/products.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Catálogo indisponível");
    products = (await response.json()).filter(product => product.active !== false);
    renderFilters();
    renderProducts();
  } catch (error) {
    document.querySelector("#product-grid").innerHTML = `<p class="loading">Não foi possível carregar o catálogo. Tente atualizar a página.</p>`;
  }
}

function renderFilters() {
  const categories = ["Todos", ...new Set(products.map(product => product.category))];
  document.querySelector("#filters").innerHTML = categories.map(item => `<button type="button" class="${item === category ? "active" : ""}" data-category="${item}">${item}</button>`).join("");
}

function renderProducts() {
  const visible = category === "Todos" ? products : products.filter(product => product.category === category);
  document.querySelector("#product-grid").innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-photo ${cleanPhoto(product.image) ? "clean" : ""}"><img src="${product.image}" alt="${product.name}" loading="lazy"><small>feito à mão</small></div>
      <div class="product-info"><p class="product-category">${product.category}</p><h3>${product.name}</h3><p>${product.description}</p><div><strong>${money(product.price)}</strong><button class="add-product" type="button" data-id="${product.id}" aria-label="Adicionar ${product.name} à sacola">+</button></div></div>
    </article>`).join("") || `<p class="loading">Nenhuma peça nesta categoria.</p>`;
}

function renderCart() {
  document.querySelector("#cart-count").textContent = cart.length;
  const container = document.querySelector("#cart-items");
  if (!cart.length) container.innerHTML = `<div class="empty-cart">♡<p>Sua sacola ainda está vazia.</p></div>`;
  else container.innerHTML = cart.map((product, index) => `<div class="cart-item"><img src="${product.image}" alt=""><div><strong>${product.name}</strong><small>${money(product.price)}</small></div><button type="button" data-remove="${index}" aria-label="Remover ${product.name}">×</button></div>`).join("");
  const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
  document.querySelector("#cart-total").textContent = total ? money(total) : "Sob consulta";
  const names = cart.map(item => item.name).join(", ");
  const text = encodeURIComponent(`Olá, Dona Costurice! Gostaria de conversar sobre estas peças: ${names || "a coleção"}.${total ? ` Total estimado: ${money(total)}.` : ""}`);
  document.querySelector("#send-order").href = `https://wa.me/${PHONE}?text=${text}`;
}

document.addEventListener("click", event => {
  const target = event.target;
  if (target.matches("[data-category]")) { category = target.dataset.category; renderFilters(); renderProducts(); }
  if (target.matches("[data-id]")) { const product = products.find(item => item.id === target.dataset.id); if (product) cart.push(product); renderCart(); document.querySelector("#drawer").hidden = false; }
  if (target.matches("[data-remove]")) { cart.splice(Number(target.dataset.remove), 1); renderCart(); }
  if (target.closest(".cart-button")) document.querySelector("#drawer").hidden = false;
  if (target.matches("#close-cart") || target.matches("#drawer")) document.querySelector("#drawer").hidden = true;
  if (target.matches(".menu-button")) { const nav = document.querySelector(".nav"); nav.classList.toggle("open"); target.setAttribute("aria-expanded", nav.classList.contains("open")); }
  if (target.closest(".nav a")) document.querySelector(".nav").classList.remove("open");
});

let installPrompt;
window.addEventListener("beforeinstallprompt", event => { event.preventDefault(); installPrompt = event; document.querySelector("#install-app").hidden = false; });
document.querySelector("#install-app").addEventListener("click", async () => { if (!installPrompt) return; installPrompt.prompt(); await installPrompt.userChoice; installPrompt = null; document.querySelector("#install-app").hidden = true; });
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js"));

renderCart();
loadProducts();
