document.addEventListener("DOMContentLoaded", async () => {

  // LOAD PRODUCT DATABASE FROM JSON FILE
  let products = {};

  try {
    const res = await fetch("data/products.json");
    products = await res.json();
  } catch (err) {
    console.error("❌ products.json failed:", err);
    document.querySelector("#productContainer").innerHTML = "<h2>Product Data Error</h2>";
    return;
  }

  // GET PRODUCT ID FROM URL
  const id = new URLSearchParams(window.location.search).get("id");

  if (!products[id]) {
    const container = document.querySelector("#productContainer");
    if (container) container.innerHTML = "<h2>Product Not Found</h2>";
    return;
  }

  const p = products[id];

  // FILL MAIN INFO
  document.querySelector("#productImage").src = p.img;
  document.querySelector("#productName").textContent = p.name;
  document.querySelector("#productShortDesc").textContent = p.short;
  document.querySelector("#productDescription").textContent = p.desc;

  // CHARACTERISTICS
  document.querySelector("#productCharacteristics").innerHTML =
    p.characteristics.map(c => `<li>${c}</li>`).join("");

  // RELATED PRODUCTS
  const relatedWrap = document.querySelector("#relatedProducts");
  const validRelated = (p.related || []).filter(r => products[r]);

  relatedWrap.innerHTML = validRelated
    .map(rid => {
      const rp = products[rid];
      return `
        <div class="col-lg-3 col-md-4 col-sm-6">
          <div class="card product-card">
            <img src="${rp.img}">
            <div class="card-body">
              <h6>${rp.name}</h6>
              <a href="product.html?id=${rid}" class="btn btn-outline-dark btn-sm mt-2">View</a>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  // IMAGE ZOOM FEATURE
  const imgEl = document.querySelector("#productImage");
  imgEl.addEventListener("click", () => {
    const overlay = document.createElement("div");
    overlay.id = "zoomOverlay";

    overlay.innerHTML = `<img src="${p.img}" alt="${p.name}">`;
    document.body.appendChild(overlay);

    overlay.style.display = "flex";
    overlay.addEventListener("click", () => overlay.remove());
  });

  // QUOTE MODAL
  const quoteModalEl = document.getElementById("quoteModal");
  if (quoteModalEl) {
    const modal = new bootstrap.Modal(quoteModalEl);

    document.querySelectorAll(".request-quote-btn").forEach(btn =>
      btn.addEventListener("click", () => modal.show())
    );

    const qForm = document.getElementById("quoteForm");
    if (qForm) {
      qForm.addEventListener("submit", e => {
        e.preventDefault();
        alert("Request sent!");
        modal.hide();
      });
    }
  }

});
