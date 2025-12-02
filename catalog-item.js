// CATEGORY DATA
const categories = {
  1: {
    name: "Electric Forklifts",
    desc: "Silent, eco-friendly and efficient forklifts for warehouses and logistics.",
    image: "assets/category1.webp",
    products: [
      { id: 101, name: "HELI CPD 1.5t", img: "assets/category1.webp", desc: "1.5t compact electric forklift" },
      { id: 102, name: "HELI CPD 2t", img: "assets/category1.webp", desc: "2t electric forklift – long runtime" }
    ]
  },

  2: {
    name: "Diesel Forklifts",
    desc: "Powerful machines for outdoor and heavy-duty applications.",
    image: "assets/category2.webp",
    products: [
      { id: 201, name: "HELI CPCD 3t", img: "assets/p3.webp", desc: "3-ton durable diesel forklift" },
      { id: 202, name: "HELI CPCD 5t", img: "assets/p4.webp", desc: "High lifting capacity diesel model" }
    ]
  },

  3: {
    name: "Reach Trucks",
    desc: "High-lifting solutions for narrow warehouse aisles.",
    image: "assets/reachtruck.webp",
    products: [
      { id: 301, name: "HELI CQD 1.6t", img: "assets/p5.webp", desc: "1.6t reach truck" }
    ]
  },

  4: {
    name: "Electric",
    desc: "Economic lifting equipment for pallet stacking and transport.",
    image: "assets/electer_hero.png",
    products: [
      { id: 401, name: "HELI CDD 1t", img: "assets/electer_1.jpg", desc: "Electric pallet stacker 1t" }
    ]
  }
};

// ---------------- LOAD PAGE ----------------
const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get("type");

if (categories[type]) {

  // HEADER
  document.getElementById("categoryName").textContent = categories[type].name;
  document.getElementById("categoryDesc").textContent = categories[type].desc;

  document.getElementById("categoryHeader").style.backgroundImage =
    `url('${categories[type].image}')`;

  // PRODUCTS
  const grid = document.getElementById("productGrid");
  grid.innerHTML = categories[type].products.map(p => `
    <div class="col-lg-3 col-md-4 col-sm-6">
      <div class="card product-card">
        <img src="${p.img}">
        <div class="card-body">
          <h5 class="card-title">${p.name}</h5>
          <p class="small text-muted">${p.desc}</p>

          <div class="btn-row">
            <a href="product.html?id=${p.id}" class="btn btn-outline-dark btn-sm">View</a>
            <button class="btn btn-danger btn-sm request-quote-btn">Quote</button>
          </div>
        </div>
      </div>
    </div>
  `).join("");

} else {
  document.getElementById("categoryName").textContent = "Category Not Found";
}
