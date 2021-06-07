document.addEventListener('DOMContentLoaded', function () {
  let db = new DB();
  db.query(`SELECT * FROM Produk WHERE stok > 0`, (resultsStokAda) => {
    db.query(`SELECT * FROM Produk WHERE stok = 0`, (resultsStokHabis) => {
      let products = []
      if (typeof resultsStokAda == "object") products = [...products, ...resultsStokAda];
      if (typeof resultsStokHabis == "object") products = [...products, ...resultsStokHabis];
      renderProducts(products);
    });
  });
});

function addToCart(element) {
  let id = element.getAttribute('data-id');
  if (!getItemsInCart().id.includes(id)) {
    new DB().query(`SELECT * FROM Produk WHERE id = '${id}'`, (results) => {
      renderCart(results);
    });
  }
}

function getItemsInCart() {
  let items = document.querySelectorAll(".cart-product-item");
  let arrItems = [];
  let arrQty = [];
  items.forEach(item => {
    arrItems.push(item.getAttribute('data-id'));
    arrQty.push(item.querySelector("input").value);
  });
  return { id: arrItems, qty: arrQty };
}

function renderProducts(products) {
  let productsContainer = document.querySelector(".products-container ul");
  let templateProduct = document.querySelectorAll("template")[0].content.querySelector("article");
  products.forEach(product => {
    let li = document.createElement("li");
    let cloneTemplateProduct = document.importNode(templateProduct, true);
    let nama = cloneTemplateProduct.querySelector("h2");
    let gambar = cloneTemplateProduct.querySelector("img");
    let harga = cloneTemplateProduct.querySelectorAll("data")[0];
    let stok = cloneTemplateProduct.querySelectorAll("data")[1];
    cloneTemplateProduct.setAttribute("data-id", product.id)
    nama.innerText = product.nama;
    gambar.src = product.gambar;
    harga.innerText = toRupiah(product.harga);
    harga.value = product.harga;
    stok.innerText = product.stok;
    stok.value = product.stok;
    if (product.stok == 0) {
      stok.parentElement.style.color = "var(--red)";
    }
    li.appendChild(cloneTemplateProduct);
    productsContainer.appendChild(li);
  });
}

function renderCart(products) {
  let productsContainer = document.querySelector(".products-checkout tbody");
  let templateProduct = document.querySelectorAll("template")[1].content.querySelector("tr");
  products.forEach(product => {
    let cloneTemplateProduct = document.importNode(templateProduct, true);
    let gambar = cloneTemplateProduct.querySelector("img");
    let nama = cloneTemplateProduct.querySelector("h2");
    let harga = cloneTemplateProduct.querySelector("data");
    let total = cloneTemplateProduct.querySelectorAll("data")[1];
    let qty = cloneTemplateProduct.querySelector("input");
    cloneTemplateProduct.setAttribute("data-id", product.id)
    nama.innerText = product.nama;
    nama.title = product.nama;
    gambar.src = product.gambar;
    harga.innerText = toRupiah(product.harga);
    harga.value = product.harga;
    total.innerText = toRupiah(product.harga);
    total.value = product.harga;
    qty.max = product.stok;
    productsContainer.appendChild(cloneTemplateProduct);
  });
  updateTotal();
}

function onchangeCartItemQuantity(element) {
  let cartItem = element.closest("tr");
  let harga = cartItem.querySelector("data");
  let qty = cartItem.querySelector("input");
  let total = cartItem.querySelectorAll("data")[1];

  let intTotal = harga.value * qty.value;
  if (qty.value > 0) {
    total.innerText = toRupiah(intTotal);
    total.value = intTotal;
    updateTotal();
  } else {
    deleteCartItem(element);
  }
}

function updateTotal() {
  let intTotal = 0;
  const total = document.querySelector("section.checkout h1 > data");
  const arrHarga = document.querySelectorAll(".cart-product-item p.total > data");
  arrHarga.forEach(harga => {
    intTotal += parseInt(harga.value);
  });
  total.innerText = toRupiah(intTotal);
  total.value = intTotal;
}

function checkout() {
  let items = getItemsInCart();
  let db = new DB();
  db.query(`INSERT INTO Transaksi (date) VALUES (${Date.now()})`, (idTransaksi) => {
    for (let index = 0; index < items.id.length; index++) {
      db.query(`SELECT harga FROM Produk WHERE id = ${items.id[index]}`, (produk) => {
        db.query(`INSERT INTO TransaksiDetail (idTransaksi, idProduk, qty, harga) VALUES (${idTransaksi}, ${items.id[index]}, ${items.qty[index]}, ${produk[0].harga})`, (idTransaksiDetail) => {
          db.query(`UPDATE Produk SET stok = stok - ${items.qty[index]} WHERE id = ${items.id[index]}`, (success) => {
            if (index == (items.id.length - 1)) {
              alert("Order has been checked out successfully.");
              window.location.href = window.location.href;
            }
          });
        });
      });
    }
  });
}

function deleteCartItem(element) {
  element.closest(".cart-product-item").remove();
  updateTotal();
}