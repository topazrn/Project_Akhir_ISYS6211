document.addEventListener('DOMContentLoaded', function () {
  renderCurrentDate();
  new DB().isDbReady();
});

function renderCurrentDate() {
  let eCurrentDate = document.querySelector("header .current-date");
  if (eCurrentDate) {
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let today = new Date();
    eCurrentDate.innerHTML = today.toLocaleDateString("en-US", options);
  }
}

function toRupiah(_int) {
  _int = parseInt(_int);
  let options = {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };
  return _int.toLocaleString('id-ID', options);
}

function getHomeUrl() {
  return `${window.location.protocol}//${window.location.host}`;
}

function getCurrentUrlWithoutQueryString() {
  return `${getHomeUrl()}${window.location.pathname}`;
}

class DB {
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
  import(data) {
    let db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    db.transaction((tx) => {
      Object.keys(data).forEach(table => {
        tx.executeSql(`DROP TABLE IF EXISTS ${table}`);
        let columns = Object.keys(data[table][0]);
        tx.executeSql(`CREATE TABLE IF NOT EXISTS ${table} (id INTEGER PRIMARY KEY, ${columns.join(",")})`);
        data[table].forEach(row => {
          let values = Object.values(row);
          if (!values.includes("schema")) {
            tx.executeSql(`INSERT INTO ${table} (${columns.join(",")}) VALUES ('${values.join("','")}')`);
          }
        });
      });
    });
  }
  getExampleData(callback) {
    fetch(`${getHomeUrl()}/assets/DB-example.json`)
      .then(response => response.json())
      .then(data => callback(data));
  }
  getSchemaData(callback) {
    fetch(`${getHomeUrl()}/assets/DB-schema.json`)
      .then(response => response.json())
      .then(data => callback(data));
  }
  getCurrentData(callback) {
    let data = {};
    this.query(`SELECT tbl_name from sqlite_master WHERE type = 'table'`, (tables) => {
      for (let index = 1; index < tables.length; index++) {
        const table = tables[index].tbl_name;
        this.query(`SELECT * FROM ${table}`, (rows) => {
          rows.forEach(row => {
            delete row.id;
          });
          data[table] = rows;
          if (index == tables.length - 1) callback(data);
        });
      }
    });
  }
  isDbReady() {
    let db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM Produk", [], (tx, results) => {
      }, (error) => {
        this.getSchemaData((data) => {
          this.import(data);
        });
      });
    });
  }
}