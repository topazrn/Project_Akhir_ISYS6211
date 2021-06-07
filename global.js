document.addEventListener('DOMContentLoaded', function () {
  renderCurrentDate();
});

function renderCurrentDate() {
  let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  let today = new Date();
  let eCurrentDate = document.querySelector("header .current-date");
  eCurrentDate.innerHTML = today.toLocaleDateString("en-US", options);
}

function toRupiah(_int) {
  _int = parseInt(_int);
  let options = {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  };
  return _int.toLocaleString('id-ID', options);
}