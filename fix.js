// fix.js
window.addEventListener("error", function (e) {
  console.error("JS Error:", e.message);
  return true;
});

document.addEventListener("DOMContentLoaded", () => {
  [".modern-alert-overlay", ".image-overlay", ".product-popup"].forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.style.display = "none");
  });
});

function detectLocation(auto = false) {
  const input = document.getElementById("locationInput");
  const detectBtn = document.getElementById("detectBtn");
  const statusText = document.getElementById("statusText");

  if (!navigator.geolocation) {
    if (input) input.value = "Browser tidak mendukung GPS";
    return;
  }

  if (detectBtn) detectBtn.innerText = "Mendeteksi...";
  if (statusText) statusText.textContent = "Mendeteksi...";

  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat = pos.coords.latitude.toFixed(6);
      const lon = pos.coords.longitude.toFixed(6);
      if (input) input.value = `${lat}, ${lon}`;
      if (detectBtn) detectBtn.innerText = "Deteksi GPS";
      if (statusText) statusText.textContent = "Ready";
    },
    err => {
      if (input && !auto) input.value = "Gagal: " + err.message;
      if (detectBtn) detectBtn.innerText = "Deteksi GPS";
      if (statusText) statusText.textContent = "Ready";
    },
    { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
  );
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => detectLocation(true), 1000);
  const btn = document.getElementById("detectBtn");
  if (btn) btn.addEventListener("click", () => detectLocation(false));
});

["switchTab","toggleDatePicker","toggleTimePicker",
 "showProductImage","changeQuantity","setQuantity"]
.forEach(fn => {
  if (typeof window[fn] !== "function") window[fn] = function(){};
});
