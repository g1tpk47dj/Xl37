// fix.js
window.addEventListener("error", function (e) {
  console.error("JS Error:", e.message);
  return true;
});

document.addEventListener("DOMContentLoaded", () => {
  [".modern-alert-overlay", ".image-overlay", ".product-popup"].forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.style.display = "none");
  });
  document.body.style.pointerEvents = "auto";
});

function detectLocation(auto = false) {
  const input = document.getElementById("locationInput");
  const btnText = document.getElementById("detectBtnText");
  const statusText = document.getElementById("statusText");
  if (!input || !navigator.geolocation) return;

  if (btnText) btnText.textContent = "Mendeteksi...";
  if (statusText) statusText.textContent = "Mendeteksi...";

  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat = pos.coords.latitude.toFixed(6);
      const lon = pos.coords.longitude.toFixed(6);
      input.value = `${lat}, ${lon}`;
      if (btnText) btnText.textContent = "Deteksi GPS";
      if (statusText) statusText.textContent = "Ready";
    },
    err => {
      if (!auto) input.value = "Gagal mendeteksi lokasi";
      if (btnText) btnText.textContent = "Deteksi GPS";
      if (statusText) statusText.textContent = "Ready";
    },
    { enableHighAccuracy: false, timeout: 7000, maximumAge: 60000 }
  );
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => detectLocation(true), 500);
  const btn = document.getElementById("detectBtn");
  if (btn) btn.addEventListener("click", () => detectLocation(false));
});

["switchTab","toggleDatePicker","toggleTimePicker",
 "showProductImage","changeQuantity","setQuantity"]
.forEach(fn => {
  if (typeof window[fn] !== "function") window[fn] = function(){};
});
