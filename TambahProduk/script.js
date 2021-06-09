function submitProduk(event) {
  event.preventDefault();

  let fields = getFields();
  let db = new DB();
  db.query(`INSERT INTO Produk (nama, deskripsi, gambar, harga, stok) VALUES ('${fields.nama}', '${fields.deskripsi}', '${fields.gambar}', ${fields.harga}, ${fields.stok_awal})`, (idProduk) => {
    db.query(`INSERT INTO Restok (idProduk, qty, modal) VALUES (${idProduk}, ${fields.stok_awal}, ${fields.modal})`, (Produk) => {
        alert(`${fields.nama} has been successfully added as a product.`);
        window.location.href = window.location.href;
    });
  });
}


function getFields() {
  let inputs = [
      ...document.querySelectorAll("form [name]"),
  ];

  let fields = {};

  inputs.forEach(input => {
      fields[input.getAttribute("name")] = input.value.trim();
  });

  return fields;
}