window.loadCatalogPage = async function () {
  console.log("loadCatalogPage(): start");

  const lang = window.currentLang || "uz";
  console.log("Active language:", lang);

  function pageMessage(html) {
    const grid = document.getElementById("productGrid");
    if (grid) grid.innerHTML = `<div class="col-12 text-center text-muted py-5">${html}</div>`;
  }

  /* Load categories */
  let categories = {};
  try {
    const res = await fetch("data/categories.json");
    if (!res.ok) throw new Error("categories.json error");
    categories = await res.json();
  } catch (err) {
    console.error(err);
    return pageMessage("Failed to load categories.");
  }

  /* Load products */
  let products = {};
  try {
    const res = await fetch("data/products.json");
    if (!res.ok) throw new Error("products.json error");
    products = await res.json();
  } catch (err) {
    console.error(err);
    return pageMessage("Failed to load products.");
  }

  const type = new URLSearchParams(window.location.search).get("type");
  if (!type) return pageMessage("No category selected.");

  const category = categories[type];
  if (!category) return pageMessage("Category not found.");

  /* Set header texts */
  document.getElementById("categoryName").textContent =
    category.name?.[lang] || category.name?.uz || "Category";

  document.getElementById("categoryDesc").textContent =
    category.desc?.[lang] || category.desc?.uz || "";

  /* Background image */
  if (category.image) {
    document.getElementById("categoryHeader").style.backgroundImage =
      `url('${category.image}')`;
  }

  /* Product grid */
  const grid = document.getElementById("productGrid");
  const productIds = Array.isArray(category.products) ? category.products : [];

  if (productIds.length === 0) {
    return pageMessage("No products in this category.");
  }

  const cards = productIds.map(pid => {
    const p = products[pid];
    if (!p) return "";

    const img = p.images?.[0] || "assets/no-image.png";
    const title = p.name?.[lang] || p.name?.uz || "Product";
    const desc = p.shortDesc?.[lang] || p.shortDesc?.uz || "";

    return `
      <div class="col-lg-3 col-md-4 col-sm-6">
        <div class="card product-card h-100">
          <img src="${img}" class="card-img-top" style="height:180px; object-fit:cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${title}</h5>
            <p class="small text-muted">${desc}</p>
            <div class="mt-auto d-flex gap-2">
              <a href="product.html?id=${p.id}" class="btn btn-outline-dark btn-sm">
                View
              </a>
              <button class="btn btn-danger btn-sm request-quote-btn"
                data-product="${escapeHtml(title)}">
                Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");

  grid.innerHTML = cards;

  /* Quote modal open */
  document.querySelectorAll(".request-quote-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const qField = document.getElementById("qProduct");
      if (qField) qField.value = btn.dataset.product;

      const modalEl = document.getElementById("quoteModal");
      if (modalEl) new bootstrap.Modal(modalEl).show();
    });
  });

  console.log("Catalog page rendered ✔");
};

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
