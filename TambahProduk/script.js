function submitProduk(event) {
  event.preventDefault();

  let fields = getFields();
  let db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
  db.transaction(function (tx) {
    tx.executeSql(`INSERT INTO Produk (nama, deskripsi, gambar, harga, stok, modal) VALUES (${fields.join(", ")})`);
  });
}


function getFields() {
  let inputs = [
      ...document.querySelectorAll("form [name]"),
  ];

  let values = [];

  inputs.forEach(input => {
      values.push("'" + input.value.trim() + "'");
  });

  return values;
}