class DB {
  constructor(){
    this.seedData = {
      Produk: [
        {
          nama: "Pop Ice Rasa Durian",
          deskripsi: "Pop Ice is a delicious milkshake beverage that comes in various flavors. Pop Ice can be served blended with ice or shaken in a shaker.",
          gambar: "https://www.forisa.co.id/images/product/popice_Durian_other.png",
          harga: 950,
          stok: 70,
        },
        {
          nama: "Pop Ice Rasa Mangga",
          deskripsi: "Pop Ice is a delicious milkshake beverage that comes in various flavors. Pop Ice can be served blended with ice or shaken in a shaker.",
          gambar: "https://www.forisa.co.id/images/product/popice_Mango_other.png",
          harga: 950,
          stok: 30,
        },
        {
          nama: "Pop Ice Rasa Doger",
          deskripsi: "Pop Ice is a delicious milkshake beverage that comes in various flavors. Pop Ice can be served blended with ice or shaken in a shaker.",
          gambar: "https://www.forisa.co.id/images/product/popice_Doger_other.png",
          harga: 950,
          stok: 60,
        },
        {
          nama: "Pop Ice Rasa Anggur",
          deskripsi: "Pop Ice is a delicious milkshake beverage that comes in various flavors. Pop Ice can be served blended with ice or shaken in a shaker.",
          gambar: "https://www.forisa.co.id/images/product/popice_Grape_other.png",
          harga: 950,
          stok: 99,
        },
        {
          nama: "Pop Ice Rasa Taro",
          deskripsi: "Pop Ice is a delicious milkshake beverage that comes in various flavors. Pop Ice can be served blended with ice or shaken in a shaker.",
          gambar: "https://www.forisa.co.id/images/product/popice_Taro_other.png",
          harga: 950,
          stok: 80,
        },
      ],
      Restok:[
        {
          idProduk: 1,
          qty: 80,
          modal: 60000,
        },
        {
          idProduk: 2,
          qty: 30,
          modal: 20000,
        },
        {
          idProduk: 3,
          qty: 60,
          modal: 40000,
        },
        {
          idProduk: 4,
          qty: 99,
          modal: 80000,
        },
        {
          idProduk: 5,
          qty: 80,
          modal: 60000,
        },
      ],
      Transaksi:[
        {
          date: 1623210617791,
        }
      ],
      TransaksiDetail:[
        {
          idTransaksi: 1,
          idProduk: 1,
          qty: 10,
          harga: 950,
        }
      ],
    };
  }
  query(query, callback = null) {
    let db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    db.transaction((tx) => {
      tx.executeSql(query, [], (tx, results) => {
        if (typeof callback == "function") {
          let callbackResult = null;
          try {
            callbackResult = results.insertId;
          } catch {
            callbackResult = new Array(...results.rows);
          }
          callback(callbackResult);
        }
      });
    });
  }
  seed(){
    let db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    db.transaction((tx) => {  
      Object.keys(this.seedData).forEach(table => {
        tx.executeSql(`DROP TABLE IF EXISTS ${table}`);
        let columns = Object.keys(this.seedData[table][0]);
        tx.executeSql(`CREATE TABLE IF NOT EXISTS ${table} (id INTEGER PRIMARY KEY, ${columns.join(",")})`);
        this.seedData[table].forEach(row => {
          let values = Object.values(row);
          if (!values.includes("seed")) {
            tx.executeSql(`INSERT INTO ${table} (${columns.join(",")}) VALUES ('${values.join("','")}')`);
          }
        });
      });
    });
  }
}