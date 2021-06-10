document.addEventListener('DOMContentLoaded', function () {
  renderCurrentDate();
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
    maximumFractionDigits: 0,
  };
  return _int.toLocaleString('id-ID', options);
}

function getCurrentUrlWithoutQueryString() {
  return `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
}