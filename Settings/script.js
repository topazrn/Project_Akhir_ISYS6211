function clearDB() {
  let db = new DB();
  db.getSchemaData((data) => {
    db.import(data);
    alert(`Database has been successfully cleared.`);
  });
}

function seedDB() {
  let db = new DB();
  db.getExampleData((data) => {
    db.import(data);
    alert(`Database has been filled with example data.`);
  });
}

function exportDB() {
  let db = new DB();
  db.getCurrentData((data) => {
    saveTemplateAsFile("exportedDB.json", JSON.stringify(data));
  });
}

function importDB() {
  let file = document.querySelector("input[type=file]");
  if (file.files[0] == undefined) {
    alert(`Please choose your exported database to be imported.`);
    return false;
  }

  let reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(file.files[0]);

  function onReaderLoad(event) {
    let data = JSON.parse(event.target.result);
    let db = new DB();
    db.import(data);
    alert(`Database has been successfully imported.`)
  }
}

const saveTemplateAsFile = (filename, jsonToWrite) => {
  const blob = new Blob([jsonToWrite], { type: "text/json" });
  const link = document.createElement("a");

  link.download = filename;
  link.href = window.URL.createObjectURL(blob);
  link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

  const evt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  link.dispatchEvent(evt);
  link.remove()
};