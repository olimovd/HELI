document.addEventListener("DOMContentLoaded", async () => {

  // =========================================================
  // ✅ LOAD PRODUCT DATABASE
  // =========================================================
  let products = {};

  try {
    const res = await fetch("data/products.json");
    products = await res.json();
  } catch (err) {
    console.error("❌ products.json failed:", err);
    document.querySelector("#productContainer").innerHTML =
      "<h2 class='text-danger'>Product Data Error</h2>";
    return;
  }

  // =========================================================
  // ✅ GET PRODUCT ID FROM URL
  // =========================================================
  const id = new URLSearchParams(window.location.search).get("id");

  if (!products[id]) {
    document.querySelector("#productContainer").innerHTML =
      "<h2 class='text-danger'>Product Not Found</h2>";
    return;
  }

  const p = products[id];

  // =========================================================
  // ✅ CURRENT LANGUAGE
  // =========================================================
  const lang = localStorage.getItem("heli-lang") || "uz";

  // =========================================================
  // ✅ MAIN IMAGE
  // =========================================================
  const productImage = document.getElementById("productImage");
  productImage.src = p.images[0];
  productImage.alt = p.name[lang];

  // =========================================================
  // ✅ PRODUCT TEXTS (MULTI-LANG)
  // =========================================================
  document.getElementById("productName").textContent = p.name[lang];
  document.getElementById("productShortDesc").textContent = p.shortDesc[lang];
  document.getElementById("productDescription").textContent = p.fullDesc[lang];

  // ✅ PREMIUM SPEC TABLE FILL
    if (p.specs) {
      document.getElementById("spec-capacity").textContent = p.specs.capacity || "-";
      document.getElementById("spec-engine").textContent = p.specs.engine || "-";
      document.getElementById("spec-power").textContent = p.specs.power || "-";
      document.getElementById("spec-liftingHeight").textContent = p.specs.liftingHeight || "-";
      document.getElementById("spec-weight").textContent = p.specs.weight || "-";
      document.getElementById("spec-dimensions").textContent = p.specs.dimensions || "-";
    }



  // =========================================================
  // ✅ FEATURES / CHARACTERISTICS
  // =========================================================
  document.getElementById("productCharacteristics").innerHTML =
    p.features[lang].map(f => `<li>${f}</li>`).join("");

  // =========================================================
  // ✅ RELATED PRODUCTS (SAME CATEGORY)
  // =========================================================
  const relatedWrap = document.getElementById("relatedProducts");

  const related = Object.values(products)
    .filter(x => x.categoryId === p.categoryId && x.id !== p.id)
    .slice(0, 4);

  relatedWrap.innerHTML = related.map(rp => `
    <div class="col-lg-3 col-md-4 col-sm-6">
      <div class="card product-card">
        <img src="${rp.images[0]}" alt="${rp.name[lang]}">
        <div class="card-body">
          <h6>${rp.name[lang]}</h6>
          <a href="product.html?id=${rp.id}" class="btn btn-outline-dark btn-sm mt-2">
            View
          </a>
        </div>
      </div>
    </div>
  `).join("");

  // =========================================================
  // ✅ FIXED & ENHANCED IMAGE ZOOM
  // =========================================================
  productImage.addEventListener("click", () => {

    let overlay = document.getElementById("zoomOverlay");
    if (overlay) overlay.remove();

    overlay = document.createElement("div");
    overlay.id = "zoomOverlay";
    overlay.innerHTML = `
      <div class="zoom-backdrop"></div>
      <img src="${p.images[0]}" class="zoom-image" alt="${p.name[lang]}">
      <span class="zoom-close">&times;</span>
    `;

    document.body.appendChild(overlay);

    const closeBtn = overlay.querySelector(".zoom-close");
    closeBtn.onclick = () => overlay.remove();
    overlay.querySelector(".zoom-backdrop").onclick = () => overlay.remove();
  });

  // =========================================================
  // ✅ REQUEST QUOTE BUTTON (SEND PRODUCT NAME INTO MODAL)
  // =========================================================
  document.querySelectorAll(".request-quote-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const input = document.getElementById("qProduct");
      if (input) input.value = p.name[lang];

      new bootstrap.Modal(document.getElementById("quoteModal")).show();
    });
  });

});
