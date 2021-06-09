document.addEventListener('DOMContentLoaded', function () {
  showOrderReport();
  showMostOrdered();
  showTotalRevenue();
  showTotalItemsOrdered();
  showTotalCustomers();
});

function showOrderReport() {
  let db = new DB();
  db.query(`SELECT * FROM TransaksiDetail ORDER BY id ASC LIMIT 10`, (TransaksiDetail) => {
    let tableData = [];
    for (let index = 0; index < TransaksiDetail.length; index++) {
      const order = TransaksiDetail[index];
      db.query(`SELECT date FROM Transaksi WHERE id = ${order.idTransaksi}`, (Transaksi) => {
        db.query(`SELECT * FROM Produk WHERE id = ${order.idProduk}`, (Produk) => {
          tableData.push({
            nama: Produk[0].nama,
            harga: order.harga,
            qty: order.qty,
            total: order.harga * order.qty,
            date: Transaksi[0].date,
          });
          if (index == TransaksiDetail.length - 1) {
            render(tableData);
          }
        });
      })
    }
  });

  function render(orders) {
    let ordersContainer = document.querySelector("article.order tbody");
    let templateOrder = document.querySelectorAll("template")[0].content.querySelector("tr");
    orders.forEach(order => {
      let cloneTemplateOrder = document.importNode(templateOrder, true);
      let tds = cloneTemplateOrder.querySelectorAll("td");
      let nama = tds[0];
      let harga = tds[1];
      let qty = tds[2];
      let total = tds[3];
      let date = tds[4];
      nama.innerText = order.nama;
      harga.innerText = toRupiah(order.harga);
      qty.innerText = order.qty;
      total.innerText = toRupiah(order.total);
      date.innerText = (new Date(parseInt(order.date))).toLocaleString();
      ordersContainer.appendChild(cloneTemplateOrder);
    });
  }
}

function showMostOrdered() {
  let db = new DB();
  db.query(`SELECT idProduk, SUM(qty) AS terjual FROM TransaksiDetail GROUP BY idProduk ORDER BY SUM(qty) DESC LIMIT 3`, (TransaksiDetail) => {
    let renderedData = [];
    for (let index = 0; index < TransaksiDetail.length; index++) {
      const order = TransaksiDetail[index];
      db.query(`SELECT nama, gambar FROM Produk WHERE id = ${order.idProduk}`, (Produk) => {
        renderedData.push({
          nama: Produk[0].nama,
          gambar: Produk[0].gambar,
          terjual: order.terjual,
        });
        if (index == TransaksiDetail.length - 1) {
          render(renderedData);
        }
      })
    }
  });
  
  function render(produks) {
    let produksContainer = document.querySelector("section.most-ordered ul");
    let templateProduk = document.querySelectorAll("template")[1].content.querySelector("li");
    produks.forEach(produk => {
      let cloneTemplateProduk = document.importNode(templateProduk, true);
      let img = cloneTemplateProduk.querySelector("img");
      let nama = cloneTemplateProduk.querySelector("h2");
      let terjual = cloneTemplateProduk.querySelector("data");
      img.src = produk.gambar;
      nama.innerText = produk.nama;
      terjual.innerText = produk.terjual;
      terjual.value = produk.terjual;
      produksContainer.appendChild(cloneTemplateProduk);
    });
  }
}

function showTotalRevenue() {
  let db = new DB();
  db.query(`SELECT SUM(qty * harga) as TotalRevenue FROM TransaksiDetail`, (TransaksiDetail) => {
    render(TransaksiDetail[0].TotalRevenue);
  });
  
  function render(totalRevenue) {
    let h1 = document.querySelector(".stats-container .general .revenue h1");
    h1.innerHTML = toRupiah(totalRevenue);
  }
}

function showTotalItemsOrdered() {
  let db = new DB();
  db.query(`SELECT SUM(qty) as TotalItemsOrdered FROM TransaksiDetail`, (TransaksiDetail) => {
    render(TransaksiDetail[0].TotalItemsOrdered);
  });
  
  function render(totalItemsOrdered) {
    let h1 = document.querySelector(".stats-container .general .ordered h1");
    h1.innerHTML = totalItemsOrdered;
  }
}

function showTotalCustomers() {
  let db = new DB();
  db.query(`SELECT COUNT(*) as TotalCustomers FROM Transaksi`, (TransaksiDetail) => {
    render(TransaksiDetail[0].TotalCustomers);
  });
  
  function render(totalCustomers) {
    let h1 = document.querySelector(".stats-container .general .customers h1");
    h1.innerHTML = totalCustomers;
  }
}