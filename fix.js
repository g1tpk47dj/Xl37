// fix.js
window.addEventListener("error", function (e) {
  console.error("JS Error ditangkap:", e.message);
  return true;
});

document.addEventListener("DOMContentLoaded", () => {
  const overlays = document.querySelectorAll(
    ".modern-alert-overlay, .image-overlay, .product-popup"
  );
  overlays.forEach(el => (el.style.display = "none"));
  document.body.style.pointerEvents = "auto";
});

function detectLocation(auto = false) {
  const input = document.getElementById("locationInput");
  const btnText = document.getElementById("detectBtnText");
  if (!input || !navigator.geolocation) return;
  if (btnText) btnText.textContent = "Mendeteksi...";
  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat = pos.coords.latitude.toFixed(6);
      const lon = pos.coords.longitude.toFixed(6);
      input.value = `${lat}, ${lon}`;
      if (btnText) btnText.textContent = "Deteksi GPS";
    },
    err => {
      if (!auto) input.value = "Gagal mendeteksi lokasi";
      if (btnText) btnText.textContent = "Deteksi GPS";
    },
    { timeout: 7000, maximumAge: 60000 }
  );
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => detectLocation(true), 800);
  const btn = document.getElementById("detectBtn");
  if (btn) btn.addEventListener("click", () => detectLocation(false));
});

window.switchTab = window.switchTab || function () {};
window.toggleDatePicker = window.toggleDatePicker || function () {};
window.toggleTimePicker = window.toggleTimePicker || function () {};
window.showProductImage = window.showProductImage || function () {};
window.changeQuantity = window.changeQuantity || function () {};
window.setQuantity = window.setQuantity || function () {};
