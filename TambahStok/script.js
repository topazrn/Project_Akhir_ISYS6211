document.addEventListener('DOMContentLoaded', function () {
  populateProdukList();
});

function populateProdukList() {
  let datalist = document.querySelector("datalist");
  let db = new DB();
  db.query(`SELECT id, nama FROM Produk`, (products) => {
    products.forEach(produk => {
      let option = document.createElement("option");
      option.value = produk.id;
      option.innerText = produk.nama;
      datalist.appendChild(option);
    });
  });
}

function showDetails() {
  let id = document.getElementById("id");
  let nama = document.getElementById("nama");
  let harga = document.getElementById("harga");
  let stok = document.getElementById("stok");
  let db = new DB();
  db.query(`SELECT nama, harga, stok FROM Produk WHERE id = ${id.value}`, (products) => {
    if (products.length > 0) {
      let produk = products[0];
      nama.value = produk.nama;
      harga.value = produk.harga;
      stok.value = produk.stok;
    } else {
      alert(`Cannot find produk with the id of ${id.value}.`);
      id.focus();
    }
  });
}

function tambahStokProduk(event) {
  event.preventDefault();

  let id = document.getElementById("id");
  let nama = document.getElementById("nama");
  let stok = document.getElementById("stok");
  let stok_tambahan = document.getElementById("stok_tambahan");
  let modal = document.getElementById("modal");
  let db = new DB();
  db.query(`SELECT * FROM Produk WHERE id = ${id.value}`, (products) => {
    if (products.length == 0) {
      alert(`Cannot find produk with the id of ${id.value}.`);
      id.focus();
    } else {
      db.query(`INSERT INTO Restok (idProduk, qty, modal) VALUES (${id.value}, ${stok_tambahan.value}, ${modal.value})`, (idRestok) => {
        db.query(`UPDATE Produk SET stok = stok + ${stok_tambahan.value} WHERE id = ${id.value}`, (success) => {
          alert(`Stok ${nama.value} berhasil ditambah dari ${stok.value} menjadi ${parseInt(stok.value) + parseInt(stok_tambahan.value)}.`);
          window.location.href = getCurrentUrlWithoutQueryString();
        });
      });
    }
  });
}